export type PickerLabels = {
	// Field labels shown above each trigger
	countryLabel: string
	stateLabel: string
	cityLabel: string
	// Modal sheet titles
	countryTitle: string
	stateTitle: string
	cityTitle: string
	// Trigger placeholders
	countryPlaceholder: string
	statePlaceholder: string
	cityPlaceholder: string
	// Disabled-state placeholders (shown when parent not yet selected)
	stateDisabledPlaceholder: string
	cityDisabledPlaceholder: string
	// Not-applicable placeholders (shown when the level has no data)
	stateNotApplicable: string
	cityNotApplicable: string
	// Disabled-state accessibility hints (announced by screen readers)
	stateDisabledHint: string
	cityDisabledHint: string
	// Loading / error announcements (announced via accessibilityLiveRegion)
	loadingLabel: (label: string) => string
	errorLabel: (label: string) => string
	// Modal UI
	searchPlaceholder: string
	noResults: string
	// Dynamic strings — called with runtime values for interpolation
	fallbackPlaceholder: (label: string) => string
	closeModal: (title: string) => string
	searchAccessibilityLabel: (title: string) => string
	openPickerHint: (label: string) => string
	selectedValueLabel: (label: string, value: string) => string
	fallbackInputLabel: (label: string) => string
	fallbackInputHint: (label: string) => string
}

export const DEFAULT_LABELS: PickerLabels = {
	countryLabel: 'Country',
	stateLabel: 'State / Province',
	cityLabel: 'City',
	countryTitle: 'Select Country',
	stateTitle: 'Select State / Province',
	cityTitle: 'Select City',
	countryPlaceholder: 'Select country',
	statePlaceholder: 'Select state',
	cityPlaceholder: 'Select city',
	stateDisabledPlaceholder: 'Select a country first',
	cityDisabledPlaceholder: 'Select a state first',
	stateNotApplicable: 'Not applicable',
	cityNotApplicable: 'Not applicable',
	stateDisabledHint: 'Select a country to enable state picker',
	cityDisabledHint: 'Select a state to enable city picker',
	loadingLabel: (label) => `Loading ${label.toLocaleLowerCase()} options`,
	errorLabel: (label) =>
		`Failed to load ${label.toLocaleLowerCase()} options. Enter manually.`,
	searchPlaceholder: 'Search…',
	noResults: 'No results',
	fallbackPlaceholder: (label) => `Enter ${label.toLocaleLowerCase()} manually`,
	closeModal: (title) => `Close ${title}`,
	searchAccessibilityLabel: (title) => `Search ${title}`,
	openPickerHint: (label) => `Opens ${label.toLocaleLowerCase()} picker`,
	selectedValueLabel: (label, value) => `${label}: ${value}`,
	fallbackInputLabel: (label) => `${label} text input`,
	fallbackInputHint: (label) =>
		`Type a ${label.toLocaleLowerCase()} name manually`,
}

export function resolveLabels(override?: Partial<PickerLabels>): PickerLabels {
	if (!override) return DEFAULT_LABELS
	return { ...DEFAULT_LABELS, ...override }
}
