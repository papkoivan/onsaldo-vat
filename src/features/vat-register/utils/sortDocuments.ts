import type { VatDocument } from '@/domain/vat'
import type { DocumentSort, SortDirection, SortKey } from '../types/sort'

const collator = new Intl.Collator('pl', { numeric: true, sensitivity: 'base' })

function compareValues(key: SortKey, a: VatDocument, b: VatDocument): number {
  switch (key) {
    case 'issueDate':
      // ISO dates sort correctly as plain strings
      return a.issueDate.localeCompare(b.issueDate)
    default:
      return collator.compare(a[key] ?? '', b[key] ?? '')
  }
}

/**
 * Returns a sorted copy. Ties keep the source order (stable sort), and documents
 * without a value (no KSeF number yet) always go last, whatever the direction.
 */
export function sortDocuments(
  documents: readonly VatDocument[],
  { key, direction }: DocumentSort,
): VatDocument[] {
  const factor = direction === 'asc' ? 1 : -1

  return [...documents].sort((a, b) => {
    const aMissing = a[key] === null
    const bMissing = b[key] === null
    if (aMissing || bMissing) return Number(aMissing) - Number(bMissing)
    return factor * compareValues(key, a, b)
  })
}

/** Clicking the active column flips the direction; a new column starts ascending. */
export function nextSort(current: DocumentSort, key: SortKey): DocumentSort {
  const direction: SortDirection =
    current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
  return { key, direction }
}
