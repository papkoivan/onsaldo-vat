import CloseOutlined from '@mui/icons-material/CloseOutlined'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { colors } from '@/theme/tokens'
import type { ActiveFilter, FilterKey } from '../types/filters'

interface ActiveFiltersProps {
  filters: readonly ActiveFilter[]
  onRemove: (key: FilterKey) => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={1}
      role="group"
      aria-label="Aktywne filtry"
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          variant="outlined"
          onDelete={() => onRemove(filter.key)}
          deleteIcon={
            <CloseOutlined
              titleAccess={`Usuń filtr: ${filter.label}`}
              sx={{ fontSize: '16px !important' }}
            />
          }
          label={
            <>
              <span>{filter.label}:</span> <strong>{filter.valueLabel}</strong>
            </>
          }
          sx={{
            height: 32,
            backgroundColor: 'background.paper',
            borderColor: colors.border,
            '& .MuiChip-label': { color: 'text.secondary' },
            '& strong': { color: 'text.primary', fontWeight: 600 },
          }}
        />
      ))}
      <Button size="small" onClick={onClearAll}>
        Wyczyść filtry
      </Button>
    </Stack>
  )
}
