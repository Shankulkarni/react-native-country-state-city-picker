import { useState } from 'react'
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { BasicScreen } from './screens/BasicScreen'
import { LabelsScreen } from './screens/LabelsScreen'
import { PresetsScreen } from './screens/PresetsScreen'
import { RenderPropsScreen } from './screens/RenderPropsScreen'
import { ThemeScreen } from './screens/ThemeScreen'

const TABS = ['Basic', 'Theme', 'Labels', 'Render Props', 'Presets'] as const
type Tab = (typeof TABS)[number]

export default function App() {
	const [active, setActive] = useState<Tab>('Basic')

	const Screen = {
		Basic: BasicScreen,
		Theme: ThemeScreen,
		Labels: LabelsScreen,
		'Render Props': RenderPropsScreen,
		Presets: PresetsScreen,
	}[active]

	return (
		<SafeAreaView style={styles.safe}>
			{/* Tab bar */}
			<View style={styles.tabBar}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.tabScroll}
				>
					{TABS.map((tab) => (
						<Pressable
							key={tab}
							onPress={() => setActive(tab)}
							style={[styles.tab, active === tab && styles.tabActive]}
						>
							<Text
								style={[styles.tabText, active === tab && styles.tabTextActive]}
							>
								{tab}
							</Text>
						</Pressable>
					))}
				</ScrollView>
			</View>

			{/* Active screen */}
			<Screen />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: '#f9fafb' },
	tabBar: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#e5e7eb',
		backgroundColor: '#ffffff',
	},
	tabScroll: { paddingHorizontal: 12, gap: 4 },
	tab: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
	},
	tabActive: { borderBottomColor: '#4f46e5' },
	tabText: { fontSize: 13, fontWeight: '500', color: '#6b7280' },
	tabTextActive: { color: '#4f46e5', fontWeight: '600' },
})
