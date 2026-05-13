import { renderHook, waitFor } from '@testing-library/react-native'

const mockCachedFetch = jest.fn()
const mockCountriesCache = {
	get: jest.fn(),
	has: jest.fn(),
	set: jest.fn(),
}

jest.mock('../../cache/query-cache', () => ({
	cachedFetch: (...args: unknown[]) => mockCachedFetch(...args),
	countriesCache: {
		get: (...args: unknown[]) => mockCountriesCache.get(...args),
		has: (...args: unknown[]) => mockCountriesCache.has(...args),
		set: (...args: unknown[]) => mockCountriesCache.set(...args),
	},
}))

jest.mock('../../api/geocoded', () => ({
	fetchCountries: jest.fn(),
}))

import { useCountries } from '../../hooks/use-countries'

describe('useCountries', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		mockCountriesCache.get.mockReturnValue(undefined)
		mockCountriesCache.has.mockReturnValue(false)
	})

	it('returns isLoading: true initially when cache is empty', () => {
		mockCachedFetch.mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(() => useCountries())

		expect(result.current.isLoading).toBe(true)
		expect(result.current.data).toEqual([])
		expect(result.current.error).toBeNull()
	})

	it('returns countries after fetch resolves', async () => {
		const countries = [
			{ name: 'India', isoCode: 'IN', flag: '🇮🇳', currency: 'INR' },
		]
		mockCachedFetch.mockResolvedValue(countries)

		const { result } = renderHook(() => useCountries())

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.data).toEqual(countries)
		expect(result.current.error).toBeNull()
	})

	it('returns cached data synchronously on re-mount', () => {
		const countries = [
			{ name: 'US', isoCode: 'US', flag: '🇺🇸', currency: 'USD' },
		]
		mockCountriesCache.get.mockReturnValue(countries)
		mockCountriesCache.has.mockReturnValue(true)

		const { result } = renderHook(() => useCountries())

		expect(result.current.isLoading).toBe(false)
		expect(result.current.data).toBe(countries)
		expect(mockCachedFetch).not.toHaveBeenCalled()
	})

	it('returns error when fetch rejects', async () => {
		mockCachedFetch.mockRejectedValue(new Error('Network down'))

		const { result } = renderHook(() => useCountries())

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.error).toBeInstanceOf(Error)
		expect(result.current.error!.message).toBe('Network down')
		expect(result.current.data).toEqual([])
	})
})
