import { renderHook, waitFor } from '@testing-library/react-native'

const mockCachedFetch = jest.fn()
const mockCitiesCache = {
	get: jest.fn(),
	has: jest.fn(),
	set: jest.fn(),
}

jest.mock('../../cache/query-cache', () => ({
	cachedFetch: (...args: unknown[]) => mockCachedFetch(...args),
	citiesCache: {
		get: (...args: unknown[]) => mockCitiesCache.get(...args),
		has: (...args: unknown[]) => mockCitiesCache.has(...args),
		set: (...args: unknown[]) => mockCitiesCache.set(...args),
	},
}))

jest.mock('../../api/geocoded', () => ({
	fetchCities: jest.fn(),
}))

import { useCities } from '../../hooks/use-cities'

describe('useCities', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		mockCitiesCache.get.mockReturnValue(undefined)
		mockCitiesCache.has.mockReturnValue(false)
	})

	it('returns empty when countryCode is null', () => {
		const { result } = renderHook(() => useCities(null, 'MH'))

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeNull()
	})

	it('returns empty when stateCode is null', () => {
		const { result } = renderHook(() => useCities('IN', null))

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeNull()
	})

	it('returns empty when both codes are null', () => {
		const { result } = renderHook(() => useCities(null, null))

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
	})

	it('shows loading when both codes are provided and not cached', () => {
		mockCachedFetch.mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(() => useCities('IN', 'MH'))

		expect(result.current.isLoading).toBe(true)
		expect(result.current.data).toEqual([])
	})

	it('fetches cities when both codes are provided', async () => {
		const cities = [
			{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' },
			{ name: 'Pune', stateCode: 'MH', countryCode: 'IN' },
		]
		mockCachedFetch.mockResolvedValue(cities)

		const { result } = renderHook(() => useCities('IN', 'MH'))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.data).toEqual(cities)
		expect(result.current.error).toBeNull()
	})

	it('returns cached cities synchronously', () => {
		const cities = [{ name: 'Austin', stateCode: 'TX', countryCode: 'US' }]
		mockCitiesCache.has.mockReturnValue(true)
		mockCitiesCache.get.mockReturnValue(cities)

		const { result } = renderHook(() => useCities('US', 'TX'))

		expect(result.current.isLoading).toBe(false)
		expect(result.current.data).toBe(cities)
		expect(mockCachedFetch).not.toHaveBeenCalled()
	})

	it('handles state with zero cities (empty array, not error)', async () => {
		mockCachedFetch.mockResolvedValue([])

		const { result } = renderHook(() => useCities('XX', 'YY'))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.data).toEqual([])
		expect(result.current.error).toBeNull()
	})
})
