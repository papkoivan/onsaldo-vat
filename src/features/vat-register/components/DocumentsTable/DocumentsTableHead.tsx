import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { colors } from '@/theme/tokens'
import { visuallyHiddenSx } from '@/utils/a11y'
import type { DocumentSort, SortKey } from '../../types/sort'
import { desktopOnlyCellSx } from '../tableStyles'

interface DocumentsTableHeadProps {
  disabled?: boolean
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
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

// Order matches the table body. Hidden columns stay reachable through the expanded row.
const columns: readonly SortableColumn[] = [
  { key: 'contractor', label: 'Kontrahent' },
  { key: 'issueDate', label: 'Data' },
  { key: 'documentNumber', label: 'Numer dokumentu' },
  { key: 'ksefNumber', label: 'Numer KSeF', sx: desktopOnlyCellSx },
  { key: 'identifier', label: 'Identyfikator', sx: desktopOnlyCellSx },
]

const DIRECTION_TEXT = {
  asc: 'posortowano rosnąco',
  desc: 'posortowano malejąco',
} as const

export function DocumentsTableHead({
  disabled = false,
  sort,
  onSortChange,
}: DocumentsTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
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
