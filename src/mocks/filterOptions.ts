import type {
  FilterKey,
  FilterOption,
} from '@/features/vat-register/types/filters'

const months = [
  'styczeń',
  'luty',
  'marzec',
  'kwiecień',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpień',
  'wrzesień',
  'październik',
  'listopad',
  'grudzień',
]

const simpleOptions = (values: readonly string[]): FilterOption[] =>
  values.map((value) => ({ value, label: value }))

export const filterOptions: Record<FilterKey, readonly FilterOption[]> = {
  year: simpleOptions(['2024', '2025', '2026']),
  month: months.map((label, index) => ({
    value: String(index + 1),
    label,
  })),
  operationType: simpleOptions([
    'Sprzedaż krajowa',
    'Sprzedaż wewnątrzwspólnotowa',
    'Eksport towarów',
    'Korekta sprzedaży',
  ]),
  jpkCode: simpleOptions(['GTU_01', 'GTU_05', 'GTU_12', 'GTU_13', 'SW', 'EE']),
  documentSeries: simpleOptions(['FV', 'KOR', 'FP']),
}

export const demoDocumentCount = 14
