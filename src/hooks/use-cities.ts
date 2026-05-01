import { useEffect, useState } from 'react'
import { fetchCities } from '../api/geocoded'
import { cachedFetch, citiesCache } from '../cache/query-cache'
import type { City } from '../types'

type UseCitiesResult = {
	data: City[]
	isLoading: boolean
	error: Error | null
}

type FetchResult = {
	forKey: string | null
	data: City[]
	error: Error | null
}

function cacheKey(countryCode: string, stateCode: string): string {
	return `${countryCode}:${stateCode}`
}

export function useCities(
	countryCode: string | null | undefined,
	stateCode: string | null | undefined
): UseCitiesResult {
	const [result, setResult] = useState<FetchResult>({
		forKey: null,
		data: [],
		error: null,
	})

	useEffect(() => {
		if (!countryCode || !stateCode) {
			setResult({ forKey: null, data: [], error: null })
			return
		}

		const key = cacheKey(countryCode, stateCode)

		if (citiesCache.has(key)) {
			setResult({ forKey: key, data: citiesCache.get(key)!, error: null })
			return
		}

		let cancelled = false

		cachedFetch(citiesCache, key, () => fetchCities(countryCode, stateCode))
			.then((data) => {
				if (!cancelled) setResult({ forKey: key, data, error: null })
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setResult({
						forKey: key,
						data: [],
						error: err instanceof Error ? err : new Error(String(err)),
					})
			})

		return () => {
			cancelled = true
		}
	}, [countryCode, stateCode])

	// Derive the correct state synchronously so there is no render where
	// isLoading is falsely false between the keys changing and the effect
	// firing (which would cause a spurious isNotApplicable=true flash).
	if (!countryCode || !stateCode)
		return { data: [], isLoading: false, error: null }

	const key = cacheKey(countryCode, stateCode)

	const cached = citiesCache.get(key)
	if (cached) return { data: cached, isLoading: false, error: null }

	if (result.forKey === key) {
		return { data: result.data, isLoading: false, error: result.error }
	}

	// result is for a different (or null) key — fetch is in progress
	return { data: [], isLoading: true, error: null }
}
