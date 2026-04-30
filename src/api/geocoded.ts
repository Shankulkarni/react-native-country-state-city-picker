import type { City, Country, State } from '../types'
import { isoToFlag } from '../utils/flag'

const BASE_URL = 'https://api.geocoded.me'

// Every endpoint — including /countries — returns this envelope.
// meta.hasMore drives pagination; cursor is present but we use offset.
type ApiEnvelope<T> = {
	data: T[]
	meta: {
		total: number
		limit: number
		offset: number
		hasMore: boolean
		cursor: string | null
	}
}

// ---------------------------------------------------------------------------
// Retry with exponential back-off
// Retries on network errors and non-2xx responses.
// Bad country/state codes return HTTP 200 + empty data — never retried.
// Delays: 300 ms → 600 ms → 1 200 ms (3 attempts total)
// ---------------------------------------------------------------------------
async function withRetry<T>(
	fn: () => Promise<T>,
	maxAttempts = 3,
	baseDelayMs = 300
): Promise<T> {
	let lastError: unknown
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			return await fn()
		} catch (err) {
			lastError = err
			if (attempt < maxAttempts - 1) {
				await new Promise<void>((resolve) =>
					setTimeout(resolve, baseDelayMs * 2 ** attempt)
				)
			}
		}
	}
	throw lastError
}

async function apiFetch<T>(url: string): Promise<T> {
	const res = await fetch(url)
	if (!res.ok) {
		throw new Error(`geocoded.me ${res.status} ${res.statusText}`)
	}
	return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Pagination — fetches all pages for a given resource URL.
// Each individual page is retried independently so a transient failure on
// page N doesn't restart the whole sequence from page 1.
// Limit of 500 keeps each response lean; most resources fit in 1–3 pages.
// ---------------------------------------------------------------------------
const PAGE_LIMIT = 500

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
	const results: T[] = []
	let offset = 0

	while (true) {
		const sep = baseUrl.includes('?') ? '&' : '?'
		const url = `${baseUrl}${sep}limit=${PAGE_LIMIT}&offset=${offset}`

		// Retry each page individually
		const envelope = await withRetry(() => apiFetch<ApiEnvelope<T>>(url))
		results.push(...envelope.data)

		if (!envelope.meta.hasMore) break
		offset += PAGE_LIMIT
	}

	return results
}

// ---------------------------------------------------------------------------
// Raw API shapes (only fields we use)
// ---------------------------------------------------------------------------

type RawCountry = {
	name: string
	iso2: string
	emoji: string
	currency: string
}

type RawState = {
	name: string
	iso2: string
	countryCode: string
}

type RawCity = {
	name: string
	stateCode: string
	countryCode: string
}

// ---------------------------------------------------------------------------
// Public fetch functions
// ---------------------------------------------------------------------------

export async function fetchCountries(): Promise<Country[]> {
	// /countries is also paginated — responses come in the same envelope shape
	const raw = await fetchAllPages<RawCountry>(`${BASE_URL}/countries`)

	return raw.map((c) => ({
		name: c.name,
		isoCode: c.iso2,
		flag: c.emoji ?? isoToFlag(c.iso2),
		currency: c.currency,
	}))
}

export async function fetchStates(countryCode: string): Promise<State[]> {
	const raw = await fetchAllPages<RawState>(
		`${BASE_URL}/countries/${encodeURIComponent(countryCode)}/states`
	)

	return raw.map((s) => ({
		name: s.name,
		isoCode: s.iso2,
		countryCode: s.countryCode,
	}))
}

export async function fetchCities(
	countryCode: string,
	stateCode: string
): Promise<City[]> {
	const raw = await fetchAllPages<RawCity>(
		`${BASE_URL}/countries/${encodeURIComponent(countryCode)}/states/${encodeURIComponent(stateCode)}/cities`
	)

	return raw.map((c) => ({
		name: c.name,
		stateCode: c.stateCode,
		countryCode: c.countryCode,
	}))
}
