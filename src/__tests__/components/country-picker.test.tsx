import { render, fireEvent } from '@testing-library/react-native'
import { CountryPicker } from '../../components/country-picker'

const mockCountries = [
	{ name: 'India', isoCode: 'IN', flag: '🇮🇳', currency: 'INR' },
	{ name: 'United States', isoCode: 'US', flag: '🇺🇸', currency: 'USD' },
]

jest.mock('../../hooks/use-countries', () => ({
	useCountries: () => ({ data: mockCountries, isLoading: false, error: null }),
}))

jest.mock('../../hooks/use-debounce', () => ({
	useDebounce: (value: string) => value,
}))

describe('CountryPicker', () => {
	const onChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('displays flag + name for selected country', () => {
		const { getByText } = render(
			<CountryPicker
				value={mockCountries[0]!}
				onChange={onChange}
				testID="cp"
			/>
		)

		expect(getByText('🇮🇳  India')).toBeTruthy()
	})

	it('shows placeholder when no value', () => {
		const { getByText } = render(
			<CountryPicker value={null} onChange={onChange} testID="cp" />
		)

		expect(getByText('Select country')).toBeTruthy()
	})

	it('opens modal on press and shows all countries', () => {
		const { getByTestId, getByText } = render(
			<CountryPicker value={null} onChange={onChange} testID="cp" />
		)

		fireEvent.press(getByTestId('cp-trigger'))

		expect(getByText('🇮🇳  India')).toBeTruthy()
		expect(getByText('🇺🇸  United States')).toBeTruthy()
	})

	it('selecting country calls onChange with full Country object', () => {
		const { getByTestId } = render(
			<CountryPicker value={null} onChange={onChange} testID="cp" />
		)

		fireEvent.press(getByTestId('cp-trigger'))
		fireEvent.press(getByTestId('cp-option-IN'))

		expect(onChange).toHaveBeenCalledWith(mockCountries[0])
	})
})
