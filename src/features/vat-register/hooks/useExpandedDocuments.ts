import { useCallback, useState } from 'react'

export function useExpandedDocuments() {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )

  const toggle = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return { expandedIds, toggle }
}

export type ExpandedDocumentsState = ReturnType<typeof useExpandedDocuments>
