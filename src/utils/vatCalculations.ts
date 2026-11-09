import type {
  VatBreakdownItem,
  VatBreakdownRow,
  VatDocument,
  VatRate,
  VatTotals,
} from '@/domain/vat'

export const roundMoney = (value: number): number =>
  Math.round(value * 100) / 100

/** Rates that are always listed in the breakdown, in display order. */
const STANDARD_RATES: readonly VatRate[] = [23, 8, 5, 0, 'np']

const rateOrder = (rate: VatRate): number => {
  const index = STANDARD_RATES.indexOf(rate)
  if (index !== -1) return index
  return STANDARD_RATES.length + (rate === 'np' ? 0 : -rate)
}

export function calculateTotals(items: readonly VatBreakdownItem[]): VatTotals {
  const netAmount = roundMoney(
    items.reduce((sum, item) => sum + item.netAmount, 0),
  )
  const vatAmount = roundMoney(
    items.reduce((sum, item) => sum + item.vatAmount, 0),
  )
  return {
    netAmount,
    vatAmount,
    grossAmount: roundMoney(netAmount + vatAmount),
  }
}

export function calculateDocumentTotals(
  documents: readonly VatDocument[],
): VatTotals {
  const sum = (pick: (document: VatDocument) => number): number =>
    roundMoney(documents.reduce((total, document) => total + pick(document), 0))

  return {
    netAmount: sum((document) => document.netAmount),
    vatAmount: sum((document) => document.vatAmount),
    grossAmount: sum((document) => document.grossAmount),
  }
}

/** Sums document breakdowns per VAT rate; standard rates are listed even when zero. */
export function aggregateVatBreakdown(
  documents: readonly VatDocument[],
): VatBreakdownItem[] {
  const byRate = new Map<VatRate, VatBreakdownItem>(
    STANDARD_RATES.map((rate) => [rate, { rate, netAmount: 0, vatAmount: 0 }]),
  )

  for (const { vatBreakdown } of documents) {
    for (const item of vatBreakdown) {
      const current = byRate.get(item.rate) ?? {
        rate: item.rate,
        netAmount: 0,
        vatAmount: 0,
      }
      byRate.set(item.rate, {
        rate: item.rate,
        netAmount: roundMoney(current.netAmount + item.netAmount),
        vatAmount: roundMoney(current.vatAmount + item.vatAmount),
      })
    }
  }

  return [...byRate.values()].sort(
    (a, b) => rateOrder(a.rate) - rateOrder(b.rate),
  )
}

export function buildBreakdownRows(
  items: readonly VatBreakdownItem[],
): VatBreakdownRow[] {
  const { netAmount: totalNet } = calculateTotals(items)
  return items.map((item) => ({
    ...item,
    // corrections can make a single rate negative; keep the bar within 0..1
    share: totalNet > 0 ? Math.max(0, item.netAmount / totalNet) : 0,
  }))
}
