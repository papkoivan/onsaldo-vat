import type { RegisterType } from '@/domain/vat'
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

export type PeriodFilterKey = 'year' | 'month'
export type RegisterFilterKey = Exclude<FilterKey, PeriodFilterKey>

export const periodFilterOptions: Record<
  PeriodFilterKey,
  readonly FilterOption[]
> = {
  year: simpleOptions(['2024', '2025', '2026']),
  month: months.map((label, index) => ({
    value: String(index + 1),
    label,
  })),
}

const registerFilterOptions: Record<
  RegisterType,
  Record<RegisterFilterKey, readonly FilterOption[]>
> = {
  sales: {
    operationType: simpleOptions([
      'Sprzedaż krajowa',
      'Sprzedaż wewnątrzwspólnotowa',
      'Eksport towarów',
      'Korekta sprzedaży',
    ]),
    jpkCode: simpleOptions([
      'GTU_01',
      'GTU_05',
      'GTU_12',
      'GTU_13',
      'SW',
      'EE',
    ]),
    documentSeries: simpleOptions(['FV', 'KOR', 'FP']),
  },
  purchases: {
    operationType: simpleOptions([
      'Zakup krajowy',
      'Wewnątrzwspólnotowe nabycie towarów',
      'Import towarów',
      'Import usług',
      'Korekta zakupu',
    ]),
    jpkCode: simpleOptions(['MPP', 'IMP', 'MK', 'WEW']),
    documentSeries: simpleOptions(['FZ', 'KZ', 'WNT', 'IMP']),
  },
}

export const getFilterOptions = (
  register: RegisterType,
): Record<FilterKey, readonly FilterOption[]> => ({
  ...periodFilterOptions,
  ...registerFilterOptions[register],
})
