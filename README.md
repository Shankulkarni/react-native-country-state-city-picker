# react-native-country-state-city-picker

Drop-in country → state → city picker for React Native. Always up-to-date geodata, zero native code, auto dark/light mode, fully accessible out of the box.

[![npm version](https://img.shields.io/npm/v/react-native-country-state-city-picker?style=flat-square&color=6366f1)](https://www.npmjs.com/package/react-native-country-state-city-picker)
[![npm downloads](https://img.shields.io/npm/dm/react-native-country-state-city-picker?style=flat-square&color=6366f1)](https://www.npmjs.com/package/react-native-country-state-city-picker)
[![license](https://img.shields.io/npm/l/react-native-country-state-city-picker?style=flat-square&color=22c55e)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76%2B-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![New Architecture](https://img.shields.io/badge/New%20Architecture-ready-22c55e?style=flat-square)](https://reactnative.dev/docs/the-new-architecture/landing-page)
[![platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android-lightgrey?style=flat-square)](https://reactnative.dev/)

---

<video src="https://github.com/user-attachments/assets/700cbb65-31ee-4e0d-a9e5-f946edb90cab" autoplay loop muted playsinline width="100%"></video>

<!-- <img src="https://raw.githubusercontent.com/shankulkarni/react-native-country-state-city-picker/main/assets/screenshot.png" alt="Screenshot" width="401" /> -->

---

## 📦 Installation

```sh
# bun (recommended)
bun add react-native-country-state-city-picker

# npm
npm install react-native-country-state-city-picker

# yarn
yarn add react-native-country-state-city-picker
```

No native module linking required. Works with Expo out of the box.

---

## 🚀 Quick Start

### Composite picker (all three levels)

```tsx
import { CountryStateCityPicker } from 'react-native-country-state-city-picker'
import type { PickerSelection } from 'react-native-country-state-city-picker'

export default function AddressForm() {
	const handleSelect = (selection: PickerSelection) => {
		console.log(selection.country?.name) // "India"
		console.log(selection.state?.name) // "Maharashtra"
		console.log(selection.city?.name) // "Mumbai"
	}

	return <CountryStateCityPicker onSelect={handleSelect} />
}
```

### Individual pickers

```tsx
import { useState } from 'react'
import {
	CountryPicker,
	StatePicker,
	CityPicker,
} from 'react-native-country-state-city-picker'
import type {
	Country,
	State,
	City,
} from 'react-native-country-state-city-picker'

export default function AddressForm() {
	const [country, setCountry] = useState<Country | null>(null)
	const [state, setState] = useState<State | null>(null)
	const [city, setCity] = useState<City | null>(null)

	return (
		<>
			<CountryPicker value={country} onChange={setCountry} />
			<StatePicker
				value={state}
				onChange={setState}
				countryCode={country?.isoCode}
			/>
			<CityPicker
				value={city}
				onChange={setCity}
				countryCode={country?.isoCode}
				stateCode={state?.isoCode}
			/>
		</>
	)
}
```

---

## ✨ Features

| Feature                      | Details                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 🌐 **Live geodata**          | Countries, states, and cities via [geocoded.me](https://api.geocoded.me) API |
| 🌑 **Dark & light mode**     | Auto-detects system color scheme; swap with a single prop                    |
| ♿ **Accessibility-first**   | ARIA roles, live regions, dynamic a11y labels, focus management              |
| 🌍 **Internationalization**  | 37 customizable label strings — ship in any language                         |
| 🎨 **Fully themeable**       | 29 design tokens covering every pixel of the UI                              |
| 🔌 **Render props**          | Replace trigger, row, search, or empty state with your own UI                |
| 🪝 **Headless hooks**        | `useCountries`, `useStates`, `useCities` — build your own UI from scratch    |
| 🔗 **Cascade or standalone** | Use all three pickers together or any single one in isolation                |
| ⚡ **Smart caching**         | LRU cache with in-flight deduplication — no duplicate network requests       |
| 🔁 **Retry logic**           | 3 attempts with exponential backoff on network failures                      |
| 📦 **Zero native code**      | Pure JS/TS — no linking, no CocoaPods, no Gradle                             |
| 🧪 **Testable**              | `testID` on every interactive element                                        |
| 💙 **TypeScript-first**      | Strict types for all components, hooks, themes, and labels                   |
| 🏗️ **New Architecture**      | Fabric-compatible, Bridgeless-safe                                           |

---

## 📖 API Reference

### `<CountryStateCityPicker>`

All-in-one component that manages the full country → state → city cascade.

| Prop            | Type                                       | Default          | Description                                              |
| --------------- | ------------------------------------------ | ---------------- | -------------------------------------------------------- |
| `onSelect`      | `(selection: PickerSelection) => void`     | —                | Called whenever any level changes                        |
| `defaultValue`  | `Partial<PickerSelection>`                 | —                | Pre-selected values on mount                             |
| `theme`         | `Partial<PickerTheme>`                     | `DEFAULT_THEME`  | Override any of the 29 design tokens                     |
| `labels`        | `Partial<PickerLabels>`                    | `DEFAULT_LABELS` | Override any of the 37 label strings                     |
| `testID`        | `string`                                   | —                | Base `testID` — suffixed per field (e.g. `base.country`) |
| `bottomInset`   | `number`                                   | `0`              | Extra padding for gesture-bar devices                    |
| `style`         | `StyleProp<ViewStyle>`                     | —                | Outer container style (gap, padding, etc.)               |
| `labelStyle`    | `StyleProp<TextStyle>`                     | —                | Label text style for all three fields                    |
| `inputStyle`    | `StyleProp<ViewStyle>`                     | —                | Trigger box style for all three fields                   |
| `renderTrigger` | `(props: TriggerRenderProps) => ReactNode` | —                | Replace the trigger UI                                   |
| `renderItem`    | `(props: ItemRenderProps) => ReactNode`    | —                | Replace each list row                                    |
| `renderSearch`  | `(props: SearchRenderProps) => ReactNode`  | —                | Replace the search input                                 |
| `renderEmpty`   | `(props: EmptyRenderProps) => ReactNode`   | —                | Replace the empty state                                  |

---

### `<CountryPicker>`

| Prop            | Type                                       | Default            | Description                        |
| --------------- | ------------------------------------------ | ------------------ | ---------------------------------- |
| `value`         | `Country \| null`                          | —                  | Currently selected country         |
| `onChange`      | `(country: Country) => void`               | —                  | Called when user selects a country |
| `placeholder`   | `string`                                   | `"Select country"` | Placeholder text                   |
| `theme`         | `Partial<PickerTheme>`                     | `DEFAULT_THEME`    | Design tokens                      |
| `labels`        | `Partial<PickerLabels>`                    | `DEFAULT_LABELS`   | Label strings                      |
| `testID`        | `string`                                   | —                  | Test identifier                    |
| `bottomInset`   | `number`                                   | `0`                | Safe area bottom inset             |
| `style`         | `StyleProp<ViewStyle>`                     | —                  | Container style                    |
| `labelStyle`    | `StyleProp<TextStyle>`                     | —                  | Label text style                   |
| `inputStyle`    | `StyleProp<ViewStyle>`                     | —                  | Trigger box style                  |
| `renderTrigger` | `(props: TriggerRenderProps) => ReactNode` | —                  | Custom trigger UI                  |
| `renderItem`    | `(props: ItemRenderProps) => ReactNode`    | —                  | Custom row UI                      |
| `renderSearch`  | `(props: SearchRenderProps) => ReactNode`  | —                  | Custom search UI                   |
| `renderEmpty`   | `(props: EmptyRenderProps) => ReactNode`   | —                  | Custom empty state                 |

---

### `<StatePicker>`

All props from `CountryPicker` plus:

| Prop          | Type                          | Default | Description                                    |
| ------------- | ----------------------------- | ------- | ---------------------------------------------- |
| `countryCode` | `string \| null \| undefined` | —       | ISO2 country code to load states for           |
| `onNoStates`  | `() => void`                  | —       | Called when the selected country has no states |

---

### `<CityPicker>`

All props from `StatePicker` plus:

| Prop            | Type                          | Default | Description                             |
| --------------- | ----------------------------- | ------- | --------------------------------------- |
| `stateCode`     | `string \| null \| undefined` | —       | ISO2 state code to load cities for      |
| `notApplicable` | `boolean`                     | `false` | Force the field into N/A state manually |

---

## 🌑 Dark & Light Mode

### Auto-detect system theme

The library detects `useColorScheme()` automatically. No configuration needed — it switches between `DEFAULT_THEME` (light) and `DARK_THEME` (dark) on its own.

### Manual override

```tsx
import { DARK_THEME, DEFAULT_THEME } from 'react-native-country-state-city-picker'

// Force dark
<CountryStateCityPicker theme={DARK_THEME} onSelect={handleSelect} />

// Force light
<CountryStateCityPicker theme={DEFAULT_THEME} onSelect={handleSelect} />
```

### Custom brand theme

Override only the tokens you need — everything else falls back to the system default:

```tsx
const brandTheme = {
  sheetBackground: '#1e1b4b',
  titleColor: '#a5b4fc',
  searchBackground: '#312e81',
  rowTextColor: '#e0e7ff',
  labelColor: '#a5b4fc',
  borderColor: '#4f46e5',
  triggerBackground: '#1e1b4b',
  valueTextColor: '#e0e7ff',
  chevronColor: '#6366f1',
}

<CountryStateCityPicker theme={brandTheme} onSelect={handleSelect} />
```

<details>
<summary>All 29 theme tokens</summary>

| Token                    | Description                 |
| ------------------------ | --------------------------- |
| `sheetBackground`        | Bottom sheet background     |
| `handleColor`            | Drag handle color           |
| `backdropColor`          | Semi-transparent backdrop   |
| `titleColor`             | Sheet title text            |
| `searchBackground`       | Search input background     |
| `searchTextColor`        | Search input text           |
| `searchPlaceholderColor` | Search placeholder text     |
| `rowTextColor`           | Primary text in list rows   |
| `rowSubTextColor`        | Secondary text in list rows |
| `rowPressedBackground`   | Row pressed/highlight state |
| `separatorColor`         | Row separator line          |
| `emptyTextColor`         | Empty state text            |
| `labelColor`             | Field label above trigger   |
| `borderColor`            | Trigger border              |
| `triggerBackground`      | Trigger background          |
| `disabledBackground`     | Disabled trigger background |
| `disabledBorderColor`    | Disabled trigger border     |
| `pressedBackground`      | Trigger pressed state       |
| `valueTextColor`         | Selected value text         |
| `placeholderColor`       | Trigger placeholder text    |
| `chevronColor`           | Chevron icon                |
| `chevronDisabledColor`   | Chevron when disabled       |
| `loadingColor`           | Loading spinner             |

</details>

---

## 🌍 Internationalization

Override any of the 37 label strings to ship your picker in any language.

```tsx
import { CountryStateCityPicker, DEFAULT_LABELS } from 'react-native-country-state-city-picker'

const spanishLabels = {
  countryLabel: 'País',
  stateLabel: 'Estado / Provincia',
  cityLabel: 'Ciudad',
  countrySheetTitle: 'Selecciona un país',
  stateSheetTitle: 'Selecciona un estado',
  citySheetTitle: 'Selecciona una ciudad',
  searchPlaceholder: 'Buscar…',
  noResults: 'Sin resultados',
  countryPlaceholder: 'Seleccionar país',
  statePlaceholder: 'Seleccionar estado',
  cityPlaceholder: 'Seleccionar ciudad',
  notApplicable: 'No aplica',
}

<CountryStateCityPicker
  labels={spanishLabels}
  onSelect={handleSelect}
/>
```

<details>
<summary>All 37 label keys</summary>

```ts
type PickerLabels = {
	// Field labels
	countryLabel: string
	stateLabel: string
	cityLabel: string

	// Modal titles
	countrySheetTitle: string
	stateSheetTitle: string
	citySheetTitle: string

	// Placeholder text
	countryPlaceholder: string
	statePlaceholder: string
	cityPlaceholder: string

	// Disabled-state placeholders
	stateDisabledPlaceholder: string
	cityDisabledPlaceholder: string

	// N/A state
	notApplicable: string

	// Search
	searchPlaceholder: string
	noResults: string

	// Loading & error (called with runtime values)
	loadingLabel: (field: string) => string
	errorLabel: (field: string) => string
	fallbackPlaceholder: (field: string) => string

	// Accessibility hints
	countryAccessibilityHint: string
	stateAccessibilityHint: string
	cityAccessibilityHint: string
	// … and more
}
```

</details>

---

## 🔌 Render Props

Take complete control of any part of the UI while keeping the library's data-fetching, caching, and cascade logic intact.

### Custom trigger

```tsx
<CountryPicker
	value={country}
	onChange={setCountry}
	renderTrigger={({
		label,
		displayValue,
		placeholder,
		isLoading,
		isDisabled,
		onPress,
	}) => (
		<TouchableOpacity
			onPress={onPress}
			disabled={isDisabled}
			style={styles.pill}
		>
			<Text style={styles.pillLabel}>{label}</Text>
			<Text style={styles.pillValue}>{displayValue ?? placeholder}</Text>
			{isLoading && <ActivityIndicator size="small" />}
		</TouchableOpacity>
	)}
/>
```

### Custom row

```tsx
<CountryPicker
	value={country}
	onChange={setCountry}
	renderItem={({ label, value, onSelect }) => (
		<Pressable onPress={onSelect} style={styles.row}>
			<Text style={styles.flag}>{value.flag}</Text>
			<Text style={styles.name}>{label}</Text>
			<Text style={styles.code}>{value.isoCode}</Text>
		</Pressable>
	)}
/>
```

### Custom search

```tsx
<CountryPicker
	value={country}
	onChange={setCountry}
	renderSearch={({ value, placeholder, onChangeText }) => (
		<View style={styles.searchRow}>
			<Text>🔍</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				style={styles.searchInput}
			/>
		</View>
	)}
/>
```

### Custom empty state

```tsx
<CountryPicker
	value={country}
	onChange={setCountry}
	renderEmpty={({ query }) => (
		<View style={styles.empty}>
			<Text>😔 No results for "{query}"</Text>
		</View>
	)}
/>
```

All four render props work on `CountryPicker`, `StatePicker`, `CityPicker`, and `CountryStateCityPicker`.

---

## 🪝 Hooks

Use the headless hooks to build entirely custom UIs with the library's caching layer.

### `useCountries()`

```tsx
import { useCountries } from 'react-native-country-state-city-picker'

const { data, isLoading, error } = useCountries()
// data: Country[]  — [ { name, isoCode, flag, currency }, … ]
```

### `useStates(countryCode)`

```tsx
import { useStates } from 'react-native-country-state-city-picker'

const { data, isLoading, error } = useStates('IN')
// data: State[]  — [ { name, isoCode, countryCode }, … ]
```

### `useCities(countryCode, stateCode)`

```tsx
import { useCities } from 'react-native-country-state-city-picker'

const { data, isLoading, error } = useCities('IN', 'MH')
// data: City[]  — [ { name, stateCode, countryCode }, … ]
```

### `usePresetSelection(input)`

Resolve backend-stored strings (country name or ISO2 code) back into typed objects on load.

```tsx
import { usePresetSelection } from 'react-native-country-state-city-picker'

// Backend gives you raw strings — resolve them to full objects
const { country, state, city, isLoading } = usePresetSelection({
  country: 'IN',           // ISO2 code or display name
  state: 'Maharashtra',    // name or ISO2 code
  city: 'Mumbai',
})

<CountryStateCityPicker defaultValue={{ country, state, city }} onSelect={handleSelect} />
```

### `usePickerTheme(override?)`

```tsx
import { usePickerTheme } from 'react-native-country-state-city-picker'

// Resolves to DARK_THEME or DEFAULT_THEME based on system color scheme,
// then merges any override tokens on top
const theme = usePickerTheme({ borderColor: '#6366f1' })
```

---

## ♿ Accessibility

The picker is built accessibility-first:

- **ARIA roles** — triggers are `accessibilityRole="button"`, modals set `accessibilityViewIsModal`
- **Live regions** — loading and error states are announced via `accessibilityLiveRegion="polite"`
- **Dynamic labels** — screen readers hear `"Country: India, double-tap to change"` (not just `"Button"`)
- **Disabled hints** — when a field is locked, screen readers explain why (e.g. `"Select a country first"`)
- **Focus management** — search input auto-focuses when the bottom sheet opens
- **Hidden decorative elements** — drag handle and chevron are hidden from the accessibility tree

All labels and hints are customizable via the `labels` prop so you can localize them too.

---

## 🧪 Testing

Every interactive element exposes a `testID`. Pass a `testID` base string and each sub-element gets a suffixed ID:

```tsx
<CountryStateCityPicker testID="address" onSelect={handleSelect} />

// Resolves to:
// address.country   — country trigger
// address.state     — state trigger
// address.city      — city trigger
```

```tsx
// Example with React Native Testing Library
const { getByTestId } = render(<AddressForm />)

fireEvent.press(getByTestId('address.country'))
// … interact with the bottom sheet
```

---

## 🏗️ Architecture

```
CountryStateCityPicker
├── CountryPicker
│   ├── useCountries()        ← LRU cache, retry, dedup
│   └── PickerBottomSheet
│       ├── SearchInput       ← debounced, accent-normalized
│       └── PickerList        ← virtualized FlatList
├── StatePicker
│   └── useStates(countryCode)
└── CityPicker
    └── useCities(countryCode, stateCode)
```

**Caching strategy**:

| Resource  | Cache size | ~Memory |
| --------- | ---------- | ------- |
| Countries | 1 entry    | ~10 KB  |
| States    | 20 entries | ~30 KB  |
| Cities    | 10 entries | ~300 KB |

In-flight deduplication prevents duplicate API calls when multiple components mount at the same time.

---

## 📐 TypeScript

All types are exported from the package root:

```ts
import type {
	Country,
	State,
	City,
	PickerSelection,
	PickerTheme,
	PickerLabels,
	TriggerRenderProps,
	ItemRenderProps,
	SearchRenderProps,
	EmptyRenderProps,
	PickerRenderProps,
} from 'react-native-country-state-city-picker'
```

```ts
type Country = {
	name: string
	isoCode: string
	flag: string // emoji flag
	currency?: string
}

type State = {
	name: string
	isoCode: string
	countryCode: string
}

type City = {
	name: string
	stateCode: string
	countryCode: string
}

type PickerSelection = {
	country: Country | null
	state: State | null
	city: City | null
}
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and how to send a pull request.

---

## 📄 License

[MIT](LICENSE) © Shan Kulkarni

---

<p align="center">Made with ❤️ using <a href="https://github.com/callstack/react-native-builder-bob">create-react-native-library</a></p>
