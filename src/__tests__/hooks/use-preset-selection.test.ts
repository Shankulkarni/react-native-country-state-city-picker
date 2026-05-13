import { renderHook, waitFor } from '@testing-library/react-native'

const COUNTRIES = [
	{ name: 'India', isoCode: 'IN', flag: '🇮🇳', currency: 'INR' },
	{ name: 'United States', isoCode: 'US', flag: '🇺🇸', currency: 'USD' },
]

const STATES_IN = [
	{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' },
	{ name: 'Karnataka', isoCode: 'KA', countryCode: 'IN' },
]

const CITIES_IN_MH = [
	{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' },
	{ name: 'Pune', stateCode: 'MH', countryCode: 'IN' },
]

const mockCachedFetch = jest.fn()

jest.mock('../../cache/query-cache', () => ({
	cachedFetch: (...args: unknown[]) => mockCachedFetch(...args),
	countriesCache: {},
	statesCache: {},
	citiesCache: {},
}))

jest.mock('../../api/geocoded', () => ({
	fetchCountries: jest.fn(),
	fetchStates: jest.fn(),
	fetchCities: jest.fn(),
}))

import { usePresetSelection } from '../../hooks/use-preset-selection'

describe('usePresetSelection', () => {
	beforeEach(() => {
		mockCachedFetch.mockReset()
	})

	it('returns isLoading: true while resolving', () => {
		mockCachedFetch.mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(() => usePresetSelection({ country: 'IN' }))

		expect(result.current.isLoading).toBe(true)
	})

	it('returns empty selection with no loading when input is empty', () => {
		const { result } = renderHook(() => usePresetSelection({}))

		expect(result.current.isLoading).toBe(false)
		expect(result.current.selection).toEqual({})
	})

	it('resolves country by ISO code (case-insensitive)', async () => {
		mockCachedFetch.mockResolvedValue(COUNTRIES)

		const { result } = renderHook(() => usePresetSelection({ country: 'in' }))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.country).toEqual(COUNTRIES[0])
	})

	it('resolves country by name', async () => {
		mockCachedFetch.mockResolvedValue(COUNTRIES)

		const { result } = renderHook(() =>
			usePresetSelection({ country: 'India' })
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.country).toEqual(COUNTRIES[0])
	})

	it('resolves full cascade: country → state → city', async () => {
		mockCachedFetch
			.mockResolvedValueOnce(COUNTRIES)
			.mockResolvedValueOnce(STATES_IN)
			.mockResolvedValueOnce(CITIES_IN_MH)

		const { result } = renderHook(() =>
			usePresetSelection({ country: 'IN', state: 'MH', city: 'Mumbai' })
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.country).toEqual(COUNTRIES[0])
		expect(result.current.selection.state).toEqual(STATES_IN[0])
		expect(result.current.selection.city).toEqual(CITIES_IN_MH[0])
	})

	it('partial resolution: unknown city stops with country+state', async () => {
		mockCachedFetch
			.mockResolvedValueOnce(COUNTRIES)
			.mockResolvedValueOnce(STATES_IN)
			.mockResolvedValueOnce(CITIES_IN_MH)

		const { result } = renderHook(() =>
			usePresetSelection({ country: 'IN', state: 'MH', city: 'Nonexistent' })
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.country).toEqual(COUNTRIES[0])
		expect(result.current.selection.state).toEqual(STATES_IN[0])
		expect(result.current.selection.city).toBeNull()
	})

	it('stops at country when state is not provided', async () => {
		mockCachedFetch.mockResolvedValue(COUNTRIES)

		const { result } = renderHook(() => usePresetSelection({ country: 'US' }))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.country).toEqual(COUNTRIES[1])
		expect(result.current.selection.state).toBeNull()
		expect(result.current.selection.city).toBeNull()
	})

	it('returns error when fetch fails', async () => {
		mockCachedFetch.mockRejectedValue(new Error('Network error'))

		const { result } = renderHook(() => usePresetSelection({ country: 'IN' }))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.error).toBeInstanceOf(Error)
		expect(result.current.error!.message).toBe('Network error')
	})

	it('resolves state by name (case-insensitive)', async () => {
		mockCachedFetch
			.mockResolvedValueOnce(COUNTRIES)
			.mockResolvedValueOnce(STATES_IN)

		const { result } = renderHook(() =>
			usePresetSelection({ country: 'IN', state: 'maharashtra' })
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.selection.state).toEqual(STATES_IN[0])
	})
})
