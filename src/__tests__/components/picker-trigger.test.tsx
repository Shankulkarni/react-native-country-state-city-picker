import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { PickerTrigger } from '../../components/picker-trigger'
import { DEFAULT_THEME } from '../../theme'
import { DEFAULT_LABELS } from '../../labels'

const baseProps = {
	label: 'Country',
	value: null as string | null,
	placeholder: 'Select country',
	isLoading: false,
	isDisabled: false,
	hasError: false,
	fallbackValue: '',
	theme: DEFAULT_THEME,
	labels: DEFAULT_LABELS,
	testID: 'country',
	onFallbackChange: jest.fn(),
	onPress: jest.fn(),
}

describe('PickerTrigger', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders label and placeholder when no value', () => {
		const { getByText } = render(<PickerTrigger {...baseProps} />)

		expect(getByText('Country')).toBeTruthy()
		expect(getByText('Select country')).toBeTruthy()
	})

	it('renders display value when provided', () => {
		const { getByText } = render(
			<PickerTrigger {...baseProps} value="🇮🇳  India" />
		)

		expect(getByText('🇮🇳  India')).toBeTruthy()
	})

	it('shows ActivityIndicator when loading', () => {
		const { UNSAFE_getByType } = render(
			<PickerTrigger {...baseProps} isLoading={true} />
		)

		// ActivityIndicator should be rendered
		const indicators = UNSAFE_getByType('ActivityIndicator' as never)
		expect(indicators).toBeTruthy()
	})

	it('disabled state sets accessibility disabled', () => {
		const { getByTestId } = render(
			<PickerTrigger {...baseProps} isDisabled={true} />
		)

		const trigger = getByTestId('country-trigger')
		expect(trigger.props.accessibilityState).toEqual(
			expect.objectContaining({ disabled: true })
		)
	})

	it('calls onPress when pressed and not disabled', () => {
		const { getByTestId } = render(<PickerTrigger {...baseProps} />)

		const trigger = getByTestId('country-trigger')
		fireEvent.press(trigger)

		expect(baseProps.onPress).toHaveBeenCalledTimes(1)
	})

	it('error state renders text input fallback', () => {
		const { getByTestId } = render(
			<PickerTrigger {...baseProps} hasError={true} />
		)

		const fallbackInput = getByTestId('country-fallback-input')
		expect(fallbackInput).toBeTruthy()
	})

	it('custom renderTrigger replaces entire UI', () => {
		const customTrigger = jest.fn(({ label, onPress }) => (
			<React.Fragment>
				<button onClick={onPress}>{label}</button>
			</React.Fragment>
		))

		render(<PickerTrigger {...baseProps} renderTrigger={customTrigger} />)

		expect(customTrigger).toHaveBeenCalledWith(
			expect.objectContaining({
				label: 'Country',
				displayValue: null,
				placeholder: 'Select country',
				isLoading: false,
				isDisabled: false,
				hasError: false,
			})
		)
	})
})
