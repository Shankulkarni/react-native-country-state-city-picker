// Provide minimal react-native mocks for the test environment
jest.mock('react-native', () => {
	const React = require('react')
	return {
		Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios },
		StyleSheet: {
			create: (styles: Record<string, unknown>) => styles,
			hairlineWidth: 0.5,
			flatten: (style: unknown) => style,
			absoluteFillObject: {
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			},
		},
		useColorScheme: jest.fn(() => 'light'),
		View: ({ children, ...props }: { children?: React.ReactNode }) =>
			React.createElement('View', props, children),
		Text: ({ children, ...props }: { children?: React.ReactNode }) =>
			React.createElement('Text', props, children),
		TextInput: React.forwardRef(
			({ ...props }: Record<string, unknown>, ref: unknown) =>
				React.createElement('TextInput', { ...props, ref }, null)
		),
		Pressable: ({
			children,
			...props
		}: {
			children?:
				| React.ReactNode
				| ((state: { pressed: boolean }) => React.ReactNode)
		}) => {
			const child =
				typeof children === 'function' ? children({ pressed: false }) : children
			return React.createElement('Pressable', props, child)
		},
		TouchableWithoutFeedback: ({
			children,
			...props
		}: {
			children?: React.ReactNode
		}) => React.createElement('TouchableWithoutFeedback', props, children),
		Modal: ({
			children,
			visible,
			...props
		}: {
			children?: React.ReactNode
			visible?: boolean
		}) => (visible ? React.createElement('Modal', props, children) : null),
		FlatList: ({
			data,
			renderItem,
			ListEmptyComponent,
			keyExtractor,
		}: {
			data: unknown[]
			renderItem: (info: { item: unknown; index: number }) => React.ReactNode
			ListEmptyComponent?: React.ComponentType | (() => React.ReactElement)
			keyExtractor?: (item: unknown, index: number) => string
		}) => {
			if (!data || data.length === 0) {
				if (ListEmptyComponent) {
					return typeof ListEmptyComponent === 'function'
						? React.createElement(ListEmptyComponent)
						: ListEmptyComponent
				}
				return null
			}
			return React.createElement(
				'FlatList',
				null,
				data.map((item, index) =>
					React.createElement(
						React.Fragment,
						{ key: keyExtractor ? keyExtractor(item, index) : index },
						renderItem({ item, index })
					)
				)
			)
		},
		ActivityIndicator: (props: Record<string, unknown>) =>
			React.createElement('ActivityIndicator', props),
		Animated: {
			View: ({ children, ...props }: { children?: React.ReactNode }) =>
				React.createElement('Animated.View', props, children),
			Value: class {
				constructor() {}
			},
			timing: () => ({ start: (cb?: () => void) => cb?.() }),
		},
		Keyboard: {
			addListener: () => ({ remove: () => {} }),
		},
		KeyboardAvoidingView: ({
			children,
			...props
		}: {
			children?: React.ReactNode
		}) => React.createElement('KeyboardAvoidingView', props, children),
	}
})
