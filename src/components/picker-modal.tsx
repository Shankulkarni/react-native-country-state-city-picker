import {
	Animated,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { useEffect, useMemo, useRef, useState, type ElementRef } from 'react'
import type { PickerLabels } from '../labels'
import type {
	EmptyRenderProps,
	ItemRenderProps,
	SearchRenderProps,
} from '../render-props'
import type { PickerTheme } from '../theme'
import { useDebounce } from '../hooks/use-debounce'
import { matchesSearch } from '../utils/search'

type Item = {
	label: string
	subLabel?: string
	value: string
}

type PickerModalProps = {
	visible: boolean
	items: Item[]
	title: string
	theme: PickerTheme
	labels: PickerLabels
	isDark: boolean
	bottomInset: number
	testID?: string
	renderItem?: (props: ItemRenderProps) => React.ReactNode
	renderSearch?: (props: SearchRenderProps) => React.ReactNode
	renderEmpty?: (props: EmptyRenderProps) => React.ReactNode
	onSelect: (value: string) => void
	onClose: () => void
}

const SLIDE_DURATION = 260

function Separator({ color }: { color: string }) {
	return <View style={[styles.separator, { backgroundColor: color }]} />
}

export function PickerModal({
	visible,
	items,
	title,
	theme,
	labels,
	isDark,
	bottomInset,
	testID,
	renderItem,
	renderSearch,
	renderEmpty,
	onSelect,
	onClose,
}: PickerModalProps) {
	const [search, setSearch] = useState('')
	const [keyboardVisible, setKeyboardVisible] = useState(false)
	const translateY = useRef(new Animated.Value(600)).current
	const searchRef = useRef<ElementRef<typeof TextInput>>(null)

	useEffect(() => {
		const show = Keyboard.addListener('keyboardWillShow', () =>
			setKeyboardVisible(true)
		)
		const hide = Keyboard.addListener('keyboardWillHide', () =>
			setKeyboardVisible(false)
		)
		return () => {
			show.remove()
			hide.remove()
		}
	}, [])

	useEffect(() => {
		if (visible) {
			setSearch('')
			Animated.timing(translateY, {
				toValue: 0,
				duration: SLIDE_DURATION,
				useNativeDriver: true,
			}).start(() => {
				// Shift focus into modal after slide-in completes
				searchRef.current?.focus()
			})
		} else {
			Animated.timing(translateY, {
				toValue: 600,
				duration: SLIDE_DURATION,
				useNativeDriver: true,
			}).start()
		}
	}, [visible, translateY])

	const debouncedSearch = useDebounce(search, 150)
	const filtered = useMemo(
		() => items.filter((item) => matchesSearch(item.label, debouncedSearch)),
		[items, debouncedSearch]
	)

	function handleSelect(value: string) {
		onSelect(value)
		onClose()
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={onClose}
			statusBarTranslucent
			accessibilityViewIsModal
			testID={testID ? `${testID}-modal` : undefined}
		>
			<TouchableWithoutFeedback
				onPress={onClose}
				accessibilityRole="button"
				accessibilityLabel={labels.closeModal(title)}
				testID={testID ? `${testID}-backdrop` : undefined}
			>
				<View
					style={[styles.backdrop, { backgroundColor: theme.backdropColor }]}
				/>
			</TouchableWithoutFeedback>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={styles.avoidingView}
				pointerEvents="box-none"
			>
				<Animated.View
					style={[
						styles.sheet,
						{
							backgroundColor: theme.sheetBackground,
							paddingBottom: keyboardVisible ? 0 : bottomInset,
							transform: [{ translateY }],
						},
					]}
				>
					{/* Decorative drag handle — hidden from screen reader */}
					<View
						style={[styles.handle, { backgroundColor: theme.handleColor }]}
						importantForAccessibility="no"
						accessibilityElementsHidden
					/>

					<Text
						style={[styles.title, { color: theme.titleColor }]}
						accessibilityRole="header"
					>
						{title}
					</Text>

					{renderSearch ? (
						renderSearch({
							value: search,
							placeholder: labels.searchPlaceholder,
							onChangeText: setSearch,
						})
					) : (
						<TextInput
							ref={searchRef}
							style={[
								styles.search,
								{
									backgroundColor: theme.searchBackground,
									color: theme.searchTextColor,
								},
							]}
							value={search}
							onChangeText={setSearch}
							placeholder={labels.searchPlaceholder}
							placeholderTextColor={theme.searchPlaceholderColor}
							clearButtonMode="while-editing"
							autoCorrect={false}
							autoCapitalize="none"
							returnKeyType="search"
							keyboardAppearance={isDark ? 'dark' : 'light'}
							accessibilityLabel={labels.searchAccessibilityLabel(title)}
							testID={testID ? `${testID}-search` : undefined}
						/>
					)}

					<FlatList
						data={filtered}
						keyExtractor={(item) => item.value}
						keyboardShouldPersistTaps="handled"
						accessibilityRole="list"
						style={styles.list}
						renderItem={({ item }) =>
							renderItem ? (
								renderItem({
									label: item.label,
									value: item.value,
									onSelect: () => handleSelect(item.value),
								})
							) : (
								<Pressable
									style={({ pressed }) => [
										styles.row,
										pressed && {
											backgroundColor: theme.rowPressedBackground,
										},
									]}
									onPress={() => handleSelect(item.value)}
									accessibilityRole="button"
									accessibilityLabel={item.label}
									testID={testID ? `${testID}-option-${item.value}` : undefined}
								>
									<Text
										style={[styles.rowLabel, { color: theme.rowTextColor }]}
									>
										{item.label}
									</Text>
									{item.subLabel ? (
										<Text
											style={[
												styles.rowSubLabel,
												{ color: theme.rowSubTextColor },
											]}
										>
											{item.subLabel}
										</Text>
									) : null}
								</Pressable>
							)
						}
						ItemSeparatorComponent={() => (
							<Separator color={theme.separatorColor} />
						)}
						ListEmptyComponent={
							renderEmpty
								? () => <>{renderEmpty({ query: search })}</>
								: () => (
										<Text
											style={[styles.empty, { color: theme.emptyTextColor }]}
											accessibilityLiveRegion="polite"
										>
											{labels.noResults}
										</Text>
									)
						}
					/>
				</Animated.View>
			</KeyboardAvoidingView>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	avoidingView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	sheet: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 32,
		height: '80%',
	},
	list: {
		flex: 1,
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		alignSelf: 'center',
		marginTop: 12,
		marginBottom: 8,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	search: {
		marginHorizontal: 16,
		marginBottom: 8,
		height: 40,
		borderRadius: 10,
		paddingHorizontal: 12,
		fontSize: 15,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	rowLabel: {
		fontSize: 15,
		flex: 1,
	},
	rowSubLabel: {
		fontSize: 13,
		marginStart: 8,
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		marginHorizontal: 16,
	},
	empty: {
		textAlign: 'center',
		paddingVertical: 32,
		fontSize: 15,
	},
})
