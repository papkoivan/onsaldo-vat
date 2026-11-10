import type {
  VatBreakdownItem,
  VatBreakdownRow,
  VatDocument,
  VatRate,
  VatTotals,
} from '@/domain/vat'

// Money is summed as integer grosze so that float noise (0.1 + 0.2) never reaches the UI.
// Halves round away from zero, which keeps corrections (negative amounts) symmetric.
const roundHalfAwayFromZero = (value: number): number =>
  Math.sign(value) * Math.round(Math.abs(value))

const toCents = (amount: number): number => roundHalfAwayFromZero(amount * 100)

const fromCents = (cents: number): number => cents / 100

export const roundMoney = (amount: number): number => fromCents(toCents(amount))

export const sumMoney = (amounts: Iterable<number>): number => {
  let cents = 0
  for (const amount of amounts) cents += toCents(amount)
  return fromCents(cents)
}

/** VAT for a net amount at a rate in percent, computed on integer grosze. `np` carries no VAT. */
export const calculateVatAmount = (netAmount: number, rate: VatRate): number =>
  rate === 'np'
    ? 0
    : fromCents(roundHalfAwayFromZero((toCents(netAmount) * rate) / 100))

/** Rates that are always listed in the breakdown, in display order. */
const STANDARD_RATES: readonly VatRate[] = [23, 8, 5, 0, 'np']

const rateOrder = (rate: VatRate): number => {
  const index = STANDARD_RATES.indexOf(rate)
  if (index !== -1) return index
  // non-standard rates follow the standard ones, highest first ('np' is always standard)
  return STANDARD_RATES.length + (typeof rate === 'number' ? 100 - rate : 0)
}

export function calculateTotals(items: readonly VatBreakdownItem[]): VatTotals {
  const netAmount = sumMoney(items.map((item) => item.netAmount))
  const vatAmount = sumMoney(items.map((item) => item.vatAmount))
  return {
    netAmount,
    vatAmount,
    grossAmount: sumMoney([netAmount, vatAmount]),
  }
}

export function calculateDocumentTotals(
  documents: readonly VatDocument[],
): VatTotals {
  return {
    netAmount: sumMoney(documents.map((document) => document.netAmount)),
    vatAmount: sumMoney(documents.map((document) => document.vatAmount)),
    grossAmount: sumMoney(documents.map((document) => document.grossAmount)),
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
        netAmount: sumMoney([current.netAmount, item.netAmount]),
        vatAmount: sumMoney([current.vatAmount, item.vatAmount]),
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
