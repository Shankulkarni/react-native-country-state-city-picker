import { useEffect, useState } from 'react'
import { fetchStates } from '../api/geocoded'
import { cachedFetch, statesCache } from '../cache/query-cache'
import type { State } from '../types'

type UseStatesResult = {
	data: State[]
	isLoading: boolean
	error: Error | null
}

export function useStates(
	countryCode: string | null | undefined
): UseStatesResult {
	const [state, setState] = useState<UseStatesResult>(() => {
		if (!countryCode) return { data: [], isLoading: false, error: null }
		const cached = statesCache.get(countryCode)
		return cached
			? { data: cached, isLoading: false, error: null }
			: { data: [], isLoading: true, error: null }
	})

	useEffect(() => {
		if (!countryCode) {
			setState({ data: [], isLoading: false, error: null })
			return
		}

		if (statesCache.has(countryCode)) {
			const cached = statesCache.get(countryCode)!
			setState({ data: cached, isLoading: false, error: null })
			return
		}

		setState({ data: [], isLoading: true, error: null })

		let cancelled = false

		cachedFetch(statesCache, countryCode, () => fetchStates(countryCode))
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
	}, [countryCode])

	return state
}
