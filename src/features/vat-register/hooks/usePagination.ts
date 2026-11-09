import { useCallback, useMemo, useState } from 'react'

export const PAGE_SIZE_OPTIONS = [10, 20, 25] as const
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0]

/** Paginates `items`; goes back to page 1 whenever the `items` reference changes (search, filters, register). */
export function usePagination<T>(items: readonly T[]) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState<number>(DEFAULT_PAGE_SIZE)
  const [trackedItems, setTrackedItems] = useState(items)

  if (trackedItems !== items) {
    setTrackedItems(items)
    setPage(1)
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, items.length)

  const pageItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  )

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setPage(1)
  }, [])

  return {
    pageItems,
    page: currentPage,
    pageCount,
    pageSize,
    totalCount: items.length,
    rangeStart: items.length === 0 ? 0 : startIndex + 1,
    rangeEnd: endIndex,
    setPage,
    setPageSize,
  }
}

export type PaginationState = ReturnType<typeof usePagination>
