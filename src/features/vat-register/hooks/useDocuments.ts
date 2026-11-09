import { useMemo } from 'react'
import type { RegisterType } from '@/domain/vat'
import { documentsByRegister } from '@/mocks/documents'
import {
  aggregateVatBreakdown,
  calculateDocumentTotals,
} from '@/utils/vatCalculations'
import type { VatFilters } from '../types/filters'
import { filterDocuments } from '../utils/filterDocuments'

export function useDocuments(
  register: RegisterType,
  query: string,
  filters: VatFilters,
) {
  const documents = useMemo(
    () => filterDocuments(documentsByRegister[register], { query, filters }),
    [register, query, filters],
  )
  const totals = useMemo(() => calculateDocumentTotals(documents), [documents])
  const breakdown = useMemo(() => aggregateVatBreakdown(documents), [documents])

  return { documents, totals, breakdown }
}
