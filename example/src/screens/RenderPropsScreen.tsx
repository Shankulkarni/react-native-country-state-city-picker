import { useState } from 'react'
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import {
	CountryStateCityPicker,
	type EmptyRenderProps,
	type ItemRenderProps,
	type PickerSelection,
	type SearchRenderProps,
	type TriggerRenderProps,
} from 'react-native-country-state-city-picker'
import { Section } from '../components/Section'
import { Result } from '../components/Result'

// ---------------------------------------------------------------------------
// Custom trigger — pill button with an accent left border
// Tests: label, displayValue, placeholder, isLoading, isDisabled, onPress
// ---------------------------------------------------------------------------
function CustomTrigger({
	label,
	displayValue,
	placeholder,
	isLoading,
	isDisabled,
	onPress,
}: TriggerRenderProps) {
	return (
		<Pressable
			onPress={onPress}
			disabled={isDisabled}
			style={[styles.trigger, isDisabled && styles.triggerDisabled]}
		>
			<View style={[styles.accent, isDisabled && styles.accentDisabled]} />
			<View style={styles.triggerInner}>
				<Text style={[styles.triggerLabel, isDisabled && styles.textMuted]}>
					{label}
				</Text>
				<Text
					style={[
						styles.triggerValue,
						!displayValue && styles.textPlaceholder,
						isDisabled && styles.textMuted,
					]}
				>
					{isLoading ? '⏳ Loading…' : (displayValue ?? placeholder)}
				</Text>
			</View>
			<Text style={[styles.arrow, isDisabled && styles.textMuted]}>›</Text>
		</Pressable>
	)
}

// ---------------------------------------------------------------------------
// Custom item row — badge-style value on the right
// Tests: label, value, onSelect
// ---------------------------------------------------------------------------
function CustomItem({ label, value, onSelect }: ItemRenderProps) {
	return (
		<Pressable onPress={onSelect} style={styles.item}>
			<Text style={styles.itemLabel}>{label}</Text>
			<View style={styles.badge}>
				<Text style={styles.badgeText}>{value}</Text>
			</View>
		</Pressable>
	)
}

// ---------------------------------------------------------------------------
// Custom search — underline style instead of rounded box
// Tests: value, placeholder, onChangeText
// ---------------------------------------------------------------------------
function CustomSearch({ value, placeholder, onChangeText }: SearchRenderProps) {
	return (
		<View style={styles.searchRow}>
			<Text style={styles.searchIcon}>🔍</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor="#9ca3af"
				style={styles.searchInput}
				autoCorrect={false}
				autoCapitalize="none"
			/>
			{value.length > 0 && (
				<Pressable onPress={() => onChangeText('')}>
					<Text style={styles.searchClear}>✕</Text>
				</Pressable>
			)}
		</View>
	)
}

// ---------------------------------------------------------------------------
// Custom empty state — friendly illustration + query echo
// Tests: query
// ---------------------------------------------------------------------------
function CustomEmpty({ query }: EmptyRenderProps) {
	return (
		<View style={styles.empty}>
			<Text style={styles.emptyEmoji}>🌍</Text>
			<Text style={styles.emptyTitle}>Nothing found</Text>
			{query.length > 0 && (
				<Text style={styles.emptyQuery}>No match for "{query}"</Text>
			)}
		</View>
	)
}

export function RenderPropsScreen() {
	const [selection, setSelection] = useState<PickerSelection>({
		country: null,
		state: null,
		city: null,
	})

	return (
		<ScrollView
			contentContainerStyle={styles.scroll}
			keyboardShouldPersistTaps="handled"
		>
			{/* All four render props active */}
			<Section
				title="All render props"
				description="renderTrigger + renderItem + renderSearch + renderEmpty — every default UI element is replaced. Open any picker and type something that returns no results to test renderEmpty."
			>
				<CountryStateCityPicker
					onSelect={setSelection}
					renderTrigger={(props) => <CustomTrigger {...props} />}
					renderItem={(props) => <CustomItem {...props} />}
					renderSearch={(props) => <CustomSearch {...props} />}
					renderEmpty={(props) => <CustomEmpty {...props} />}
				/>
				<Result value={selection} />
			</Section>

			{/* Trigger only — list and search stay default */}
			<Section
				title="renderTrigger only"
				description="Only the trigger button is replaced. The modal sheet (search + list + empty) keeps the default UI."
			>
				<CountryStateCityPicker
					onSelect={() => {}}
					renderTrigger={(props) => <CustomTrigger {...props} />}
				/>
			</Section>

			{/* Item only — trigger and search stay default */}
			<Section
				title="renderItem only"
				description="Default trigger and search, but each list row is replaced with the badge-style custom row."
			>
				<CountryStateCityPicker
					onSelect={() => {}}
					renderItem={(props) => <CustomItem {...props} />}
				/>
			</Section>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: { padding: 16, gap: 20 },

	// Custom trigger
	trigger: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fafafa',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 10,
		overflow: 'hidden',
	},
	triggerDisabled: { opacity: 0.45 },
	accent: { width: 4, alignSelf: 'stretch', backgroundColor: '#4f46e5' },
	accentDisabled: { backgroundColor: '#d1d5db' },
	triggerInner: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
	triggerLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#4f46e5',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	triggerValue: { fontSize: 15, color: '#111827', marginTop: 2 },
	textPlaceholder: { color: '#9ca3af' },
	textMuted: { color: '#d1d5db' },
	arrow: { fontSize: 22, color: '#6b7280', paddingHorizontal: 12 },

	// Custom item
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 8,
	},
	itemLabel: { flex: 1, fontSize: 15, color: '#111827' },
	badge: {
		backgroundColor: '#eef2ff',
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 3,
	},
	badgeText: { fontSize: 12, fontWeight: '600', color: '#4f46e5' },

	// Custom search
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 16,
		marginBottom: 8,
		borderBottomWidth: 2,
		borderBottomColor: '#4f46e5',
		gap: 8,
	},
	searchIcon: { fontSize: 16 },
	searchInput: { flex: 1, height: 40, fontSize: 15, color: '#111827' },
	searchClear: { fontSize: 14, color: '#9ca3af', paddingHorizontal: 4 },

	// Custom empty
	empty: { alignItems: 'center', paddingVertical: 32, gap: 6 },
	emptyEmoji: { fontSize: 36 },
	emptyTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
	emptyQuery: { fontSize: 13, color: '#9ca3af' },
})
