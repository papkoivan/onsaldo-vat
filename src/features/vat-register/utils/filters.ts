import { periodFilterOptions } from '@/mocks/filterOptions'
import { ALL_FILTER_VALUE, FILTER_LABELS } from '../types/filters'
import type {
  ActiveFilter,
  FilterKey,
  FilterOption,
  VatFilters,
} from '../types/filters'

// Only period values differ from their label; other filters show the raw value.
const labelledOptions: Partial<Record<FilterKey, readonly FilterOption[]>> =
  periodFilterOptions

const filterKeys = Object.keys(FILTER_LABELS) as FilterKey[]

export function getActiveFilters(filters: VatFilters): ActiveFilter[] {
  return filterKeys
    .filter((key) => filters[key] !== ALL_FILTER_VALUE)
    .map((key) => ({
      key,
      label: FILTER_LABELS[key],
      valueLabel:
        labelledOptions[key]?.find((option) => option.value === filters[key])
          ?.label ?? filters[key],
    }))
}
