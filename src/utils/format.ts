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
