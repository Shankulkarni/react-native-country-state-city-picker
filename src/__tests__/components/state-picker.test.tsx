import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { StatePicker } from '../../components/state-picker'

const mockStates = [
	{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' },
	{ name: 'Karnataka', isoCode: 'KA', countryCode: 'IN' },
]

const mockUseStates = jest.fn()

jest.mock('../../hooks/use-states', () => ({
	useStates: (...args: unknown[]) => mockUseStates(...args),
}))

jest.mock('../../hooks/use-debounce', () => ({
	useDebounce: (value: string) => value,
}))

describe('StatePicker', () => {
	const onChange = jest.fn()
	const onNoStates = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		mockUseStates.mockReturnValue({
			data: mockStates,
			isLoading: false,
			error: null,
		})
	})

	it('disabled when countryCode is null', () => {
		mockUseStates.mockReturnValue({ data: [], isLoading: false, error: null })

		const { getByTestId } = render(
			<StatePicker
				countryCode={null}
				value={null}
				onChange={onChange}
				testID="sp"
			/>
		)

		const trigger = getByTestId('sp-trigger')
		fireEvent.press(trigger)
		// Modal should not open because picker is disabled
		expect(onChange).not.toHaveBeenCalled()
	})

	it('shows "Not applicable" when country has no states', () => {
		mockUseStates.mockReturnValue({ data: [], isLoading: false, error: null })

		const { getByText } = render(
			<StatePicker
				countryCode="HK"
				value={null}
				onChange={onChange}
				onNoStates={onNoStates}
				testID="sp"
			/>
		)

		expect(getByText('Not applicable')).toBeTruthy()
	})

	it('calls onNoStates callback when country has no states', () => {
		mockUseStates.mockReturnValue({ data: [], isLoading: false, error: null })

		render(
			<StatePicker
				countryCode="HK"
				value={null}
				onChange={onChange}
				onNoStates={onNoStates}
				testID="sp"
			/>
		)

		expect(onNoStates).toHaveBeenCalled()
	})

	it('enables and shows states when countryCode provided', () => {
		const { getByTestId, getByText } = render(
			<StatePicker
				countryCode="IN"
				value={null}
				onChange={onChange}
				testID="sp"
			/>
		)

		fireEvent.press(getByTestId('sp-trigger'))

		expect(getByText('Maharashtra')).toBeTruthy()
		expect(getByText('Karnataka')).toBeTruthy()
	})

	it('selecting state calls onChange with full State object', () => {
		const { getByTestId } = render(
			<StatePicker
				countryCode="IN"
				value={null}
				onChange={onChange}
				testID="sp"
			/>
		)

		fireEvent.press(getByTestId('sp-trigger'))
		fireEvent.press(getByTestId('sp-option-MH'))

		expect(onChange).toHaveBeenCalledWith(mockStates[0])
	})
})
