import { useState } from 'react'
import {
	StyleSheet,
	View,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native'
import type { PickerLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { City, Country, PickerSelection, State } from '../types'
import { CityPicker } from './city-picker'
import { CountryPicker } from './country-picker'
import { StatePicker } from './state-picker'

type CountryStateCityPickerProps = PickerRenderProps & {
	onSelect: (selection: PickerSelection) => void
	defaultValue?: Partial<PickerSelection>
	theme?: Partial<PickerTheme>
	labels?: Partial<PickerLabels>
	testID?: string
	bottomInset?: number
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<TextStyle>
	inputStyle?: StyleProp<ViewStyle>
}

export function CountryStateCityPicker({
	onSelect,
	defaultValue,
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
}: CountryStateCityPickerProps) {
	const [country, setCountry] = useState<Country | null>(
		defaultValue?.country ?? null
	)
	const [state, setState] = useState<State | null>(defaultValue?.state ?? null)
	const [city, setCity] = useState<City | null>(defaultValue?.city ?? null)

	function handleCountryChange(selected: Country) {
		setCountry(selected)
		setState(null)
		setCity(null)
		onSelect({ country: selected, state: null, city: null })
	}

	function handleStateChange(selected: State) {
		setState(selected)
		setCity(null)
		onSelect({ country, state: selected, city: null })
	}

	function handleCityChange(selected: City) {
		setCity(selected)
		onSelect({ country, state, city: selected })
	}

	return (
		<View style={[styles.container, style]}>
			<CountryPicker
				value={country}
				onChange={handleCountryChange}
				theme={theme}
				labels={labels}
				bottomInset={bottomInset}
				testID={testID ? `${testID}-country` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
				labelStyle={labelStyle}
				inputStyle={inputStyle}
			/>

			<StatePicker
				countryCode={country?.isoCode}
				value={state}
				onChange={handleStateChange}
				theme={theme}
				labels={labels}
				bottomInset={bottomInset}
				testID={testID ? `${testID}-state` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
				labelStyle={labelStyle}
				inputStyle={inputStyle}
			/>

			<CityPicker
				countryCode={country?.isoCode}
				stateCode={state?.isoCode}
				value={city}
				onChange={handleCityChange}
				theme={theme}
				labels={labels}
				bottomInset={bottomInset}
				testID={testID ? `${testID}-city` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
				labelStyle={labelStyle}
				inputStyle={inputStyle}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
})
