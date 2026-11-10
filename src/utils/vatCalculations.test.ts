import { describe, expect, it } from 'vitest'
import type { VatDocument } from '@/domain/vat'
import {
  aggregateVatBreakdown,
  buildBreakdownRows,
  calculateDocumentTotals,
  calculateTotals,
  calculateVatAmount,
  roundMoney,
  sumMoney,
} from './vatCalculations'

const doc = (
  breakdown: VatDocument['vatBreakdown'],
  overrides: Partial<VatDocument> = {},
): VatDocument => {
  const totals = calculateTotals(breakdown)
  return {
    id: 'd',
    contractor: 'Alfa',
    nip: '5250000000',
    issueDate: '2026-10-01',
    saleDate: '2026-10-01',
    documentNumber: 'FV/1',
    ksefNumber: null,
    ksefStatus: 'pending',
    identifier: 'SPR-1',
    operationType: 'Sprzedaż krajowa',
    jpkCode: null,
    documentSeries: 'FV',
    ...totals,
    vatBreakdown: [...breakdown],
    ...overrides,
  }
}

describe('money arithmetic', () => {
  it('sums without floating-point noise', () => {
    expect(0.1 + 0.2).not.toBe(0.3)
    expect(sumMoney([0.1, 0.2])).toBe(0.3)
    expect(sumMoney(Array.from({ length: 10 }, () => 0.1))).toBe(1)
  })

  it('rounds halves away from zero, symmetrically for corrections', () => {
    expect(roundMoney(2.675)).toBe(2.68)
    expect(roundMoney(-2.675)).toBe(-2.68)
  })

  it('computes VAT on whole grosze, rounding half up', () => {
    expect(calculateVatAmount(8450.5, 23)).toBe(1943.62)
    expect(calculateVatAmount(0.5, 23)).toBe(0.12)
    expect(calculateVatAmount(100, 8)).toBe(8)
  })

  it('gives negative VAT for corrections and none for np / 0%', () => {
    expect(calculateVatAmount(-1500, 23)).toBe(-345)
    expect(calculateVatAmount(-0.5, 23)).toBe(-0.12)
    expect(calculateVatAmount(1000, 'np')).toBe(0)
    expect(calculateVatAmount(1000, 0)).toBe(0)
  })
})

describe('calculateTotals', () => {
  it('keeps net + VAT = gross', () => {
    const totals = calculateTotals([
      { rate: 23, netAmount: 100.1, vatAmount: 23.02 },
      { rate: 8, netAmount: 200.2, vatAmount: 16.02 },
    ])
    expect(totals).toEqual({
      netAmount: 300.3,
      vatAmount: 39.04,
      grossAmount: 339.34,
    })
  })
})

describe('calculateDocumentTotals', () => {
  it('is zero for no documents', () => {
    expect(calculateDocumentTotals([])).toEqual({
      netAmount: 0,
      vatAmount: 0,
      grossAmount: 0,
    })
  })

  it('sums documents including negative corrections', () => {
    const totals = calculateDocumentTotals([
      doc([{ rate: 23, netAmount: 1000, vatAmount: 230 }]),
      doc([{ rate: 23, netAmount: -250.1, vatAmount: -57.52 }]),
    ])
    expect(totals).toEqual({
      netAmount: 749.9,
      vatAmount: 172.48,
      grossAmount: 922.38,
    })
  })
})

describe('aggregateVatBreakdown', () => {
  it('lists the standard rates in order even when they are zero', () => {
    expect(aggregateVatBreakdown([]).map((item) => item.rate)).toEqual([
      23,
      8,
      5,
      0,
      'np',
    ])
  })

  it('sums per rate across documents', () => {
    const items = aggregateVatBreakdown([
      doc([
        { rate: 23, netAmount: 100, vatAmount: 23 },
        { rate: 8, netAmount: 50, vatAmount: 4 },
      ]),
      doc([{ rate: 23, netAmount: 0.3, vatAmount: 0.07 }]),
    ])
    expect(items.find((item) => item.rate === 23)).toEqual({
      rate: 23,
      netAmount: 100.3,
      vatAmount: 23.07,
    })
    expect(items.find((item) => item.rate === 8)?.netAmount).toBe(50)
  })

  it('adds non-standard rates after the standard ones', () => {
    const rates = aggregateVatBreakdown([
      doc([{ rate: 7, netAmount: 10, vatAmount: 0.7 }]),
    ]).map((item) => item.rate)
    expect(rates.at(-1)).toBe(7)
  })

  it('matches the document totals', () => {
    const documents = [
      doc([
        { rate: 23, netAmount: 123.45, vatAmount: 28.39 },
        { rate: 'np', netAmount: 10, vatAmount: 0 },
      ]),
      doc([{ rate: 5, netAmount: 99.99, vatAmount: 5 }]),
    ]
    expect(calculateTotals(aggregateVatBreakdown(documents))).toEqual(
      calculateDocumentTotals(documents),
    )
  })
})

describe('buildBreakdownRows', () => {
  it('computes shares of the net total and clamps negative rates to zero', () => {
    const rows = buildBreakdownRows([
      { rate: 23, netAmount: 300, vatAmount: 69 },
      { rate: 8, netAmount: 100, vatAmount: 8 },
      { rate: 5, netAmount: -50, vatAmount: -2.5 },
    ])
    expect(rows.map((row) => row.share)).toEqual([300 / 350, 100 / 350, 0])
  })

  it('has zero shares when the net total is not positive', () => {
    expect(
      buildBreakdownRows([{ rate: 23, netAmount: 0, vatAmount: 0 }])[0]?.share,
    ).toBe(0)
  })
})
