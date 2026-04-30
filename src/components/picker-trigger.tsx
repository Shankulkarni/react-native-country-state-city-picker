import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native'
import type { PickerLabels } from '../labels'
import type { TriggerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'

type PickerTriggerProps = {
	label: string
	value: string | null
	placeholder: string
	isLoading: boolean
	isDisabled: boolean
	disabledHint?: string
	hasError: boolean
	fallbackValue: string
	theme: PickerTheme
	labels: PickerLabels
	testID?: string
	renderTrigger?: (props: TriggerRenderProps) => React.ReactNode
	onFallbackChange: (text: string) => void
	onPress: () => void
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<TextStyle>
	inputStyle?: StyleProp<ViewStyle>
}

export function PickerTrigger({
	label,
	value,
	placeholder,
	isLoading,
	isDisabled,
	disabledHint,
	hasError,
	fallbackValue,
	theme,
	labels,
	testID,
	renderTrigger,
	onFallbackChange,
	onPress,
	style,
	labelStyle,
	inputStyle,
}: PickerTriggerProps) {
	// When renderTrigger is provided the consumer owns the entire trigger UI —
	// including error, loading, and disabled states.
	if (renderTrigger) {
		return (
			<>
				{renderTrigger({
					label,
					displayValue: value,
					placeholder,
					isLoading,
					isDisabled,
					hasError,
					onPress,
				})}
			</>
		)
	}

	// Default UI below.

	const triggerAccessibilityLabel = isLoading
		? labels.loadingLabel(label)
		: value
			? labels.selectedValueLabel(label, value)
			: placeholder

	return (
		<View style={[styles.container, style]}>
			<Text style={[styles.label, { color: theme.labelColor }, labelStyle]}>
				{label}
			</Text>

			{/* Live region announces loading / error state changes to screen readers */}
			{(isLoading || hasError) && (
				<Text
					accessibilityLiveRegion="polite"
					importantForAccessibility="no-hide-descendants"
					style={styles.liveRegion}
				>
					{isLoading ? labels.loadingLabel(label) : labels.errorLabel(label)}
				</Text>
			)}

			{hasError ? (
				<TextInput
					style={[
						styles.input,
						styles.fallbackInput,
						{
							borderColor: theme.borderColor,
							backgroundColor: theme.triggerBackground,
							color: theme.valueTextColor,
						},
						inputStyle,
					]}
					value={fallbackValue}
					onChangeText={onFallbackChange}
					placeholder={labels.fallbackPlaceholder(label)}
					placeholderTextColor={theme.placeholderColor}
					autoCapitalize="words"
					accessibilityLabel={labels.fallbackInputLabel(label)}
					accessibilityHint={labels.fallbackInputHint(label)}
					testID={testID ? `${testID}-fallback-input` : undefined}
				/>
			) : (
				<Pressable
					style={({ pressed }) => [
						styles.input,
						{
							borderColor: isDisabled
								? theme.disabledBorderColor
								: theme.borderColor,
							backgroundColor: isDisabled
								? theme.disabledBackground
								: pressed
									? theme.pressedBackground
									: theme.triggerBackground,
						},
						inputStyle,
					]}
					onPress={onPress}
					disabled={isDisabled || isLoading}
					accessibilityRole="button"
					accessibilityLabel={triggerAccessibilityLabel}
					accessibilityHint={
						isDisabled ? disabledHint : labels.openPickerHint(label)
					}
					accessibilityState={{ disabled: isDisabled, busy: isLoading }}
					testID={testID ? `${testID}-trigger` : undefined}
				>
					<Text
						style={[
							styles.valueText,
							{ color: value ? theme.valueTextColor : theme.placeholderColor },
						]}
						numberOfLines={1}
					>
						{value ?? placeholder}
					</Text>

					{isLoading ? (
						<ActivityIndicator size="small" color={theme.loadingColor} />
					) : (
						<Text
							style={[
								styles.chevron,
								{
									color: isDisabled
										? theme.chevronDisabledColor
										: theme.chevronColor,
								},
							]}
							accessibilityElementsHidden
							importantForAccessibility="no"
						>
							›
						</Text>
					)}
				</Pressable>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 6,
	},
	label: {
		fontSize: 13,
		fontWeight: '500',
	},
	liveRegion: {
		position: 'absolute',
		width: 1,
		height: 1,
		overflow: 'hidden',
		opacity: 0,
	},
	input: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 48,
		borderRadius: 10,
		borderWidth: 1,
		paddingHorizontal: 14,
	},
	fallbackInput: {
		fontSize: 15,
	},
	valueText: {
		fontSize: 15,
		flex: 1,
	},
	chevron: {
		fontSize: 22,
		lineHeight: 26,
	},
})
