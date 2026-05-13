import { renderHook, waitFor } from '@testing-library/react-native'

const mockCachedFetch = jest.fn()
const mockStatesCache = {
	get: jest.fn(),
	has: jest.fn(),
	set: jest.fn(),
}

jest.mock('../../cache/query-cache', () => ({
	cachedFetch: (...args: unknown[]) => mockCachedFetch(...args),
	statesCache: {
		get: (...args: unknown[]) => mockStatesCache.get(...args),
		has: (...args: unknown[]) => mockStatesCache.has(...args),
		set: (...args: unknown[]) => mockStatesCache.set(...args),
	},
}))

jest.mock('../../api/geocoded', () => ({
	fetchStates: jest.fn(),
}))

import { useStates } from '../../hooks/use-states'

describe('useStates', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		mockStatesCache.get.mockReturnValue(undefined)
		mockStatesCache.has.mockReturnValue(false)
	})

	it('returns empty data when countryCode is null', () => {
		const { result } = renderHook(() => useStates(null))

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeNull()
	})

	it('returns empty data when countryCode is undefined', () => {
		const { result } = renderHook(() => useStates(undefined))

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
		expect(result.current.error).toBeNull()
	})

	it('shows loading when countryCode is provided and not cached', () => {
		mockCachedFetch.mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(() => useStates('IN'))

		expect(result.current.isLoading).toBe(true)
		expect(result.current.data).toEqual([])
	})

	it('fetches states when countryCode is provided', async () => {
		const states = [
			{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' },
			{ name: 'Karnataka', isoCode: 'KA', countryCode: 'IN' },
		]
		mockCachedFetch.mockResolvedValue(states)

		const { result } = renderHook(() => useStates('IN'))

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
		})

		expect(result.current.data).toEqual(states)
		expect(result.current.error).toBeNull()
	})

	it('returns cached states synchronously (no loading flash)', () => {
		const states = [{ name: 'Texas', isoCode: 'TX', countryCode: 'US' }]
		mockStatesCache.has.mockReturnValue(true)
		mockStatesCache.get.mockReturnValue(states)

		const { result } = renderHook(() => useStates('US'))

		expect(result.current.isLoading).toBe(false)
		expect(result.current.data).toBe(states)
		expect(mockCachedFetch).not.toHaveBeenCalled()
	})

	it('resets to empty when countryCode changes to null', async () => {
		const states = [{ name: 'X', isoCode: 'X', countryCode: 'XX' }]
		mockCachedFetch.mockResolvedValue(states)

		const { result, rerender } = renderHook(({ code }) => useStates(code), {
			initialProps: { code: 'XX' as string | null },
		})

		await waitFor(() => {
			expect(result.current.data).toEqual(states)
		})

		rerender({ code: null })

		expect(result.current.data).toEqual([])
		expect(result.current.isLoading).toBe(false)
	})
})
