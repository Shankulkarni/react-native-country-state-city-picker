import { useMemo, useState } from 'react'
import {
	useColorScheme,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native'
import { useCities } from '../hooks/use-cities'
import { usePickerTheme } from '../hooks/use-picker-theme'
import type { PickerLabels } from '../labels'
import { resolveLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { City } from '../types'
import { PickerModal } from './picker-modal'
import { PickerTrigger } from './picker-trigger'

type CityPickerProps = PickerRenderProps & {
	countryCode: string | null | undefined
	stateCode: string | null | undefined
	value: City | null
	onChange: (city: City) => void
	placeholder?: string
	theme?: Partial<PickerTheme>
	labels?: Partial<PickerLabels>
	testID?: string
	bottomInset?: number
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<TextStyle>
	inputStyle?: StyleProp<ViewStyle>
}

export function CityPicker({
	countryCode,
	stateCode,
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
}: CityPickerProps) {
	const [open, setOpen] = useState(false)
	const [fallback, setFallback] = useState('')
	const { data, isLoading, error } = useCities(countryCode, stateCode)
	const resolvedTheme = usePickerTheme(theme)
	const resolvedLabels = resolveLabels(labels)
	const colorScheme = useColorScheme()

	const isDisabled = !countryCode || !stateCode

	const items = useMemo(
		() =>
			data.map((c) => ({
				label: c.name,
				value: c.name,
			})),
		[data]
	)

	function handleSelect(name: string) {
		const city = data.find((c) => c.name === name)
		if (city) onChange(city)
	}

	return (
		<>
			<PickerTrigger
				label={resolvedLabels.cityLabel}
				value={value?.name ?? null}
				placeholder={
					isDisabled
						? resolvedLabels.cityDisabledPlaceholder
						: (placeholder ?? resolvedLabels.cityPlaceholder)
				}
				isLoading={isLoading}
				isDisabled={isDisabled}
				disabledHint={resolvedLabels.cityDisabledHint}
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
				title={resolvedLabels.cityTitle}
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
