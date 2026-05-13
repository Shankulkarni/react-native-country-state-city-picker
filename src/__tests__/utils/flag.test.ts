import { isoToFlag } from '../../utils/flag'

describe('isoToFlag', () => {
	it('converts US to 🇺🇸', () => {
		expect(isoToFlag('US')).toBe('🇺🇸')
	})

	it('converts IN to 🇮🇳', () => {
		expect(isoToFlag('IN')).toBe('🇮🇳')
	})

	it('converts GB to 🇬🇧', () => {
		expect(isoToFlag('GB')).toBe('🇬🇧')
	})

	it('converts JP to 🇯🇵', () => {
		expect(isoToFlag('JP')).toBe('🇯🇵')
	})

	it('handles lowercase input by uppercasing', () => {
		expect(isoToFlag('us')).toBe('🇺🇸')
	})

	it('handles mixed case input', () => {
		expect(isoToFlag('iN')).toBe('🇮🇳')
	})
})
