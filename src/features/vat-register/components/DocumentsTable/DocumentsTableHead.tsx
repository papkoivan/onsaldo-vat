import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { colors } from '@/theme/tokens'
import { visuallyHiddenSx } from '@/utils/a11y'
import type { DocumentSort, SortKey } from '../../types/sort'
import {
  desktopOnlyCellSx,
  laptopUpCellSx,
  numericCellSx,
} from '../tableStyles'

interface DocumentsTableHeadProps {
  allSelected: boolean
  someSelected: boolean
  disabled?: boolean
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
  onToggleSelectAll: () => void
}

interface SortableColumn {
  key: SortKey
  label: string
  sx?: object
}

const headCellSx = {
  py: 1,
  fontSize: '0.8125rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: 'text.secondary',
  backgroundColor: colors.surfaceMuted,
} as const

const numericHeadSx = { ...numericCellSx, ...laptopUpCellSx }

// Order matches the table body. Hidden columns stay reachable through the expanded row.
const columns: readonly SortableColumn[] = [
  { key: 'contractor', label: 'Kontrahent' },
  { key: 'issueDate', label: 'Data' },
  { key: 'documentNumber', label: 'Numer dokumentu' },
  { key: 'ksefNumber', label: 'Numer KSeF', sx: desktopOnlyCellSx },
  { key: 'identifier', label: 'Identyfikator', sx: desktopOnlyCellSx },
  { key: 'netAmount', label: 'Kwota netto', sx: numericHeadSx },
  { key: 'vatAmount', label: 'VAT', sx: numericHeadSx },
  { key: 'grossAmount', label: 'Kwota brutto', sx: numericCellSx },
]

const DIRECTION_TEXT = {
  asc: 'posortowano rosnąco',
  desc: 'posortowano malejąco',
} as const

export function DocumentsTableHead({
  allSelected,
  someSelected,
  disabled = false,
  sort,
  onSortChange,
  onToggleSelectAll,
}: DocumentsTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={headCellSx}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            disabled={disabled}
            onChange={onToggleSelectAll}
            slotProps={{
              input: { 'aria-label': 'Zaznacz wszystkie widoczne dokumenty' },
            }}
          />
        </TableCell>
        {columns.map(({ key, label, sx }) => {
          const active = sort.key === key
          return (
            <TableCell
              key={key}
              sortDirection={active ? sort.direction : false}
              sx={{ ...headCellSx, ...sx }}
            >
              <TableSortLabel
                active={active}
                direction={active ? sort.direction : 'asc'}
                disabled={disabled}
                onClick={() => onSortChange(key)}
              >
                {label}
                {active && (
                  <Box component="span" sx={visuallyHiddenSx}>
                    , {DIRECTION_TEXT[sort.direction]}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
          )
        })}
        <TableCell padding="checkbox" sx={headCellSx}>
          <Box component="span" sx={visuallyHiddenSx}>
            Szczegóły
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}
