import type { VatDocument } from '@/domain/vat'
import { ALL_FILTER_VALUE } from '../types/filters'
import type { VatFilters } from '../types/filters'
import { matchesSearchQuery } from './search'

interface DocumentCriteria {
  query: string
  filters: VatFilters
}

const isActive = (value: string): boolean => value !== ALL_FILTER_VALUE

/** The period is matched against the issue date (`YYYY-MM-DD`). */
function matchesPeriod(
  { issueDate }: VatDocument,
  { year, month }: VatFilters,
): boolean {
  const [documentYear, documentMonth] = issueDate.split('-')
  if (isActive(year) && documentYear !== year) return false
  if (isActive(month) && String(Number(documentMonth)) !== month) return false
  return true
}

export function filterDocuments(
  documents: readonly VatDocument[],
  { query, filters }: DocumentCriteria,
): VatDocument[] {
  return documents.filter(
    (document) =>
      matchesPeriod(document, filters) &&
      (!isActive(filters.operationType) ||
        document.operationType === filters.operationType) &&
      (!isActive(filters.jpkCode) || document.jpkCode === filters.jpkCode) &&
      (!isActive(filters.documentSeries) ||
        document.documentSeries === filters.documentSeries) &&
      matchesSearchQuery(document, query),
  )
}
