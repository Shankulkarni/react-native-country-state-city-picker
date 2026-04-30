import type { City, Country, State } from '../types'

/**
 * Simple LRU cache backed by a Map (insertion order = access order).
 * On each get() the entry is moved to the tail (most-recently-used).
 * On overflow the head (least-recently-used) is evicted.
 */
class LRUCache<T> {
	private readonly map = new Map<string, T>()

	constructor(private readonly maxSize: number) {}

	get(key: string): T | undefined {
		const value = this.map.get(key)
		if (value === undefined) return undefined
		// Refresh position
		this.map.delete(key)
		this.map.set(key, value)
		return value
	}

	set(key: string, value: T): void {
		if (this.map.has(key)) {
			this.map.delete(key)
		} else if (this.map.size >= this.maxSize) {
			// Evict LRU (first key in insertion order)
			const lruKey = this.map.keys().next().value
			if (lruKey !== undefined) this.map.delete(lruKey)
		}
		this.map.set(key, value)
	}

	has(key: string): boolean {
		return this.map.has(key)
	}
}

// ---------------------------------------------------------------------------
// Typed cache instances — sized to the memory profile of each resource
//
//  Countries : 1 entry   (~250 items × ~40 B  ≈   10 KB)
//  States    : 20 entries (~50 items avg × ~30 B ≈  30 KB total)
//  Cities    : 10 entries (~1 000 items avg × ~30 B ≈ 300 KB total)
// ---------------------------------------------------------------------------
export const countriesCache = new LRUCache<Country[]>(1)
export const statesCache = new LRUCache<State[]>(20)
export const citiesCache = new LRUCache<City[]>(10)

// ---------------------------------------------------------------------------
// In-flight deduplication
// If two components request the same key simultaneously, only one fetch fires.
// ---------------------------------------------------------------------------
const pending = new Map<string, Promise<unknown>>()

export function cachedFetch<T>(
	cache: LRUCache<T>,
	key: string,
	fetcher: () => Promise<T>
): Promise<T> {
	const hit = cache.get(key)
	if (hit !== undefined) return Promise.resolve(hit)

	const inflight = pending.get(key) as Promise<T> | undefined
	if (inflight !== undefined) return inflight

	const promise = fetcher()
		.then((data) => {
			cache.set(key, data)
			pending.delete(key)
			return data
		})
		.catch((err: unknown) => {
			pending.delete(key)
			throw err
		})

	pending.set(key, promise)
	return promise
}
