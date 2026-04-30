import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
	CountryStateCityPicker,
	type PickerLabels,
	type PickerSelection,
} from 'react-native-country-state-city-picker'
import { Section } from '../components/Section'
import { Result } from '../components/Result'

// --- Language packs ---

const SPANISH: Partial<PickerLabels> = {
	countryLabel: 'País',
	stateLabel: 'Estado / Provincia',
	cityLabel: 'Ciudad',
	countryTitle: 'Seleccionar país',
	stateTitle: 'Seleccionar estado',
	cityTitle: 'Seleccionar ciudad',
	countryPlaceholder: 'Selecciona un país',
	statePlaceholder: 'Selecciona un estado',
	cityPlaceholder: 'Selecciona una ciudad',
	stateDisabledPlaceholder: 'Primero selecciona un país',
	cityDisabledPlaceholder: 'Primero selecciona un estado',
	stateDisabledHint: 'Selecciona un país para habilitar',
	cityDisabledHint: 'Selecciona un estado para habilitar',
	searchPlaceholder: 'Buscar…',
	noResults: 'Sin resultados',
	loadingLabel: (label) => `Cargando ${label.toLocaleLowerCase()}…`,
	errorLabel: (label) =>
		`No se pudo cargar ${label.toLocaleLowerCase()}. Escribe manualmente.`,
	closeModal: (title) => `Cerrar ${title}`,
	searchAccessibilityLabel: (title) => `Buscar ${title}`,
	openPickerHint: (label) => `Abre el selector de ${label.toLocaleLowerCase()}`,
	selectedValueLabel: (label, value) => `${label}: ${value}`,
	fallbackPlaceholder: (label) =>
		`Escribe ${label.toLocaleLowerCase()} manualmente`,
	fallbackInputLabel: (label) =>
		`Campo de texto para ${label.toLocaleLowerCase()}`,
	fallbackInputHint: (label) =>
		`Escribe el nombre ${label.toLocaleLowerCase()} manualmente`,
}

const FRENCH: Partial<PickerLabels> = {
	countryLabel: 'Pays',
	stateLabel: 'État / Province',
	cityLabel: 'Ville',
	countryTitle: 'Sélectionner un pays',
	stateTitle: 'Sélectionner un état',
	cityTitle: 'Sélectionner une ville',
	countryPlaceholder: 'Choisir un pays',
	statePlaceholder: 'Choisir un état',
	cityPlaceholder: 'Choisir une ville',
	stateDisabledPlaceholder: "Choisissez d'abord un pays",
	cityDisabledPlaceholder: "Choisissez d'abord un état",
	stateDisabledHint: 'Sélectionnez un pays pour activer',
	cityDisabledHint: 'Sélectionnez un état pour activer',
	searchPlaceholder: 'Rechercher…',
	noResults: 'Aucun résultat',
	loadingLabel: (label) => `Chargement des ${label.toLocaleLowerCase()}…`,
	errorLabel: (label) =>
		`Impossible de charger les ${label.toLocaleLowerCase()}. Saisissez manuellement.`,
	closeModal: (title) => `Fermer ${title}`,
	searchAccessibilityLabel: (title) => `Rechercher ${title}`,
	openPickerHint: (label) => `Ouvre le sélecteur ${label.toLocaleLowerCase()}`,
	selectedValueLabel: (label, value) => `${label} : ${value}`,
	fallbackPlaceholder: (label) =>
		`Saisir ${label.toLocaleLowerCase()} manuellement`,
	fallbackInputLabel: (label) => `Champ texte ${label.toLocaleLowerCase()}`,
	fallbackInputHint: (label) =>
		`Tapez le nom ${label.toLocaleLowerCase()} manuellement`,
}

const HINDI: Partial<PickerLabels> = {
	countryLabel: 'देश',
	stateLabel: 'राज्य / प्रांत',
	cityLabel: 'शहर',
	countryTitle: 'देश चुनें',
	stateTitle: 'राज्य चुनें',
	cityTitle: 'शहर चुनें',
	countryPlaceholder: 'देश चुनें',
	statePlaceholder: 'राज्य चुनें',
	cityPlaceholder: 'शहर चुनें',
	stateDisabledPlaceholder: 'पहले देश चुनें',
	cityDisabledPlaceholder: 'पहले राज्य चुनें',
	searchPlaceholder: 'खोजें…',
	noResults: 'कोई परिणाम नहीं',
}

type Lang = 'en' | 'es' | 'fr' | 'hi'
const LANG_MAP: Record<Lang, Partial<PickerLabels> | undefined> = {
	en: undefined,
	es: SPANISH,
	fr: FRENCH,
	hi: HINDI,
}
const LANG_OPTIONS: { key: Lang; label: string }[] = [
	{ key: 'en', label: '🇬🇧 EN' },
	{ key: 'es', label: '🇪🇸 ES' },
	{ key: 'fr', label: '🇫🇷 FR' },
	{ key: 'hi', label: '🇮🇳 HI' },
]

export function LabelsScreen() {
	const [lang, setLang] = useState<Lang>('en')
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
			<Section
				title="Custom labels / i18n"
				description="Switch languages — every string including placeholders, disabled hints, modal titles, and accessibility labels should update."
			>
				<View style={styles.toggle}>
					{LANG_OPTIONS.map((opt) => (
						<Pressable
							key={opt.key}
							onPress={() => setLang(opt.key)}
							style={[styles.chip, lang === opt.key && styles.chipActive]}
						>
							<Text
								style={[
									styles.chipText,
									lang === opt.key && styles.chipTextActive,
								]}
							>
								{opt.label}
							</Text>
						</Pressable>
					))}
				</View>

				<CountryStateCityPicker
					key={lang}
					onSelect={setSelection}
					labels={LANG_MAP[lang]}
				/>
				<Result value={selection} />
			</Section>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: { padding: 16, gap: 20 },
	toggle: { flexDirection: 'row', gap: 8, marginBottom: 4 },
	chip: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		backgroundColor: '#f3f4f6',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	chipActive: { borderColor: '#4f46e5', backgroundColor: '#eef2ff' },
	chipText: { fontSize: 13, fontWeight: '500', color: '#374151' },
	chipTextActive: { color: '#4f46e5', fontWeight: '700' },
})
