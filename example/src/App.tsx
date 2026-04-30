import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
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

function Demo() {
	const [selection, setSelection] = useState<PickerSelection>({
		country: null,
		state: null,
		city: null,
	})

	const [country, setCountry] = useState<Country | null>(null)
	const [state, setState] = useState<State | null>(null)
	const [city, setCity] = useState<City | null>(null)

	return (
		<ScrollView
			contentContainerStyle={styles.scroll}
			keyboardShouldPersistTaps="handled"
		>
			<Text style={styles.heading}>Composite (Standalone)</Text>
			<CountryStateCityPicker onSelect={setSelection} />
			<Text style={styles.result}>{JSON.stringify(selection, null, 2)}</Text>

			<Text style={styles.heading}>Controlled (Individual)</Text>
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
		</ScrollView>
	)
}

export default function App() {
	return (
		<SafeAreaView style={styles.safe}>
			<Demo />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: '#f9fafb' },
	scroll: { padding: 20, gap: 12 },
	heading: { fontSize: 17, fontWeight: '700', color: '#111827', marginTop: 16 },
	result: {
		fontSize: 12,
		color: '#6b7280',
		fontFamily: 'monospace',
		marginTop: 8,
	},
	group: { gap: 12 },
})
