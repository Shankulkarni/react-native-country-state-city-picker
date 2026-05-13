import { renderHook, act } from '@testing-library/react-native'
import { useDebounce } from '../../hooks/use-debounce'

beforeEach(() => {
	jest.useFakeTimers()
})

afterEach(() => {
	jest.useRealTimers()
})

describe('useDebounce', () => {
	it('returns initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('hello', 300))
		expect(result.current).toBe('hello')
	})

	it('delays updates by specified ms', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'first', delay: 300 } }
		)

		rerender({ value: 'second', delay: 300 })
		expect(result.current).toBe('first')

		act(() => {
			jest.advanceTimersByTime(300)
		})
		expect(result.current).toBe('second')
	})

	it('only emits final value on rapid changes', () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: 'a', delay: 200 } }
		)

		rerender({ value: 'b', delay: 200 })
		act(() => {
			jest.advanceTimersByTime(100)
		})

		rerender({ value: 'c', delay: 200 })
		act(() => {
			jest.advanceTimersByTime(100)
		})

		rerender({ value: 'd', delay: 200 })

		// 'd' was set last, nothing should have updated yet
		expect(result.current).toBe('a')

		act(() => {
			jest.advanceTimersByTime(200)
		})
		expect(result.current).toBe('d')
	})
})
