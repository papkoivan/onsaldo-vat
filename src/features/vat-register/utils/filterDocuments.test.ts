import { describe, expect, it } from 'vitest'
import { documentsByRegister } from '@/mocks/documents'
import { EMPTY_FILTERS } from '../types/filters'
import type { VatFilters } from '../types/filters'
import { filterDocuments } from './filterDocuments'
import { matchesSearchQuery } from './search'

const sales = documentsByRegister.sales
const purchases = documentsByRegister.purchases

const run = (query: string, filters: Partial<VatFilters> = {}) =>
  filterDocuments(sales, { query, filters: { ...EMPTY_FILTERS, ...filters } })

describe('filterDocuments', () => {
  it('returns everything without criteria', () => {
    expect(run('')).toHaveLength(sales.length)
  })

  it('filters by year and month of the issue date', () => {
    const october = run('', { year: '2026', month: '10' })
    expect(october.length).toBeGreaterThan(0)
    expect(october.every((d) => d.issueDate.startsWith('2026-10'))).toBe(true)
    expect(run('', { month: '10' }).length).toBeGreaterThanOrEqual(
      october.length,
    )
  })

  it('combines every filter with AND semantics', () => {
    const base = run('', { year: '2026', month: '10' })
    const target = base.find((d) => d.jpkCode !== null)
    if (!target) throw new Error('mock data needs a document with a JPK code')

    const result = run('', {
      year: '2026',
      month: '10',
      operationType: target.operationType,
      jpkCode: target.jpkCode ?? '',
      documentSeries: target.documentSeries,
    })
    expect(result).toContainEqual(target)
    expect(
      result.every(
        (d) =>
          d.operationType === target.operationType &&
          d.jpkCode === target.jpkCode &&
          d.documentSeries === target.documentSeries,
      ),
    ).toBe(true)
  })

  it('applies search together with filters', () => {
    const target = sales.find((d) => d.issueDate.startsWith('2026-10'))
    if (!target) throw new Error('mock data needs an October document')
    const inPeriod = run(target.documentNumber, { year: '2026', month: '10' })
    const outOfPeriod = run(target.documentNumber, { year: '2025' })
    expect(inPeriod).toContainEqual(target)
    expect(outOfPeriod).toEqual([])
  })

  it('does not mix registers: filter values of one register match nothing in the other', () => {
    const [purchase] = purchases
    if (!purchase) throw new Error('no purchases')
    expect(run('', { operationType: purchase.operationType })).toEqual([])
  })
})

describe('matchesSearchQuery', () => {
  const target = sales.find((d) => d.ksefNumber !== null)
  if (!target) throw new Error('mock data needs a document with a KSeF number')

  it.each([
    ['contractor name', target.contractor.slice(2, 8)],
    ['document number', target.documentNumber],
    ['KSeF number', target.ksefNumber ?? ''],
    ['identifier', target.identifier],
  ])('finds a document by %s', (_label, query) => {
    expect(matchesSearchQuery(target, query)).toBe(true)
  })

  it('ignores case, surrounding spaces and Polish diacritics', () => {
    const document = { ...target, contractor: 'Łódzka Spółdzielnia Żywności' }
    expect(
      matchesSearchQuery(document, '  lodzka spoldzielnia zywnosci '),
    ).toBe(true)
    expect(matchesSearchQuery(document, 'ŁÓDZKA')).toBe(true)
  })

  it('does not match unrelated text or fields that are not searchable', () => {
    expect(matchesSearchQuery(target, 'zzz-brak-wynikow')).toBe(false)
    expect(matchesSearchQuery(target, target.operationType)).toBe(false)
  })

  it('does not fail on a document without a KSeF number', () => {
    expect(matchesSearchQuery({ ...target, ksefNumber: null }, 'xyz')).toBe(
      false,
    )
  })
})
