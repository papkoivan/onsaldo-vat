import { useMemo } from 'react'
import type { RegisterType, VatDocument } from '@/domain/vat'
import { documentsByRegister } from '@/mocks/documents'
import {
  aggregateVatBreakdown,
  calculateDocumentTotals,
} from '@/utils/vatCalculations'
import type { VatFilters } from '../types/filters'
import type { DemoDataState } from '../types/viewState'
import { filterDocuments } from '../utils/filterDocuments'

const NO_DOCUMENTS: readonly VatDocument[] = []

/**
 * The demo state only changes what is exposed: the mock dataset is never modified.
 * While loading or failed no documents are returned, so no stale data can leak downstream.
 */
export function useDocuments(
  register: RegisterType,
  query: string,
  filters: VatFilters,
  dataState: DemoDataState,
) {
  const source =
    dataState === 'empty' ? NO_DOCUMENTS : documentsByRegister[register]
  const isReady = dataState === 'filled' || dataState === 'empty'

  const documents = useMemo(
    () =>
      isReady ? filterDocuments(source, { query, filters }) : NO_DOCUMENTS,
    [isReady, source, query, filters],
  )
  const totals = useMemo(() => calculateDocumentTotals(documents), [documents])
  const breakdown = useMemo(() => aggregateVatBreakdown(documents), [documents])

  return { documents, totals, breakdown, sourceCount: source.length }
}
