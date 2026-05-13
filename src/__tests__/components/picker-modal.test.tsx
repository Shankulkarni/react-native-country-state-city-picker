import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'
import { PickerModal } from '../../components/picker-modal'
import { DEFAULT_THEME } from '../../theme'
import { DEFAULT_LABELS } from '../../labels'

jest.mock('../../hooks/use-debounce', () => ({
	useDebounce: (value: string) => value, // no debounce in tests
}))

const baseItems = [
	{ label: '🇮🇳  India', value: 'IN' },
	{ label: '🇺🇸  United States', value: 'US' },
	{ label: '🇬🇧  United Kingdom', value: 'GB' },
	{ label: '🇧🇷  Brazil', value: 'BR' },
]

const baseProps = {
	visible: true,
	items: baseItems,
	title: 'Select Country',
	theme: DEFAULT_THEME,
	labels: DEFAULT_LABELS,
	isDark: false,
	bottomInset: 0,
	testID: 'country',
	onSelect: jest.fn(),
	onClose: jest.fn(),
}

describe('PickerModal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders items list when visible', () => {
		const { getByText } = render(<PickerModal {...baseProps} />)

		expect(getByText('🇮🇳  India')).toBeTruthy()
		expect(getByText('🇺🇸  United States')).toBeTruthy()
	})

	it('does not render when not visible', () => {
		const { queryByText } = render(
			<PickerModal {...baseProps} visible={false} />
		)

		expect(queryByText('🇮🇳  India')).toBeNull()
	})

	it('search filters items', () => {
		const { getByTestId, queryByText } = render(<PickerModal {...baseProps} />)

		const searchInput = getByTestId('country-search')
		act(() => {
			fireEvent.changeText(searchInput, 'India')
		})

		expect(queryByText('🇮🇳  India')).toBeTruthy()
		expect(queryByText('🇺🇸  United States')).toBeNull()
	})

	it('empty state renders when no results', () => {
		const { getByTestId, getByText } = render(<PickerModal {...baseProps} />)

		const searchInput = getByTestId('country-search')
		act(() => {
			fireEvent.changeText(searchInput, 'xyznonexistent')
		})

		expect(getByText('No results')).toBeTruthy()
	})

	it('onSelect fires with correct value on item press', () => {
		const { getByTestId } = render(<PickerModal {...baseProps} />)

		const indiaOption = getByTestId('country-option-IN')
		fireEvent.press(indiaOption)

		expect(baseProps.onSelect).toHaveBeenCalledWith('IN')
		expect(baseProps.onClose).toHaveBeenCalled()
	})

	it('backdrop press calls onClose', () => {
		const { getByTestId } = render(<PickerModal {...baseProps} />)

		const backdrop = getByTestId('country-backdrop')
		fireEvent.press(backdrop)

		expect(baseProps.onClose).toHaveBeenCalled()
	})

	it('custom renderItem replaces row UI', () => {
		const customItem = jest.fn(({ label, onSelect }) => (
			<button onClick={onSelect}>{label}-custom</button>
		))

		render(<PickerModal {...baseProps} renderItem={customItem} />)

		expect(customItem).toHaveBeenCalledTimes(baseItems.length)
		expect(customItem).toHaveBeenCalledWith(
			expect.objectContaining({
				label: '🇮🇳  India',
				value: 'IN',
			})
		)
	})

	it('custom renderSearch replaces search UI', () => {
		const customSearch = jest.fn(({ value, placeholder, onChangeText }) => (
			<input
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChangeText(e)}
			/>
		))

		render(<PickerModal {...baseProps} renderSearch={customSearch} />)

		expect(customSearch).toHaveBeenCalledWith(
			expect.objectContaining({
				value: '',
				placeholder: 'Search…',
			})
		)
	})

	it('custom renderEmpty replaces empty state', () => {
		const customEmpty = jest.fn(({ query }) => (
			<span>Nothing found for {query}</span>
		))

		render(<PickerModal {...baseProps} items={[]} renderEmpty={customEmpty} />)

		expect(customEmpty).toHaveBeenCalledWith(
			expect.objectContaining({ query: '' })
		)
	})
})
