import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { colors } from '@/theme/tokens'
import {
  desktopOnlyCellSx,
  laptopUpCellSx,
  numericCellSx,
} from '../tableStyles'

interface DocumentsTableHeadProps {
  allSelected: boolean
  someSelected: boolean
  disabled?: boolean
  onToggleSelectAll: () => void
}

const headCellSx = {
  py: 1,
  fontSize: '0.8125rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: 'text.secondary',
  backgroundColor: colors.surfaceMuted,
} as const

export function DocumentsTableHead({
  allSelected,
  someSelected,
  disabled = false,
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
        <TableCell sx={headCellSx}>Kontrahent</TableCell>
        <TableCell sx={headCellSx}>Data</TableCell>
        <TableCell sx={headCellSx}>Numer dokumentu</TableCell>
        <TableCell sx={{ ...headCellSx, ...desktopOnlyCellSx }}>
          Numer KSeF
        </TableCell>
        <TableCell sx={{ ...headCellSx, ...desktopOnlyCellSx }}>
          Identyfikator
        </TableCell>
        <TableCell sx={{ ...headCellSx, ...numericCellSx, ...laptopUpCellSx }}>
          Kwota netto
        </TableCell>
        <TableCell sx={{ ...headCellSx, ...numericCellSx, ...laptopUpCellSx }}>
          VAT
        </TableCell>
        <TableCell sx={{ ...headCellSx, ...numericCellSx }}>
          Kwota brutto
        </TableCell>
        <TableCell padding="checkbox" sx={headCellSx} aria-label="Szczegóły" />
      </TableRow>
    </TableHead>
  )
}
