import type { RegisterType, VatDocument, VatRate } from '@/domain/vat'
import { buildCsv, neutralizeFormula } from '@/utils/csv'
import {
  formatAmountPlain,
  formatDate,
  formatNip,
  formatVatRate,
  toLocalIsoDate,
} from '@/utils/format'
import { aggregateVatBreakdown } from '@/utils/vatCalculations'
import type { DocumentTagAssignments } from '../types/tags'
import { KSEF_STATUS_LABELS } from './ksefStatus'
import { REGISTER_FILE_SLUGS } from './registers'
import { getTag } from './tags'

export const CSV_MIME_TYPE = 'text/csv;charset=utf-8'

const BASE_HEADERS = [
  'Kontrahent',
  'NIP',
  'Data wystawienia',
  'Data sprzedaży',
  'Numer dokumentu',
  'Numer KSeF',
  'Status KSeF',
  'Identyfikator',
  'Rodzaj operacji',
  'Kod JPK V7',
  'Seria dokumentu',
  'Kwota netto',
  'Kwota VAT',
  'Kwota brutto',
  'Oznaczenia (lokalne)',
] as const

const amountOfRate = (
  document: VatDocument,
  rate: VatRate,
  pick: 'netAmount' | 'vatAmount',
): number =>
  document.vatBreakdown
    .filter((item) => item.rate === rate)
    .reduce((sum, item) => sum + item[pick], 0)

/** One row per document in the given order, with the per-rate VAT breakdown in trailing columns. */
export function buildDocumentsCsv(
  documents: readonly VatDocument[],
  tags: DocumentTagAssignments,
): string {
  const rates = aggregateVatBreakdown(documents).map((item) => item.rate)

  const header = [
    ...BASE_HEADERS,
    ...rates.flatMap((rate) => [
      `Netto ${formatVatRate(rate)}`,
      `VAT ${formatVatRate(rate)}`,
    ]),
  ]

  const rows = documents.map((document) => [
    neutralizeFormula(document.contractor),
    formatNip(document.nip),
    formatDate(document.issueDate),
    formatDate(document.saleDate),
    neutralizeFormula(document.documentNumber),
    document.ksefNumber ?? '',
    KSEF_STATUS_LABELS[document.ksefStatus],
    neutralizeFormula(document.identifier),
    neutralizeFormula(document.operationType),
    document.jpkCode ?? '',
    neutralizeFormula(document.documentSeries),
    formatAmountPlain(document.netAmount),
    formatAmountPlain(document.vatAmount),
    formatAmountPlain(document.grossAmount),
    (tags[document.id] ?? []).map((id) => getTag(id).label).join(', '),
    ...rates.flatMap((rate) => [
      formatAmountPlain(amountOfRate(document, rate, 'netAmount')),
      formatAmountPlain(amountOfRate(document, rate, 'vatAmount')),
    ]),
  ])

  return buildCsv([header, ...rows])
}

export function buildExportFilename(
  register: RegisterType,
  date: Date,
  scope?: string,
): string {
  const parts = [REGISTER_FILE_SLUGS[register], scope, toLocalIsoDate(date)]
  return `${parts.filter(Boolean).join('-')}.csv`
}
