// Strips combining diacritical marks from a string after NFD decomposition.
// "café" → "cafe", "São Paulo" → "Sao Paulo", "Zürich" → "Zurich"
function normalize(str: string): string {
	return str
		.normalize('NFD')
		.replace(/\p{Mn}/gu, '')
		.toLocaleLowerCase()
}

// Returns true if `text` contains `query`, ignoring diacritics and case.
// Locale-safe: uses toLocaleLowerCase so Turkish İ/ı are handled correctly.
export function matchesSearch(text: string, query: string): boolean {
	const q = query.trim()
	if (!q) return true
	return normalize(text).includes(normalize(q))
}
