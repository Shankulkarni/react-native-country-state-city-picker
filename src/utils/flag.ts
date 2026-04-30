// Converts a 2-letter ISO country code to a flag emoji.
// "US" → "🇺🇸" by offsetting each char into the Regional Indicator Symbol block.
export function isoToFlag(isoCode: string): string {
	return isoCode
		.toUpperCase()
		.split('')
		.map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
		.join('')
}
