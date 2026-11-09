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
