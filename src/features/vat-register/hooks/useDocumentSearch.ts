import { useCallback, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 300

export function useDocumentSearch() {
  const [inputValue, setInputValue] = useState('')
  // a value applied without waiting for the debounce (programmatic changes, clearing)
  const [appliedNow, setAppliedNow] = useState<string | null>(null)

  const trimmed = inputValue.trim()
  const debounced = useDebouncedValue(trimmed, SEARCH_DEBOUNCE_MS)
  const query = appliedNow === trimmed ? trimmed : debounced

  const setValueNow = useCallback((value: string) => {
    setInputValue(value)
    setAppliedNow(value.trim())
  }, [])

  const clear = useCallback(() => setValueNow(''), [setValueNow])

  return { inputValue, setInputValue, setValueNow, query, clear }
}

export type DocumentSearchState = ReturnType<typeof useDocumentSearch>
