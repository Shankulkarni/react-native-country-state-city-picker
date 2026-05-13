import { fetchCountries, fetchStates, fetchCities } from '../../api/geocoded'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
	mockFetch.mockReset()
	jest.useFakeTimers()
})

afterEach(() => {
	jest.useRealTimers()
})

function jsonResponse<T>(data: T, status = 200) {
	return Promise.resolve({
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		json: () => Promise.resolve(data),
	})
}

function envelope<T>(data: T[], hasMore = false, total?: number) {
	return {
		data,
		meta: {
			total: total ?? data.length,
			limit: 500,
			offset: 0,
			hasMore,
			cursor: null,
		},
	}
}

describe('fetchCountries', () => {
	it('maps iso2 to isoCode and emoji to flag', async () => {
		mockFetch.mockReturnValue(
			jsonResponse(
				envelope([
					{ name: 'India', iso2: 'IN', emoji: '🇮🇳', currency: 'INR' },
					{ name: 'United States', iso2: 'US', emoji: '🇺🇸', currency: 'USD' },
				])
			)
		)

		const result = await fetchCountries()

		expect(result).toEqual([
			{ name: 'India', isoCode: 'IN', flag: '🇮🇳', currency: 'INR' },
			{ name: 'United States', isoCode: 'US', flag: '🇺🇸', currency: 'USD' },
		])
	})

	it('falls back to isoToFlag when emoji is null', async () => {
		mockFetch.mockReturnValue(
			jsonResponse(
				envelope([{ name: 'India', iso2: 'IN', emoji: null, currency: 'INR' }])
			)
		)

		const result = await fetchCountries()

		expect(result[0]!.flag).toBe('🇮🇳')
	})
})

describe('fetchStates', () => {
	it('maps iso2 to isoCode and includes countryCode', async () => {
		mockFetch.mockReturnValue(
			jsonResponse(
				envelope([
					{ name: 'Maharashtra', iso2: 'MH', countryCode: 'IN' },
					{ name: 'Karnataka', iso2: 'KA', countryCode: 'IN' },
				])
			)
		)

		const result = await fetchStates('IN')

		expect(result).toEqual([
			{ name: 'Maharashtra', isoCode: 'MH', countryCode: 'IN' },
			{ name: 'Karnataka', isoCode: 'KA', countryCode: 'IN' },
		])
	})

	it('paginates when meta.hasMore is true', async () => {
		mockFetch
			.mockReturnValueOnce(
				jsonResponse({
					data: [{ name: 'State1', iso2: 'S1', countryCode: 'US' }],
					meta: {
						total: 2,
						limit: 500,
						offset: 0,
						hasMore: true,
						cursor: null,
					},
				})
			)
			.mockReturnValueOnce(
				jsonResponse({
					data: [{ name: 'State2', iso2: 'S2', countryCode: 'US' }],
					meta: {
						total: 2,
						limit: 500,
						offset: 500,
						hasMore: false,
						cursor: null,
					},
				})
			)

		const result = await fetchStates('US')

		expect(result).toHaveLength(2)
		expect(result[0]!.name).toBe('State1')
		expect(result[1]!.name).toBe('State2')
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
})

describe('fetchCities', () => {
	it('returns empty array for valid country+state with no cities', async () => {
		mockFetch.mockReturnValue(jsonResponse(envelope([])))

		const result = await fetchCities('XX', 'YY')

		expect(result).toEqual([])
	})

	it('maps city data correctly', async () => {
		mockFetch.mockReturnValue(
			jsonResponse(
				envelope([{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' }])
			)
		)

		const result = await fetchCities('IN', 'MH')

		expect(result).toEqual([
			{ name: 'Mumbai', stateCode: 'MH', countryCode: 'IN' },
		])
	})
})

describe('retry logic', () => {
	it('retries on network error with exponential backoff', async () => {
		mockFetch
			.mockRejectedValueOnce(new Error('Network error'))
			.mockRejectedValueOnce(new Error('Network error'))
			.mockReturnValueOnce(
				jsonResponse(
					envelope([
						{ name: 'India', iso2: 'IN', emoji: '🇮🇳', currency: 'INR' },
					])
				)
			)

		const promise = fetchCountries()

		// Advance through backoff delays: 300ms, 600ms
		await jest.advanceTimersByTimeAsync(300)
		await jest.advanceTimersByTimeAsync(600)

		const result = await promise
		expect(result).toHaveLength(1)
		expect(mockFetch).toHaveBeenCalledTimes(3)
	})

	it('retries on non-2xx response', async () => {
		mockFetch
			.mockReturnValueOnce(
				Promise.resolve({
					ok: false,
					status: 500,
					statusText: 'Internal Server Error',
				})
			)
			.mockReturnValueOnce(
				jsonResponse(
					envelope([{ name: 'US', iso2: 'US', emoji: '🇺🇸', currency: 'USD' }])
				)
			)

		const promise = fetchCountries()
		await jest.advanceTimersByTimeAsync(300)

		const result = await promise
		expect(result).toHaveLength(1)
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})

	it('throws after exhausting all retry attempts', async () => {
		jest.useRealTimers()

		mockFetch
			.mockRejectedValueOnce(new Error('Network error'))
			.mockRejectedValueOnce(new Error('Network error'))
			.mockRejectedValueOnce(new Error('Network error'))

		await expect(fetchCountries()).rejects.toThrow('Network error')
		expect(mockFetch).toHaveBeenCalledTimes(3)
	})

	it('does not retry on 200 with empty data', async () => {
		mockFetch.mockReturnValue(jsonResponse(envelope([])))

		const result = await fetchCities('XX', 'YY')

		expect(result).toEqual([])
		expect(mockFetch).toHaveBeenCalledTimes(1)
	})
})
