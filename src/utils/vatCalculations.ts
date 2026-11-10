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

/** Rates listed in the breakdown, in display order, even when their amounts are zero. */
const RATES: readonly VatRate[] = [23, 'np']

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

/** Sums document breakdowns per VAT rate; every rate is listed, even when zero. */
export function aggregateVatBreakdown(
  documents: readonly VatDocument[],
): VatBreakdownItem[] {
  const lines = documents.flatMap((document) => document.vatBreakdown)

  return RATES.map((rate) => {
    const ofRate = lines.filter((line) => line.rate === rate)
    return {
      rate,
      netAmount: sumMoney(ofRate.map((line) => line.netAmount)),
      vatAmount: sumMoney(ofRate.map((line) => line.vatAmount)),
    }
  })
}

export function buildBreakdownRows(
  items: readonly VatBreakdownItem[],
): VatBreakdownRow[] {
  const { vatAmount: totalVat } = calculateTotals(items)
  return items.map((item) => ({
    ...item,
    // corrections can make a single rate negative; keep the bar within 0..1
    share: totalVat > 0 ? Math.max(0, item.vatAmount / totalVat) : 0,
  }))
}
