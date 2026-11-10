import type { VatDocument } from '@/domain/vat'

export type SortKey = keyof Pick<
  VatDocument,
  'contractor' | 'issueDate' | 'documentNumber' | 'ksefNumber' | 'identifier'
>

export type SortDirection = 'asc' | 'desc'

export interface DocumentSort {
  key: SortKey
  direction: SortDirection
}

/** The mock registers are listed newest first, so this is also their natural order. */
export const DEFAULT_SORT: DocumentSort = {
  key: 'issueDate',
  direction: 'desc',
}
