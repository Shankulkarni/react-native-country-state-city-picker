import { matchesSearch } from '../../utils/search'

describe('matchesSearch', () => {
	it('returns true when query is empty', () => {
		expect(matchesSearch('anything', '')).toBe(true)
	})

	it('returns true when query is whitespace-only', () => {
		expect(matchesSearch('anything', '   ')).toBe(true)
	})

	it('matches case-insensitively', () => {
		expect(matchesSearch('New York', 'NEW')).toBe(true)
		expect(matchesSearch('New York', 'new york')).toBe(true)
	})

	it('strips diacritical marks for matching', () => {
		expect(matchesSearch('São Paulo', 'sao')).toBe(true)
		expect(matchesSearch('São Paulo', 'Sao Paulo')).toBe(true)
	})

	it('matches accented query against plain text', () => {
		expect(matchesSearch('Sao Paulo', 'São')).toBe(true)
	})

	it('handles Zürich with umlaut stripping', () => {
		expect(matchesSearch('Zürich', 'zurich')).toBe(true)
	})

	it('handles café → cafe', () => {
		expect(matchesSearch('café', 'cafe')).toBe(true)
	})

	it('returns false when no match', () => {
		expect(matchesSearch('Paris', 'xyz')).toBe(false)
	})

	it('matches partial substrings', () => {
		expect(matchesSearch('United States', 'ted sta')).toBe(true)
	})

	it('handles Turkish İ/ı locale-safely', () => {
		// toLocaleLowerCase should handle these correctly
		expect(matchesSearch('İstanbul', 'istanbul')).toBe(true)
	})
})
