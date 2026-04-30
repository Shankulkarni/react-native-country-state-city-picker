import { StyleSheet, Text, View } from 'react-native'

type ResultProps = {
	value: unknown
	dark?: boolean
}

export function Result({ value, dark = false }: ResultProps) {
	return (
		<View style={[styles.box, dark && styles.boxDark]}>
			<Text style={[styles.label, dark && styles.labelDark]}>OUTPUT</Text>
			<Text style={[styles.code, dark && styles.codeDark]}>
				{JSON.stringify(value, null, 2)}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	box: {
		backgroundColor: '#f9fafb',
		borderRadius: 8,
		padding: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	boxDark: { backgroundColor: '#18181b', borderColor: '#3f3f46' },
	label: {
		fontSize: 10,
		fontWeight: '700',
		letterSpacing: 0.8,
		color: '#9ca3af',
		marginBottom: 4,
	},
	labelDark: { color: '#71717a' },
	code: { fontSize: 11, color: '#374151', fontFamily: 'monospace' },
	codeDark: { color: '#d4d4d8' },
})
