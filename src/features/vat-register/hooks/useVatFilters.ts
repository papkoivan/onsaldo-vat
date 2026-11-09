import { useCallback, useMemo, useState } from 'react'
import {
  ALL_FILTER_VALUE,
  DEFAULT_FILTERS,
  EMPTY_FILTERS,
} from '../types/filters'
import type { FilterKey, VatFilters } from '../types/filters'
import { getActiveFilters } from '../utils/filters'

export function useVatFilters(initialFilters: VatFilters = DEFAULT_FILTERS) {
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const activeFilters = useMemo(
    () => getActiveFilters(appliedFilters),
    [appliedFilters],
  )

  const openDrawer = useCallback(() => {
    setDraftFilters(appliedFilters)
    setIsDrawerOpen(true)
  }, [appliedFilters])

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const setDraftValue = useCallback((key: FilterKey, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const resetDraft = useCallback(() => setDraftFilters(EMPTY_FILTERS), [])

  const applyDraft = useCallback(() => {
    setAppliedFilters(draftFilters)
    setIsDrawerOpen(false)
  }, [draftFilters])

  const removeFilter = useCallback((key: FilterKey) => {
    setAppliedFilters((current) => ({ ...current, [key]: ALL_FILTER_VALUE }))
  }, [])

  const clearAll = useCallback(() => setAppliedFilters(EMPTY_FILTERS), [])

  // operation type, JPK code and series differ between registers
  const resetRegisterFilters = useCallback(() => {
    const reset = (current: VatFilters): VatFilters => ({
      ...current,
      operationType: ALL_FILTER_VALUE,
      jpkCode: ALL_FILTER_VALUE,
      documentSeries: ALL_FILTER_VALUE,
    })
    setAppliedFilters(reset)
    setDraftFilters(reset)
  }, [])

  return {
    appliedFilters,
    draftFilters,
    activeFilters,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    setDraftValue,
    resetDraft,
    applyDraft,
    removeFilter,
    clearAll,
    resetRegisterFilters,
  }
}

export type VatFiltersState = ReturnType<typeof useVatFilters>
