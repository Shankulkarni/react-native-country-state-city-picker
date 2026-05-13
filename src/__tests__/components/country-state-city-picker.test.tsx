import { render, fireEvent } from '@testing-library/react-native'
import { CountryStateCityPicker } from '../../components/country-state-city-picker'

const mockCountries = [
	{ name: 'India', isoCode: 'IN', flag: '🇮🇳', currency: 'INR' },
	{ name: 'United States', isoCode: 'US', flag: '🇺🇸', currency: 'USD' },
]

const mockStatesIN = [{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' }]

const mockCitiesMH = [{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' }]

jest.mock('../../hooks/use-countries', () => ({
	useCountries: () => ({ data: mockCountries, isLoading: false, error: null }),
}))

const mockUseStates = jest.fn()
jest.mock('../../hooks/use-states', () => ({
	useStates: (...args: unknown[]) => mockUseStates(...args),
}))

const mockUseCities = jest.fn()
jest.mock('../../hooks/use-cities', () => ({
	useCities: (...args: unknown[]) => mockUseCities(...args),
}))

jest.mock('../../hooks/use-debounce', () => ({
	useDebounce: (value: string) => value,
}))

describe('CountryStateCityPicker', () => {
	const onSelect = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseStates.mockReturnValue({ data: [], isLoading: false, error: null })
		mockUseCities.mockReturnValue({ data: [], isLoading: false, error: null })
	})

	it('selecting country enables state picker and calls onSelect', () => {
		const { getByTestId } = render(
			<CountryStateCityPicker onSelect={onSelect} testID="csc" />
		)

		// Open country picker and select India
		fireEvent.press(getByTestId('csc-country-trigger'))
		fireEvent.press(getByTestId('csc-country-option-IN'))

		expect(onSelect).toHaveBeenCalledWith({
			country: mockCountries[0],
			state: null,
			city: null,
		})
	})

	it('selecting country resets state and city', () => {
		// Start with India pre-selected
		const { getByTestId } = render(
			<CountryStateCityPicker
				onSelect={onSelect}
				defaultValue={{
					country: mockCountries[0],
					state: mockStatesIN[0],
					city: mockCitiesMH[0],
				}}
				testID="csc"
			/>
		)

		// Change country to US
		fireEvent.press(getByTestId('csc-country-trigger'))
		fireEvent.press(getByTestId('csc-country-option-US'))

		expect(onSelect).toHaveBeenCalledWith({
			country: mockCountries[1],
			state: null,
			city: null,
		})
	})

	it('selecting state calls onSelect with country+state', () => {
		mockUseStates.mockReturnValue({
			data: mockStatesIN,
			isLoading: false,
			error: null,
		})

		const { getByTestId } = render(
			<CountryStateCityPicker
				onSelect={onSelect}
				defaultValue={{ country: mockCountries[0] }}
				testID="csc"
			/>
		)

		// Select state
		fireEvent.press(getByTestId('csc-state-trigger'))
		fireEvent.press(getByTestId('csc-state-option-MH'))

		expect(onSelect).toHaveBeenCalledWith({
			country: mockCountries[0],
			state: mockStatesIN[0],
			city: null,
		})
	})

	it('selecting city calls onSelect with full selection', () => {
		mockUseStates.mockReturnValue({
			data: mockStatesIN,
			isLoading: false,
			error: null,
		})
		mockUseCities.mockReturnValue({
			data: mockCitiesMH,
			isLoading: false,
			error: null,
		})

		const { getByTestId } = render(
			<CountryStateCityPicker
				onSelect={onSelect}
				defaultValue={{
					country: mockCountries[0],
					state: mockStatesIN[0],
				}}
				testID="csc"
			/>
		)

		fireEvent.press(getByTestId('csc-city-trigger'))
		fireEvent.press(getByTestId('csc-city-option-Mumbai'))

		expect(onSelect).toHaveBeenCalledWith({
			country: mockCountries[0],
			state: mockStatesIN[0],
			city: mockCitiesMH[0],
		})
	})

	it('defaultValue pre-fills selections', () => {
		mockUseStates.mockReturnValue({
			data: mockStatesIN,
			isLoading: false,
			error: null,
		})
		mockUseCities.mockReturnValue({
			data: mockCitiesMH,
			isLoading: false,
			error: null,
		})

		const { getByText } = render(
			<CountryStateCityPicker
				onSelect={onSelect}
				defaultValue={{
					country: mockCountries[0],
					state: mockStatesIN[0],
					city: mockCitiesMH[0],
				}}
				testID="csc"
			/>
		)

		expect(getByText('🇮🇳  India')).toBeTruthy()
		expect(getByText('Maharashtra')).toBeTruthy()
		expect(getByText('Mumbai')).toBeTruthy()
	})
})
