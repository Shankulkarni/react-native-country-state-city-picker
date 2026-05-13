import { renderHook } from '@testing-library/react-native'
import { useColorScheme } from 'react-native'
import { usePickerTheme } from '../../hooks/use-picker-theme'
import { DEFAULT_THEME, DARK_THEME } from '../../theme'

const mockUseColorScheme = useColorScheme as jest.Mock

describe('usePickerTheme', () => {
	it('returns DEFAULT_THEME in light mode', () => {
		mockUseColorScheme.mockReturnValue('light')
		const { result } = renderHook(() => usePickerTheme())
		expect(result.current).toEqual(DEFAULT_THEME)
	})

	it('returns DARK_THEME in dark mode', () => {
		mockUseColorScheme.mockReturnValue('dark')
		const { result } = renderHook(() => usePickerTheme())
		expect(result.current).toEqual(DARK_THEME)
	})

	it('returns DEFAULT_THEME when colorScheme is null', () => {
		mockUseColorScheme.mockReturnValue(null)
		const { result } = renderHook(() => usePickerTheme())
		expect(result.current).toEqual(DEFAULT_THEME)
	})

	it('merges partial override with base theme', () => {
		mockUseColorScheme.mockReturnValue('light')
		const override = { sheetBackground: '#ff0000', titleColor: '#00ff00' }
		const { result } = renderHook(() => usePickerTheme(override))

		expect(result.current.sheetBackground).toBe('#ff0000')
		expect(result.current.titleColor).toBe('#00ff00')
		// Other properties remain from DEFAULT_THEME
		expect(result.current.handleColor).toBe(DEFAULT_THEME.handleColor)
	})
})
