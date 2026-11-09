import { useCallback, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 300

export function useDocumentSearch() {
  const [inputValue, setInputValue] = useState('')
  const query = useDebouncedValue(inputValue.trim(), SEARCH_DEBOUNCE_MS)

  const clear = useCallback(() => setInputValue(''), [])

  return { inputValue, setInputValue, query, clear }
}

export type DocumentSearchState = ReturnType<typeof useDocumentSearch>
