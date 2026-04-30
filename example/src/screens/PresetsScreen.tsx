import { useState } from 'react'
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import {
	CityPicker,
	CountryPicker,
	CountryStateCityPicker,
	StatePicker,
	usePresetSelection,
	type City,
	type Country,
	type PickerSelection,
	type State,
} from 'react-native-country-state-city-picker'
import { Result } from '../components/Result'
import { Section } from '../components/Section'

// A pre-built Country object matching the library type exactly
const INDIA: Country = {
	name: 'India',
	isoCode: 'IN',
	flag: '🇮🇳',
	currency: 'INR',
}

const MAHARASHTRA: State = {
	name: 'Maharashtra',
	isoCode: 'MH',
	countryCode: 'IN',
}

// Simulated data as stored by a backend — plain strings
const BACKEND_USER = {
	country: 'IN', // ISO code
	state: 'Maharashtra', // name
	city: 'Mumbai', // name
}

function BackendPresetDemo() {
	const { selection, isLoading, error } = usePresetSelection(BACKEND_USER)
	const [result, setResult] = useState<Partial<PickerSelection>>(
		BACKEND_USER as never
	)

	if (isLoading) {
		return (
			<View style={styles.loadingRow}>
				<ActivityIndicator size="small" color="#4f46e5" />
				<Text style={styles.loadingText}>Resolving from backend data…</Text>
			</View>
		)
	}

	if (error) {
		return <Text style={styles.errorText}>Error: {error.message}</Text>
	}

	return (
		<>
			<CountryStateCityPicker defaultValue={selection} onSelect={setResult} />
			<Result value={result} />
		</>
	)
}

export function PresetsScreen() {
	// --- Preset country only ---
	const [presetCountry, setPresetCountry] = useState<PickerSelection>({
		country: INDIA,
		state: null,
		city: null,
	})

	// --- Preset country + state + city cascade ---
	const [presetFull, setPresetFull] = useState<PickerSelection>({
		country: INDIA,
		state: MAHARASHTRA,
		city: null,
	})

	// --- Disabled state demonstration (section 3) ---
	const [demoCountry, setDemoCountry] = useState<Country | null>(null)
	const [demoState, setDemoState] = useState<State | null>(null)
	const [demoCity, setDemoCity] = useState<City | null>(null)

	// --- Country + State only (section 5) — separate state so sections don't interfere ---
	const [csCountry, setCsCountry] = useState<Country | null>(null)
	const [csState, setCsState] = useState<State | null>(null)

	// --- Style props ---
	const [styledSelection, setStyledSelection] = useState<PickerSelection>({
		country: null,
		state: null,
		city: null,
	})

	return (
		<ScrollView
			contentContainerStyle={styles.scroll}
			keyboardShouldPersistTaps="handled"
		>
			{/* 1. defaultValue — pre-populated country */}
			<Section
				title="1. defaultValue — country pre-set"
				description="CountryStateCityPicker starts with India pre-selected. State and city are empty — select them to complete the cascade. Verifies that defaultValue seeds the initial state correctly."
			>
				<CountryStateCityPicker
					defaultValue={{ country: INDIA }}
					onSelect={setPresetCountry}
				/>
				<Result value={presetCountry} />
			</Section>

			{/* 2. defaultValue — country + state pre-populated */}
			<Section
				title="2. defaultValue — country + state pre-set"
				description="Starts with India → Maharashtra. Only the city needs to be selected."
			>
				<CountryStateCityPicker
					defaultValue={{ country: INDIA, state: MAHARASHTRA }}
					onSelect={setPresetFull}
				/>
				<Result value={presetFull} />
			</Section>

			{/* 3. Disabled states — nothing selected yet */}
			<Section
				title="3. Disabled cascade states"
				description="StatePicker and CityPicker are disabled until parent is selected. Verify placeholder text, disabled styles, and accessibility hints."
			>
				<View style={styles.group}>
					<CountryPicker
						value={demoCountry}
						onChange={(c) => {
							setDemoCountry(c)
							setDemoState(null)
							setDemoCity(null)
						}}
					/>
					<StatePicker
						countryCode={demoCountry?.isoCode}
						value={demoState}
						onChange={(s) => {
							setDemoState(s)
							setDemoCity(null)
						}}
					/>
					<CityPicker
						countryCode={demoCountry?.isoCode}
						stateCode={demoState?.isoCode}
						value={demoCity}
						onChange={setDemoCity}
					/>
				</View>
				<Result
					value={{ country: demoCountry, state: demoState, city: demoCity }}
				/>
			</Section>

			{/* 4. style / labelStyle / inputStyle props */}
			<Section
				title="4. Style props"
				description="style (wrapper gap), labelStyle (label text), inputStyle (trigger box) — all three applied. Overrides layout without touching theme tokens."
			>
				<CountryStateCityPicker
					onSelect={setStyledSelection}
					style={styles.pickerContainer}
					labelStyle={styles.pickerLabel}
					inputStyle={styles.pickerInput}
				/>
				<Result value={styledSelection} />
			</Section>

			{/* 5. Country + State only (no city) */}
			<Section
				title="5. Country + State (no city)"
				description="Mix-and-match individual pickers — drop CityPicker entirely for use cases that don't need city-level granularity."
			>
				<View style={styles.group}>
					<CountryPicker
						value={csCountry}
						onChange={(c) => {
							setCsCountry(c)
							setCsState(null)
						}}
					/>
					<StatePicker
						countryCode={csCountry?.isoCode}
						value={csState}
						onChange={setCsState}
					/>
				</View>
				<Result value={{ country: csCountry, state: csState }} />
			</Section>

			{/* 6. usePresetSelection — resolve strings from a backend */}
			<Section
				title="6. usePresetSelection — pre-fill from backend"
				description={`Simulates a user re-opening a screen where country/state/city were saved as strings. usePresetSelection resolves them (by name or ISO code, case-insensitive) into full objects before passing to defaultValue.\n\nBackend data: country="IN", state="Maharashtra", city="Mumbai"`}
			>
				<BackendPresetDemo />
			</Section>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: { padding: 16, gap: 20 },
	group: { gap: 12 },
	// Custom style prop overrides
	pickerContainer: { gap: 8 },
	pickerLabel: {
		fontSize: 12,
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 0.6,
		color: '#6b7280',
	},
	pickerInput: { borderRadius: 4, borderWidth: 2, borderColor: '#4f46e5' },
	loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	loadingText: { fontSize: 13, color: '#6b7280' },
	errorText: { fontSize: 13, color: '#dc2626' },
})
