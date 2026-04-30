import { useEffect, useState } from 'react'
import { fetchCities } from '../api/geocoded'
import { cachedFetch, citiesCache } from '../cache/query-cache'
import type { City } from '../types'

type UseCitiesResult = {
	data: City[]
	isLoading: boolean
	error: Error | null
}

function cacheKey(countryCode: string, stateCode: string): string {
	return `${countryCode}:${stateCode}`
}

export function useCities(
	countryCode: string | null | undefined,
	stateCode: string | null | undefined
): UseCitiesResult {
	const enabled = !!countryCode && !!stateCode

	const [state, setState] = useState<UseCitiesResult>(() => {
		if (!enabled) return { data: [], isLoading: false, error: null }
		const key = cacheKey(countryCode!, stateCode!)
		const cached = citiesCache.get(key)
		return cached
			? { data: cached, isLoading: false, error: null }
			: { data: [], isLoading: true, error: null }
	})

	useEffect(() => {
		if (!countryCode || !stateCode) {
			setState({ data: [], isLoading: false, error: null })
			return
		}

		const key = cacheKey(countryCode, stateCode)

		if (citiesCache.has(key)) {
			const cached = citiesCache.get(key)!
			setState({ data: cached, isLoading: false, error: null })
			return
		}

		setState({ data: [], isLoading: true, error: null })

		let cancelled = false

		cachedFetch(citiesCache, key, () => fetchCities(countryCode, stateCode))
			.then((data) => {
				if (!cancelled) setState({ data, isLoading: false, error: null })
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setState({
						data: [],
						isLoading: false,
						error: err instanceof Error ? err : new Error(String(err)),
					})
			})

		return () => {
			cancelled = true
		}
	}, [countryCode, stateCode])

	return state
}
