import { useCallback, useMemo, useState } from 'react'

/**
 * Selection is tracked by id; only ids present in `visibleIds` are reported.
 * It is dropped whenever `resetKey` changes (another register or dataset).
 */
export function useDocumentSelection(
  visibleIds: readonly string[],
  resetKey: string,
) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const [trackedKey, setTrackedKey] = useState(resetKey)

  if (trackedKey !== resetKey) {
    setTrackedKey(resetKey)
    setSelectedIds(new Set())
  }

  const selectedVisibleCount = useMemo(
    () => visibleIds.filter((id) => selectedIds.has(id)).length,
    [visibleIds, selectedIds],
  )
  const allSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length
  const someSelected = selectedVisibleCount > 0 && !allSelected

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds((current) => new Set([...current, ...visibleIds]))
  }, [visibleIds])

  const deselectAll = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current)
      visibleIds.forEach((id) => next.delete(id))
      return next
    })
  }, [visibleIds])

  const toggleAll = allSelected ? deselectAll : selectAll

  const clear = useCallback(() => setSelectedIds(new Set()), [])

  return {
    selectedIds,
    allSelected,
    someSelected,
    toggle,
    selectAll,
    toggleAll,
    clear,
  }
}

export type DocumentSelectionState = ReturnType<typeof useDocumentSelection>
