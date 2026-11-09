import type { VatDocument } from '@/domain/vat'

export type SearchableDocument = Pick<
  VatDocument,
  'contractor' | 'documentNumber' | 'ksefNumber' | 'identifier'
>

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase()

export function matchesSearchQuery(
  document: SearchableDocument,
  query: string,
): boolean {
  const normalizedQuery = normalize(query.trim())
  if (!normalizedQuery) return true

  return [
    document.contractor,
    document.documentNumber,
    document.ksefNumber ?? '',
    document.identifier,
  ].some((field) => normalize(field).includes(normalizedQuery))
}
