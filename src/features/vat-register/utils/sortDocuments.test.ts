import { describe, expect, it } from 'vitest'
import type { VatDocument } from '@/domain/vat'
import { documentsByRegister } from '@/mocks/documents'
import { calculateDocumentTotals } from '@/utils/vatCalculations'
import { DEFAULT_SORT } from '../types/sort'
import type { SortKey } from '../types/sort'
import { nextSort, sortDocuments } from './sortDocuments'

const documents = documentsByRegister.sales
const ids = (list: readonly VatDocument[]) => list.map((d) => d.id)

const comparable: Record<SortKey, (d: VatDocument) => string | null> = {
  contractor: (d) => d.contractor,
  issueDate: (d) => d.issueDate,
  documentNumber: (d) => d.documentNumber,
  ksefNumber: (d) => d.ksefNumber,
  identifier: (d) => d.identifier,
}

const sortKeys = Object.keys(comparable) as SortKey[]

describe('sortDocuments', () => {
  it.each(sortKeys)('sorts by %s in both directions', (key) => {
    const asc = sortDocuments(documents, { key, direction: 'asc' })
    const desc = sortDocuments(documents, { key, direction: 'desc' })
    const values = (list: readonly VatDocument[]) =>
      list.map(comparable[key]).filter((value) => value !== null)

    const ascValues = values(asc)
    const descValues = values(desc)
    const compare = (a: string | null, b: string | null) =>
      String(a).localeCompare(String(b), 'pl', { numeric: true })

    expect(ascValues).toEqual([...ascValues].sort(compare))
    expect(descValues).toEqual([...ascValues].sort(compare).reverse())
  })

  it('does not mutate its input and keeps every document', () => {
    const before = ids(documents)
    const sorted = sortDocuments(documents, {
      key: 'contractor',
      direction: 'desc',
    })
    expect(ids(documents)).toEqual(before)
    expect([...ids(sorted)].sort()).toEqual([...before].sort())
  })

  it('keeps the source order for equal values (stable)', () => {
    const [template] = documents
    if (!template) throw new Error('no mock documents')
    const sameContractor = ['c', 'a', 'b'].map((suffix) => ({
      ...template,
      id: `same-${suffix}`,
    }))
    for (const direction of ['asc', 'desc'] as const) {
      const sorted = sortDocuments(sameContractor, {
        key: 'contractor',
        direction,
      })
      expect(ids(sorted)).toEqual(ids(sameContractor))
    }
  })

  it('puts documents without a KSeF number last in both directions', () => {
    for (const direction of ['asc', 'desc'] as const) {
      const sorted = sortDocuments(documents, { key: 'ksefNumber', direction })
      const firstMissing = sorted.findIndex((d) => d.ksefNumber === null)
      expect(firstMissing).toBeGreaterThan(-1)
      expect(
        sorted.slice(firstMissing).every((d) => d.ksefNumber === null),
      ).toBe(true)
    }
  })

  it('orders document numbers naturally (0002 before 0010)', () => {
    const [template] = documents
    if (!template) throw new Error('no mock documents')
    const make = (documentNumber: string): VatDocument => ({
      ...template,
      id: documentNumber,
      documentNumber,
    })
    const sorted = sortDocuments(
      [make('FV/2026/10/0010'), make('FV/2026/10/0002')],
      { key: 'documentNumber', direction: 'asc' },
    )
    expect(ids(sorted)).toEqual(['FV/2026/10/0002', 'FV/2026/10/0010'])
  })

  it('does not change totals', () => {
    const expected = calculateDocumentTotals(documents)
    for (const key of sortKeys) {
      expect(
        calculateDocumentTotals(
          sortDocuments(documents, { key, direction: 'desc' }),
        ),
      ).toEqual(expected)
    }
  })

  it('default sort reproduces the natural newest-first order', () => {
    expect(ids(sortDocuments(documents, DEFAULT_SORT))).toEqual(ids(documents))
  })
})

describe('nextSort', () => {
  it('starts a new column ascending and flips the active one', () => {
    const first = nextSort(DEFAULT_SORT, 'contractor')
    expect(first).toEqual({ key: 'contractor', direction: 'asc' })
    expect(nextSort(first, 'contractor')).toEqual({
      key: 'contractor',
      direction: 'desc',
    })
    expect(
      nextSort(nextSort(first, 'contractor'), 'contractor').direction,
    ).toBe('asc')
  })

  it('flips the default newest-first sort to oldest-first on the date column', () => {
    expect(nextSort(DEFAULT_SORT, 'issueDate')).toEqual({
      key: 'issueDate',
      direction: 'asc',
    })
  })
})
