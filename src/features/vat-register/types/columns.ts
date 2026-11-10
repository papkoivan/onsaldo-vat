import type { SortKey } from './sort'

export type ColumnKey = SortKey

export const DEFAULT_COLUMN_ORDER: readonly ColumnKey[] = [
  'contractor',
  'issueDate',
  'documentNumber',
  'ksefNumber',
  'identifier',
]
