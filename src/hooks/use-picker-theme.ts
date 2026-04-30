import { useColorScheme } from 'react-native'
import type { PickerTheme } from '../theme'
import { resolveTheme } from '../theme'

export function usePickerTheme(override?: Partial<PickerTheme>): PickerTheme {
	const colorScheme = useColorScheme()
	return resolveTheme(colorScheme, override)
}
