import { render, fireEvent } from '@testing-library/react-native'
import { CityPicker } from '../../components/city-picker'

const mockCities = [
	{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' },
	{ name: 'Pune', stateCode: 'MH', countryCode: 'IN' },
]

const mockUseCities = jest.fn()

jest.mock('../../hooks/use-cities', () => ({
	useCities: (...args: unknown[]) => mockUseCities(...args),
}))

jest.mock('../../hooks/use-debounce', () => ({
	useDebounce: (value: string) => value,
}))

describe('CityPicker', () => {
	const onChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseCities.mockReturnValue({
			data: mockCities,
			isLoading: false,
			error: null,
		})
	})

	it('disabled when stateCode is null', () => {
		mockUseCities.mockReturnValue({ data: [], isLoading: false, error: null })

		const { getByTestId } = render(
			<CityPicker
				countryCode="IN"
				stateCode={null}
				value={null}
				onChange={onChange}
				testID="city"
			/>
		)

		const trigger = getByTestId('city-trigger')
		fireEvent.press(trigger)
		expect(onChange).not.toHaveBeenCalled()
	})

	it('disabled when countryCode is null', () => {
		mockUseCities.mockReturnValue({ data: [], isLoading: false, error: null })

		const { getByText } = render(
			<CityPicker
				countryCode={null}
				stateCode={null}
				value={null}
				onChange={onChange}
				testID="city"
			/>
		)

		expect(getByText('Select a state first')).toBeTruthy()
	})

	it('shows "Not applicable" when notApplicable prop is true', () => {
		const { getByText } = render(
			<CityPicker
				countryCode="HK"
				stateCode="HK"
				value={null}
				onChange={onChange}
				notApplicable={true}
				testID="city"
			/>
		)

		expect(getByText('Not applicable')).toBeTruthy()
	})

	it('shows cities for valid country+state pair', () => {
		const { getByTestId, getByText } = render(
			<CityPicker
				countryCode="IN"
				stateCode="MH"
				value={null}
				onChange={onChange}
				testID="city"
			/>
		)

		fireEvent.press(getByTestId('city-trigger'))

		expect(getByText('Mumbai')).toBeTruthy()
		expect(getByText('Pune')).toBeTruthy()
	})

	it('selecting city calls onChange with full City object', () => {
		const { getByTestId } = render(
			<CityPicker
				countryCode="IN"
				stateCode="MH"
				value={null}
				onChange={onChange}
				testID="city"
			/>
		)

		fireEvent.press(getByTestId('city-trigger'))
		fireEvent.press(getByTestId('city-option-Mumbai'))

		expect(onChange).toHaveBeenCalledWith(mockCities[0])
	})
})
