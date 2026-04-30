import { useEffect, useState } from 'react'
import { fetchCities, fetchCountries, fetchStates } from '../api/geocoded'
import {
	cachedFetch,
	citiesCache,
	countriesCache,
	statesCache,
} from '../cache/query-cache'
import type { PickerSelection } from '../types'

type PresetInput = {
	country?: string | null
	state?: string | null
	city?: string | null
}

type UsePresetSelectionResult = {
	selection: Partial<PickerSelection>
	isLoading: boolean
	error: Error | null
}

function matchInsensitive(value: string, target: string): boolean {
	return value.toLowerCase() === target.toLowerCase()
}

/**
 * Resolves string identifiers from a backend into full Country/State/City
 * objects suitable for passing as `defaultValue` to CountryStateCityPicker.
 *
 * Each field accepts either a name or ISO code, matched case-insensitively.
 * City accepts name only (cities have no ISO code in the dataset).
 *
 * @example
 * const { selection, isLoading } = usePresetSelection({
 *   country: 'IN',   // or 'India'
 *   state: 'MH',     // or 'Maharashtra'
 *   city: 'Mumbai',
 * })
 *
 * if (!isLoading) {
 *   return <CountryStateCityPicker defaultValue={selection} ... />
 * }
 */
export function usePresetSelection(
	input: PresetInput
): UsePresetSelectionResult {
	const [result, setResult] = useState<UsePresetSelectionResult>({
		selection: {},
		isLoading: !!(input.country || input.state || input.city),
		error: null,
	})

	const countryKey = input.country ?? null
	const stateKey = input.state ?? null
	const cityKey = input.city ?? null

	useEffect(() => {
		if (!countryKey && !stateKey && !cityKey) {
			setResult({ selection: {}, isLoading: false, error: null })
			return
		}

		let cancelled = false

		async function resolve() {
			try {
				// --- Country ---
				const countries = await cachedFetch(
					countriesCache,
					'countries',
					fetchCountries
				)
				if (cancelled) return

				if (!countryKey) {
					setResult({ selection: {}, isLoading: false, error: null })
					return
				}

				const resolvedCountry =
					countries.find(
						(c) =>
							matchInsensitive(c.isoCode, countryKey) ||
							matchInsensitive(c.name, countryKey)
					) ?? null

				if (!resolvedCountry || !stateKey) {
					setResult({
						selection: { country: resolvedCountry, state: null, city: null },
						isLoading: false,
						error: null,
					})
					return
				}

				// --- State ---
				const states = await cachedFetch(
					statesCache,
					resolvedCountry.isoCode,
					() => fetchStates(resolvedCountry.isoCode)
				)
				if (cancelled) return

				const resolvedState =
					states.find(
						(s) =>
							matchInsensitive(s.isoCode, stateKey) ||
							matchInsensitive(s.name, stateKey)
					) ?? null

				if (!resolvedState || !cityKey) {
					setResult({
						selection: {
							country: resolvedCountry,
							state: resolvedState,
							city: null,
						},
						isLoading: false,
						error: null,
					})
					return
				}

				// --- City ---
				const cacheKey = `${resolvedCountry.isoCode}:${resolvedState.isoCode}`
				const cities = await cachedFetch(citiesCache, cacheKey, () =>
					fetchCities(resolvedCountry.isoCode, resolvedState.isoCode)
				)
				if (cancelled) return

				const resolvedCity =
					cities.find((c) => matchInsensitive(c.name, cityKey)) ?? null

				setResult({
					selection: {
						country: resolvedCountry,
						state: resolvedState,
						city: resolvedCity,
					},
					isLoading: false,
					error: null,
				})
			} catch (err) {
				if (!cancelled) {
					setResult({
						selection: {},
						isLoading: false,
						error: err instanceof Error ? err : new Error(String(err)),
					})
				}
			}
		}

		resolve()
		return () => {
			cancelled = true
		}
	}, [countryKey, stateKey, cityKey])

	return result
}
