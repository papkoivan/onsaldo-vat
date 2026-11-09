import { filterOptions } from '@/mocks/filterOptions'
import { ALL_FILTER_VALUE, FILTER_LABELS } from '../types/filters'
import type { ActiveFilter, FilterKey, VatFilters } from '../types/filters'

const filterKeys = Object.keys(FILTER_LABELS) as FilterKey[]

export function getActiveFilters(filters: VatFilters): ActiveFilter[] {
  return filterKeys
    .filter((key) => filters[key] !== ALL_FILTER_VALUE)
    .map((key) => ({
      key,
      label: FILTER_LABELS[key],
      valueLabel:
        filterOptions[key].find((option) => option.value === filters[key])
          ?.label ?? filters[key],
    }))
}
