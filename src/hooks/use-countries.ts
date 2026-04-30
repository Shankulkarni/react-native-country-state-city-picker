import { useEffect, useState } from 'react'
import { fetchCountries } from '../api/geocoded'
import { cachedFetch, countriesCache } from '../cache/query-cache'
import type { Country } from '../types'

type UseCountriesResult = {
	data: Country[]
	isLoading: boolean
	error: Error | null
}

const CACHE_KEY = 'countries'

export function useCountries(): UseCountriesResult {
	const [state, setState] = useState<UseCountriesResult>(() => {
		const cached = countriesCache.get(CACHE_KEY)
		return cached
			? { data: cached, isLoading: false, error: null }
			: { data: [], isLoading: true, error: null }
	})

	useEffect(() => {
		// Already hydrated from cache in initial state
		if (countriesCache.has(CACHE_KEY)) return

		cachedFetch(countriesCache, CACHE_KEY, fetchCountries)
			.then((data) => setState({ data, isLoading: false, error: null }))
			.catch((err: unknown) =>
				setState({
					data: [],
					isLoading: false,
					error: err instanceof Error ? err : new Error(String(err)),
				})
			)
	}, [])

	return state
}
