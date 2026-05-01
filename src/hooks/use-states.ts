import { useEffect, useState } from 'react'
import { fetchStates } from '../api/geocoded'
import { cachedFetch, statesCache } from '../cache/query-cache'
import type { State } from '../types'

type UseStatesResult = {
	data: State[]
	isLoading: boolean
	error: Error | null
}

type FetchResult = {
	forCode: string | null
	data: State[]
	error: Error | null
}

export function useStates(
	countryCode: string | null | undefined
): UseStatesResult {
	const [result, setResult] = useState<FetchResult>({
		forCode: null,
		data: [],
		error: null,
	})

	useEffect(() => {
		if (!countryCode) {
			setResult({ forCode: null, data: [], error: null })
			return
		}

		if (statesCache.has(countryCode)) {
			setResult({
				forCode: countryCode,
				data: statesCache.get(countryCode)!,
				error: null,
			})
			return
		}

		let cancelled = false

		cachedFetch(statesCache, countryCode, () => fetchStates(countryCode))
			.then((data) => {
				if (!cancelled) setResult({ forCode: countryCode, data, error: null })
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setResult({
						forCode: countryCode,
						data: [],
						error: err instanceof Error ? err : new Error(String(err)),
					})
			})

		return () => {
			cancelled = true
		}
	}, [countryCode])

	// Derive the correct state synchronously so there is no render where
	// isLoading is falsely false between the countryCode changing and the
	// effect firing (which would cause a spurious isNotApplicable=true flash).
	if (!countryCode) return { data: [], isLoading: false, error: null }

	const cached = statesCache.get(countryCode)
	if (cached) return { data: cached, isLoading: false, error: null }

	if (result.forCode === countryCode) {
		return { data: result.data, isLoading: false, error: result.error }
	}

	// result is for a different (or null) code — fetch is in progress
	return { data: [], isLoading: true, error: null }
}
