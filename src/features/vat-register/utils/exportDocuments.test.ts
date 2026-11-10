import { describe, expect, it } from 'vitest'
import type { VatDocument } from '@/domain/vat'
import { CSV_BOM } from '@/utils/csv'
import { buildDocumentsCsv, buildExportFilename } from './exportDocuments'

const document: VatDocument = {
  id: 'doc-1',
  contractor: 'Firma "Alfa", Sp. z o.o.',
  nip: '5250000000',
  issueDate: '2026-10-30',
  saleDate: '2026-10-29',
  documentNumber: 'FV/2026/10/0010',
  ksefNumber: null,
  ksefStatus: 'pending',
  identifier: 'SPR-2610-002',
  operationType: 'Sprzedaż krajowa',
  jpkCode: null,
  documentSeries: 'FV',
  netAmount: 1000,
  vatAmount: 230,
  grossAmount: 1230,
  vatBreakdown: [{ rate: 23, netAmount: 1000, vatAmount: 230 }],
}

const lines = (csv: string): string[] => csv.trim().split('\r\n')

describe('buildDocumentsCsv', () => {
  it('writes a BOM, Polish headers and one row per document', () => {
    const csv = buildDocumentsCsv([document, { ...document, id: 'doc-2' }], {})
    const [header, ...rows] = lines(csv)
    expect(csv.startsWith(CSV_BOM)).toBe(true)
    expect(header).toContain('Data sprzedaży')
    expect(header).toContain('Netto 23%')
    expect(rows).toHaveLength(2)
  })

  it('exports fields hidden in the responsive table, formatted consistently', () => {
    const [, row] = lines(
      buildDocumentsCsv([document], { 'doc-1': ['urgent'] }),
    )
    expect(row).toContain('"Firma ""Alfa"", Sp. z o.o."')
    expect(row).toContain('525-000-00-00')
    expect(row).toContain('30.10.2026;29.10.2026')
    expect(row).toContain('Brak potwierdzenia')
    expect(row).toContain('"1000,00";"230,00";"1230,00"')
    expect(row).toContain('Pilne')
  })

  it('keeps rows in the order it was given', () => {
    const second = {
      ...document,
      id: 'doc-2',
      documentNumber: 'FV/2026/10/0009',
    }
    const [, first, last] = lines(buildDocumentsCsv([second, document], {}))
    expect(first).toContain('0009')
    expect(last).toContain('0010')
  })

  it('does not let text fields start a spreadsheet formula', () => {
    const [, row] = lines(
      buildDocumentsCsv([{ ...document, contractor: '=HYPERLINK("x")' }], {}),
    )
    expect(row?.startsWith('"\'=HYPERLINK')).toBe(true)
  })
})

describe('buildExportFilename', () => {
  it('uses an ASCII register slug and the local date', () => {
    const date = new Date(2026, 10, 10, 8, 30)
    expect(buildExportFilename('sales', date)).toBe(
      'rejestr-vat-sprzedazy-2026-11-10.csv',
    )
    expect(buildExportFilename('purchases', date, 'zaznaczone')).toBe(
      'rejestr-vat-zakupow-zaznaczone-2026-11-10.csv',
    )
  })
})
