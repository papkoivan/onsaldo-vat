import type { VatRate } from '@/domain/vat'

const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  // pl-PL skips grouping for 4-digit numbers by default ("9700,00 zł")
  useGrouping: 'always',
})

const percentFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const formatCurrency = (value: number): string =>
  currencyFormatter.format(value)

/** @param fraction value in range 0..1 */
export const formatPercent = (fraction: number): string =>
  percentFormatter.format(fraction)

const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

/** @param isoDate calendar date in `YYYY-MM-DD` form */
export const formatDate = (isoDate: string): string =>
  dateFormatter.format(new Date(isoDate))

/** Polish NIPs are shown as `XXX-XXX-XX-XX`; foreign VAT IDs are kept as is. */
export const formatNip = (nip: string): string =>
  /^\d{10}$/.test(nip)
    ? `${nip.slice(0, 3)}-${nip.slice(3, 6)}-${nip.slice(6, 8)}-${nip.slice(8)}`
    : nip

export const formatVatRate = (rate: VatRate): string =>
  rate === 'np' ? 'np' : `${rate}%`

const documentForms: Record<Intl.LDMLPluralRule, string> = {
  zero: 'dokumentów',
  one: 'dokument',
  two: 'dokumenty',
  few: 'dokumenty',
  many: 'dokumentów',
  other: 'dokumentu',
}

const pluralRules = new Intl.PluralRules('pl')

export const formatDocumentCount = (count: number): string =>
  `${count} ${documentForms[pluralRules.select(count)]}`

/** Plain amount for spreadsheets: no currency symbol or grouping, comma decimal separator. */
export const formatAmountPlain = (value: number): string =>
  (Math.round(value * 100) / 100).toFixed(2).replace('.', ',')

const dateTimeFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Local date and time of a real moment (unlike `formatDate`, which formats calendar dates in UTC). */
export const formatDateTime = (date: Date): string =>
  dateTimeFormatter.format(date)

/** Local calendar date as `YYYY-MM-DD`. */
export const toLocalIsoDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** "1 dokumentu", "3 dokumentów" — genitive, for phrases like "do 3 dokumentów". */
export const formatDocumentCountGenitive = (count: number): string =>
  count === 1 ? '1 dokumentu' : `${count} dokumentów`
