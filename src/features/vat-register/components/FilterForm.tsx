import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { filterOptions } from '@/mocks/filterOptions'
import { ALL_FILTER_VALUE, FILTER_LABELS } from '../types/filters'
import type { FilterKey, VatFilters } from '../types/filters'

interface FilterFormProps {
  values: VatFilters
  onChange: (key: FilterKey, value: string) => void
}

interface FilterSelectProps extends FilterFormProps {
  filterKey: FilterKey
  capitalize?: boolean
}

function FilterSelect({
  filterKey,
  values,
  onChange,
  capitalize = false,
}: FilterSelectProps) {
  const inputId = `filter-${filterKey}`
  const textTransform = capitalize ? 'capitalize' : 'none'

  return (
    <TextField
      select
      fullWidth
      size="small"
      id={inputId}
      label={FILTER_LABELS[filterKey]}
      value={values[filterKey]}
      onChange={(event) => onChange(filterKey, event.target.value)}
      sx={{ '& .MuiSelect-select': { textTransform } }}
    >
      <MenuItem value={ALL_FILTER_VALUE}>Wszystkie</MenuItem>
      {filterOptions[filterKey].map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ textTransform }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
      <Typography
        component="legend"
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1.5, p: 0 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export function FilterForm({ values, onChange }: FilterFormProps) {
  const shared = { values, onChange }

  return (
    <Stack spacing={3}>
      <FilterGroup title="Okres">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 1.5,
          }}
        >
          <FilterSelect filterKey="year" {...shared} />
          <FilterSelect filterKey="month" capitalize {...shared} />
        </Box>
      </FilterGroup>
      <FilterGroup title="Rodzaj dokumentu">
        <Stack spacing={1.5}>
          <FilterSelect filterKey="operationType" {...shared} />
          <FilterSelect filterKey="jpkCode" {...shared} />
        </Stack>
      </FilterGroup>
      <FilterGroup title="Serie">
        <FilterSelect filterKey="documentSeries" {...shared} />
      </FilterGroup>
    </Stack>
  )
}
