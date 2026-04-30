import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
	CityPicker,
	CountryPicker,
	CountryStateCityPicker,
	StatePicker,
	type City,
	type Country,
	type PickerSelection,
	type State,
} from 'react-native-country-state-city-picker'
import { Section } from '../components/Section'
import { Result } from '../components/Result'

export function BasicScreen() {
	// --- Composite ---
	const [selection, setSelection] = useState<PickerSelection>({
		country: null,
		state: null,
		city: null,
	})

	// --- Controlled individual ---
	const [country, setCountry] = useState<Country | null>(null)
	const [state, setState] = useState<State | null>(null)
	const [city, setCity] = useState<City | null>(null)

	return (
		<ScrollView
			contentContainerStyle={styles.scroll}
			keyboardShouldPersistTaps="handled"
		>
			{/* 1. Composite — single component, self-managed cascade */}
			<Section
				title="1. Composite picker"
				description="CountryStateCityPicker — one component, manages the country → state → city cascade internally."
			>
				<CountryStateCityPicker onSelect={setSelection} />
				<Result value={selection} />
			</Section>

			{/* 2. Individual controlled pickers */}
			<Section
				title="2. Controlled individual pickers"
				description="CountryPicker + StatePicker + CityPicker wired manually. Lets you embed them anywhere independently."
			>
				<View style={styles.group}>
					<CountryPicker
						value={country}
						onChange={(c) => {
							setCountry(c)
							setState(null)
							setCity(null)
						}}
					/>
					<StatePicker
						countryCode={country?.isoCode}
						value={state}
						onChange={(s) => {
							setState(s)
							setCity(null)
						}}
					/>
					<CityPicker
						countryCode={country?.isoCode}
						stateCode={state?.isoCode}
						value={city}
						onChange={setCity}
					/>
				</View>
				<Result value={{ country, state, city }} />
			</Section>

			{/* 3. Country picker only */}
			<Section
				title="3. Country picker only"
				description="Using just CountryPicker in isolation — e.g. for a phone flag selector or nationality field."
			>
				<CountryPicker
					value={country}
					onChange={(c) => {
						setCountry(c)
						setState(null)
						setCity(null)
					}}
				/>
				<Result value={country} />
			</Section>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: { padding: 16, gap: 20 },
	group: { gap: 12 },
})
