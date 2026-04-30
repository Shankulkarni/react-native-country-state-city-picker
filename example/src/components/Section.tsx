import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SectionProps = {
	title: string
	description?: string
	children: ReactNode
}

export function Section({ title, description, children }: SectionProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			{description ? (
				<Text style={styles.description}>{description}</Text>
			) : null}
			<View style={styles.body}>{children}</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
		borderRadius: 12,
		padding: 16,
		gap: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	title: {
		fontSize: 14,
		fontWeight: '700',
		color: '#111827',
	},
	description: {
		fontSize: 12,
		color: '#6b7280',
		lineHeight: 17,
		marginTop: -4,
	},
	body: { gap: 12 },
})
