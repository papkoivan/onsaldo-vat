export const ALL_FILTER_VALUE = 'all'

export interface VatFilters {
  year: string
  month: string
  operationType: string
  jpkCode: string
  documentSeries: string
}

export type FilterKey = keyof VatFilters

export interface FilterOption {
  value: string
  label: string
}

export interface ActiveFilter {
  key: FilterKey
  label: string
  valueLabel: string
}

export const FILTER_LABELS: Record<FilterKey, string> = {
  year: 'Rok',
  month: 'Miesiąc',
  operationType: 'Rodzaj operacji',
  jpkCode: 'Kod JPK V7',
  documentSeries: 'Serie dokumentów',
}

export const EMPTY_FILTERS: VatFilters = {
  year: ALL_FILTER_VALUE,
  month: ALL_FILTER_VALUE,
  operationType: ALL_FILTER_VALUE,
  jpkCode: ALL_FILTER_VALUE,
  documentSeries: ALL_FILTER_VALUE,
}
