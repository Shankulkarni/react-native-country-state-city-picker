export type PickerTheme = {
	// Bottom sheet
	sheetBackground: string
	handleColor: string
	titleColor: string
	backdropColor: string
	// Search input
	searchBackground: string
	searchTextColor: string
	searchPlaceholderColor: string
	// List rows
	rowTextColor: string
	rowSubTextColor: string
	rowPressedBackground: string
	separatorColor: string
	emptyTextColor: string
	// Trigger row
	labelColor: string
	borderColor: string
	triggerBackground: string
	disabledBackground: string
	disabledBorderColor: string
	pressedBackground: string
	valueTextColor: string
	placeholderColor: string
	chevronColor: string
	chevronDisabledColor: string
	loadingColor: string
}

export const DEFAULT_THEME: PickerTheme = {
	// Bottom sheet
	sheetBackground: '#ffffff',
	handleColor: '#d1d5db',
	titleColor: '#111827',
	backdropColor: 'rgba(0,0,0,0.45)',
	// Search input
	searchBackground: '#f3f4f6',
	searchTextColor: '#111827',
	searchPlaceholderColor: '#9ca3af',
	// List rows
	rowTextColor: '#111827',
	rowSubTextColor: '#6b7280',
	rowPressedBackground: '#f9fafb',
	separatorColor: '#e5e7eb',
	emptyTextColor: '#9ca3af',
	// Trigger row
	labelColor: '#374151',
	borderColor: '#d1d5db',
	triggerBackground: '#ffffff',
	disabledBackground: '#f9fafb',
	disabledBorderColor: '#e5e7eb',
	pressedBackground: '#f3f4f6',
	valueTextColor: '#111827',
	placeholderColor: '#9ca3af',
	chevronColor: '#6b7280',
	chevronDisabledColor: '#d1d5db',
	loadingColor: '#6b7280',
}

export const DARK_THEME: PickerTheme = {
	// Bottom sheet
	sheetBackground: '#1c1c1e',
	handleColor: '#3a3a3c',
	titleColor: '#f2f2f7',
	backdropColor: 'rgba(0,0,0,0.65)',
	// Search input
	searchBackground: '#2c2c2e',
	searchTextColor: '#f2f2f7',
	searchPlaceholderColor: '#636366',
	// List rows
	rowTextColor: '#f2f2f7',
	rowSubTextColor: '#8e8e93',
	rowPressedBackground: '#2c2c2e',
	separatorColor: '#3a3a3c',
	emptyTextColor: '#636366',
	// Trigger row
	labelColor: '#ebebf5',
	borderColor: '#3a3a3c',
	triggerBackground: '#1c1c1e',
	disabledBackground: '#141414',
	disabledBorderColor: '#2c2c2e',
	pressedBackground: '#2c2c2e',
	valueTextColor: '#f2f2f7',
	placeholderColor: '#636366',
	chevronColor: '#8e8e93',
	chevronDisabledColor: '#3a3a3c',
	loadingColor: '#8e8e93',
}

export function resolveTheme(
	colorScheme: string | null | undefined,
	override?: Partial<PickerTheme>
): PickerTheme {
	const base = colorScheme === 'dark' ? DARK_THEME : DEFAULT_THEME
	if (!override) return base
	return { ...base, ...override }
}
