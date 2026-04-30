import { useMemo, useState } from 'react'
import {
	useColorScheme,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native'
import { useCountries } from '../hooks/use-countries'
import { usePickerTheme } from '../hooks/use-picker-theme'
import type { PickerLabels } from '../labels'
import { resolveLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { Country } from '../types'
import { PickerModal } from './picker-modal'
import { PickerTrigger } from './picker-trigger'

type CountryPickerProps = PickerRenderProps & {
	value: Country | null
	onChange: (country: Country) => void
	placeholder?: string
	theme?: Partial<PickerTheme>
	labels?: Partial<PickerLabels>
	testID?: string
	bottomInset?: number
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<TextStyle>
	inputStyle?: StyleProp<ViewStyle>
}

export function CountryPicker({
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
}: CountryPickerProps) {
	const [open, setOpen] = useState(false)
	const [fallback, setFallback] = useState('')
	const { data, isLoading, error } = useCountries()
	const resolvedTheme = usePickerTheme(theme)
	const resolvedLabels = resolveLabels(labels)
	const colorScheme = useColorScheme()

	const items = useMemo(
		() =>
			data.map((c) => ({
				label: `${c.flag}  ${c.name}`,
				value: c.isoCode,
			})),
		[data]
	)

	function handleSelect(isoCode: string) {
		const country = data.find((c) => c.isoCode === isoCode)
		if (country) onChange(country)
	}

	const displayValue = value ? `${value.flag}  ${value.name}` : null

	return (
		<>
			<PickerTrigger
				label={resolvedLabels.countryLabel}
				value={displayValue}
				placeholder={placeholder ?? resolvedLabels.countryPlaceholder}
				isLoading={isLoading}
				isDisabled={false}
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
				title={resolvedLabels.countryTitle}
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
