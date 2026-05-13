import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(react-native|@react-native|@testing-library)/)',
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	testPathIgnorePatterns: ['/node_modules/', '/lib/', '/example/'],
	testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
	setupFiles: ['./jest.setup.ts'],
}

export default config
