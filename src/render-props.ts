import type { ReactNode } from 'react'

// Props passed to renderTrigger.
// When provided, replaces the entire trigger including label, input, and error state.
export type TriggerRenderProps = {
	label: string
	displayValue: string | null
	placeholder: string
	isLoading: boolean
	isDisabled: boolean
	hasError: boolean
	onPress: () => void
}

// Props passed to renderItem for each row in the picker list.
export type ItemRenderProps = {
	label: string
	value: string
	onSelect: () => void
}

// Props passed to renderSearch.
// The library manages the search string state — consumer controls the input UI only.
export type SearchRenderProps = {
	value: string
	placeholder: string
	onChangeText: (text: string) => void
}

// Props passed to renderEmpty.
export type EmptyRenderProps = {
	query: string
}

// Convenience bundle — all four render props in one object.
// Used by individual pickers and the composite to accept + thread render props.
export type PickerRenderProps = {
	renderTrigger?: (props: TriggerRenderProps) => ReactNode
	renderItem?: (props: ItemRenderProps) => ReactNode
	renderSearch?: (props: SearchRenderProps) => ReactNode
	renderEmpty?: (props: EmptyRenderProps) => ReactNode
}
