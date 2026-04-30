import { useMemo, useState } from 'react'
import {
	useColorScheme,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native'
import { useStates } from '../hooks/use-states'
import { usePickerTheme } from '../hooks/use-picker-theme'
import type { PickerLabels } from '../labels'
import { resolveLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { State } from '../types'
import { PickerModal } from './picker-modal'
import { PickerTrigger } from './picker-trigger'

type StatePickerProps = PickerRenderProps & {
	countryCode: string | null | undefined
	value: State | null
	onChange: (state: State) => void
	placeholder?: string
	theme?: Partial<PickerTheme>
	labels?: Partial<PickerLabels>
	testID?: string
	bottomInset?: number
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<TextStyle>
	inputStyle?: StyleProp<ViewStyle>
}

export function StatePicker({
	countryCode,
	value,
	onChange,
	placeholder,
	theme,
	labels,
	testID,
	bottomInset = 0,
	renderTrigger,
	renderItem,
	renderSearch,
	renderEmpty,
	style,
	labelStyle,
	inputStyle,
}: StatePickerProps) {
	const [open, setOpen] = useState(false)
	const [fallback, setFallback] = useState('')
	const { data, isLoading, error } = useStates(countryCode)
	const resolvedTheme = usePickerTheme(theme)
	const resolvedLabels = resolveLabels(labels)
	const colorScheme = useColorScheme()

	const isDisabled = !countryCode

	const items = useMemo(
		() =>
			data.map((s) => ({
				label: s.name,
				value: s.isoCode,
			})),
		[data]
	)

	function handleSelect(isoCode: string) {
		const state = data.find((s) => s.isoCode === isoCode)
		if (state) onChange(state)
	}

	return (
		<>
			<PickerTrigger
				label={resolvedLabels.stateLabel}
				value={value?.name ?? null}
				placeholder={
					isDisabled
						? resolvedLabels.stateDisabledPlaceholder
						: (placeholder ?? resolvedLabels.statePlaceholder)
				}
				isLoading={isLoading}
				isDisabled={isDisabled}
				disabledHint={resolvedLabels.stateDisabledHint}
				hasError={!!error}
				fallbackValue={fallback}
				theme={resolvedTheme}
				labels={resolvedLabels}
				testID={testID}
				renderTrigger={renderTrigger}
				onFallbackChange={setFallback}
				onPress={() => setOpen(true)}
				style={style}
				labelStyle={labelStyle}
				inputStyle={inputStyle}
			/>

			<PickerModal
				visible={open}
				items={items}
				title={resolvedLabels.stateTitle}
				theme={resolvedTheme}
				labels={resolvedLabels}
				isDark={colorScheme === 'dark'}
				bottomInset={bottomInset}
				testID={testID}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
				onSelect={handleSelect}
				onClose={() => setOpen(false)}
			/>
		</>
	)
}
