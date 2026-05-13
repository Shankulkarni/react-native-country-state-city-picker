import {
	cachedFetch,
	countriesCache,
	statesCache,
	citiesCache,
} from '../../cache/query-cache'

// We need to access the LRUCache class for isolated tests.
// Since it's not exported, we test it through the exported instances.

describe('LRUCache', () => {
	// Use statesCache (maxSize=20) for most tests since it has room for multiple entries
	beforeEach(() => {
		// Clear caches by overwriting keys (no clear() method exposed)
		// We rely on fresh module state per test file via jest isolation
	})

	describe('get/set basics', () => {
		it('returns undefined for a missing key', () => {
			expect(countriesCache.get('nonexistent')).toBeUndefined()
		})

		it('returns value after set', () => {
			const data = [{ name: 'India', isoCode: 'IN', countryCode: 'IN' }]
			statesCache.set('IN', data)
			expect(statesCache.get('IN')).toBe(data)
		})

		it('has() returns true for existing key', () => {
			const data = [{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' }]
			statesCache.set('IN-test', data)
			expect(statesCache.has('IN-test')).toBe(true)
		})

		it('has() returns false for missing key', () => {
			expect(statesCache.has('XX-missing')).toBe(false)
		})
	})

	describe('LRU eviction', () => {
		it('evicts oldest entry when capacity is exceeded', () => {
			// countriesCache has maxSize=1
			const first = [{ name: 'A', isoCode: 'A', flag: '🇦', currency: 'X' }]
			const second = [{ name: 'B', isoCode: 'B', flag: '🇧', currency: 'Y' }]

			countriesCache.set('first', first)
			countriesCache.set('second', second)

			expect(countriesCache.get('first')).toBeUndefined()
			expect(countriesCache.get('second')).toBe(second)
		})

		it('get() promotes entry to MRU so it survives eviction', () => {
			// citiesCache has maxSize=10; use it with controlled entries
			const entries = Array.from({ length: 10 }, (_, i) => ({
				key: `key-${i}`,
				data: [{ name: `City ${i}`, stateCode: 'ST', countryCode: 'XX' }],
			}))

			// Fill cache to capacity
			for (const { key, data } of entries) {
				citiesCache.set(key, data)
			}

			// Access the first entry (promotes it to MRU)
			citiesCache.get('key-0')

			// Add one more entry — should evict key-1 (new LRU), not key-0
			const newEntry = [{ name: 'New', stateCode: 'ST', countryCode: 'XX' }]
			citiesCache.set('key-new', newEntry)

			expect(citiesCache.get('key-0')).toBeDefined()
			expect(citiesCache.get('key-1')).toBeUndefined()
		})
	})
})

describe('cachedFetch', () => {
	// Use a fresh LRUCache-like approach by creating unique keys each test

	it('returns cached data without calling fetcher', async () => {
		const data = [{ name: 'US', isoCode: 'US', flag: '🇺🇸' }]
		countriesCache.set('cached-test', data as never)

		const fetcher = jest.fn()
		const result = await cachedFetch(
			countriesCache as never,
			'cached-test',
			fetcher
		)

		expect(result).toBe(data)
		expect(fetcher).not.toHaveBeenCalled()
	})

	it('calls fetcher on cache miss and caches the result', async () => {
		const data = [{ name: 'California', isoCode: 'CA', countryCode: 'US' }]
		const fetcher = jest.fn().mockResolvedValue(data)

		const result = await cachedFetch(statesCache, 'US-fetch-test', fetcher)

		expect(result).toBe(data)
		expect(fetcher).toHaveBeenCalledTimes(1)
		expect(statesCache.get('US-fetch-test')).toBe(data)
	})

	it('deduplicates concurrent requests for the same key', async () => {
		let resolvePromise: (value: unknown[]) => void
		const fetcher = jest.fn(
			() =>
				new Promise<unknown[]>((resolve) => {
					resolvePromise = resolve
				})
		)

		const promise1 = cachedFetch(statesCache, 'dedup-key', fetcher)
		const promise2 = cachedFetch(statesCache, 'dedup-key', fetcher)

		expect(fetcher).toHaveBeenCalledTimes(1)

		const data = [{ name: 'Test', isoCode: 'T', countryCode: 'US' }]
		resolvePromise!(data)

		const [result1, result2] = await Promise.all([promise1, promise2])
		expect(result1).toBe(data)
		expect(result2).toBe(data)
	})

	it('two calls with different keys run independently', async () => {
		const dataA = [{ name: 'A', isoCode: 'A', countryCode: 'US' }]
		const dataB = [{ name: 'B', isoCode: 'B', countryCode: 'US' }]
		const fetcherA = jest.fn().mockResolvedValue(dataA)
		const fetcherB = jest.fn().mockResolvedValue(dataB)

		const [resultA, resultB] = await Promise.all([
			cachedFetch(statesCache, 'independent-a', fetcherA),
			cachedFetch(statesCache, 'independent-b', fetcherB),
		])

		expect(resultA).toBe(dataA)
		expect(resultB).toBe(dataB)
		expect(fetcherA).toHaveBeenCalledTimes(1)
		expect(fetcherB).toHaveBeenCalledTimes(1)
	})

	it('cleans up pending map after successful resolution', async () => {
		const data = [{ name: 'X', isoCode: 'X', countryCode: 'US' }]
		const fetcher = jest.fn().mockResolvedValue(data)

		await cachedFetch(statesCache, 'cleanup-success', fetcher)

		// A subsequent call should trigger the fetcher again only if not cached.
		// Since it IS cached now, fetcher should NOT be called.
		const fetcher2 = jest.fn()
		await cachedFetch(statesCache, 'cleanup-success', fetcher2)
		expect(fetcher2).not.toHaveBeenCalled()
	})

	it('cleans up pending map on rejection', async () => {
		const fetcher = jest.fn().mockRejectedValue(new Error('Network error'))

		await expect(
			cachedFetch(statesCache, 'cleanup-error', fetcher)
		).rejects.toThrow('Network error')

		// After rejection, pending is cleared so a new call starts a fresh fetch
		const data = [{ name: 'OK', isoCode: 'OK', countryCode: 'US' }]
		const fetcher2 = jest.fn().mockResolvedValue(data)
		const result = await cachedFetch(statesCache, 'cleanup-error', fetcher2)
		expect(result).toBe(data)
		expect(fetcher2).toHaveBeenCalledTimes(1)
	})
})
