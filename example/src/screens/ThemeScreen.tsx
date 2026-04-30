import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
	CountryStateCityPicker,
	DARK_THEME,
	type PickerSelection,
	type PickerTheme,
} from 'react-native-country-state-city-picker'
import { Section } from '../components/Section'
import { Result } from '../components/Result'

// Deep indigo brand palette — tests that every theme token is wired up
const BRAND_THEME: Partial<PickerTheme> = {
	sheetBackground: '#1e1b4b',
	handleColor: '#4338ca',
	titleColor: '#e0e7ff',
	backdropColor: 'rgba(30,27,75,0.75)',
	searchBackground: '#312e81',
	searchTextColor: '#e0e7ff',
	searchPlaceholderColor: '#6366f1',
	rowTextColor: '#e0e7ff',
	rowSubTextColor: '#a5b4fc',
	rowPressedBackground: '#312e81',
	separatorColor: '#3730a3',
	emptyTextColor: '#6366f1',
	labelColor: '#a5b4fc',
	borderColor: '#4338ca',
	triggerBackground: '#1e1b4b',
	disabledBackground: '#16153a',
	disabledBorderColor: '#312e81',
	pressedBackground: '#312e81',
	valueTextColor: '#e0e7ff',
	placeholderColor: '#6366f1',
	chevronColor: '#818cf8',
	chevronDisabledColor: '#3730a3',
	loadingColor: '#818cf8',
}

// Rose / warm palette
const ROSE_THEME: Partial<PickerTheme> = {
	sheetBackground: '#fff1f2',
	handleColor: '#fda4af',
	titleColor: '#881337',
	backdropColor: 'rgba(136,19,55,0.35)',
	searchBackground: '#ffe4e6',
	searchTextColor: '#881337',
	searchPlaceholderColor: '#fb7185',
	rowTextColor: '#881337',
	rowSubTextColor: '#e11d48',
	rowPressedBackground: '#ffe4e6',
	separatorColor: '#fecdd3',
	emptyTextColor: '#fb7185',
	labelColor: '#be123c',
	borderColor: '#fda4af',
	triggerBackground: '#fff1f2',
	disabledBackground: '#fff8f8',
	disabledBorderColor: '#ffe4e6',
	pressedBackground: '#ffe4e6',
	valueTextColor: '#881337',
	placeholderColor: '#fb7185',
	chevronColor: '#e11d48',
	chevronDisabledColor: '#fecdd3',
	loadingColor: '#e11d48',
}

type ThemeOption = 'auto' | 'dark' | 'brand' | 'rose'

const THEME_MAP: Record<ThemeOption, Partial<PickerTheme> | undefined> = {
	auto: undefined,
	dark: DARK_THEME,
	brand: BRAND_THEME,
	rose: ROSE_THEME,
}

const THEME_OPTIONS: {
	key: ThemeOption
	label: string
	bg: string
	fg: string
}[] = [
	{ key: 'auto', label: 'Auto', bg: '#f3f4f6', fg: '#374151' },
	{ key: 'dark', label: 'Dark', bg: '#1c1c1e', fg: '#f2f2f7' },
	{ key: 'brand', label: 'Brand', bg: '#312e81', fg: '#e0e7ff' },
	{ key: 'rose', label: 'Rose', bg: '#be123c', fg: '#fff1f2' },
]

export function ThemeScreen() {
	const [activeTheme, setActiveTheme] = useState<ThemeOption>('auto')
	const [selection, setSelection] = useState<PickerSelection>({
		country: null,
		state: null,
		city: null,
	})

	const theme = THEME_MAP[activeTheme]
	const screenBg =
		activeTheme === 'dark'
			? '#000000'
			: activeTheme === 'brand'
				? '#0f0e2e'
				: activeTheme === 'rose'
					? '#fff1f2'
					: '#f9fafb'

	return (
		<ScrollView
			contentContainerStyle={[styles.scroll, { backgroundColor: screenBg }]}
			keyboardShouldPersistTaps="handled"
		>
			<Section
				title="Theme switcher"
				description="Pick a palette and open any picker — all theme tokens should apply consistently to triggers, modal sheet, search, rows, and empty state."
			>
				<View style={styles.toggle}>
					{THEME_OPTIONS.map((opt) => (
						<Pressable
							key={opt.key}
							onPress={() => setActiveTheme(opt.key)}
							style={[
								styles.chip,
								{ backgroundColor: opt.bg },
								activeTheme === opt.key && styles.chipActive,
							]}
						>
							<Text style={[styles.chipText, { color: opt.fg }]}>
								{opt.label}
							</Text>
						</Pressable>
					))}
				</View>

				<CountryStateCityPicker onSelect={setSelection} theme={theme} />
				<Result
					value={selection}
					dark={activeTheme === 'dark' || activeTheme === 'brand'}
				/>
			</Section>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: { padding: 16, gap: 20, flexGrow: 1 },
	toggle: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
	chip: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	chipActive: { borderColor: '#4f46e5' },
	chipText: { fontSize: 13, fontWeight: '600' },
})
