import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { DocumentTableRow } from './DocumentTableRow'
import {
  TABLE_COLUMN_COUNT,
  desktopOnlyCellSx,
  numericCellSx,
} from './tableStyles'

interface DocumentsTableProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  selectedIds: ReadonlySet<string>
  allSelected: boolean
  someSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  /** Undefined when there is nothing to reset. */
  onResetFilters?: () => void
}

const headCellSx = {
  py: 1,
  fontSize: '0.8125rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: 'text.secondary',
  backgroundColor: colors.surfaceMuted,
} as const

export function DocumentsTable({
  documents,
  expandedIds,
  onToggleExpand,
  selectedIds,
  allSelected,
  someSelected,
  onToggleSelect,
  onToggleSelectAll,
  onResetFilters,
}: DocumentsTableProps) {
  return (
    <TableContainer
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        backgroundColor: 'background.paper',
      }}
    >
      <Table
        size="small"
        aria-label="Dokumenty rejestru VAT"
        sx={{ minWidth: 760 }}
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={headCellSx}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                disabled={documents.length === 0}
                onChange={onToggleSelectAll}
                slotProps={{
                  input: {
                    'aria-label': 'Zaznacz wszystkie widoczne dokumenty',
                  },
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
            <TableCell sx={{ ...headCellSx, ...numericCellSx }}>
              Kwota netto
            </TableCell>
            <TableCell sx={{ ...headCellSx, ...numericCellSx }}>VAT</TableCell>
            <TableCell sx={{ ...headCellSx, ...numericCellSx }}>
              Kwota brutto
            </TableCell>
            <TableCell
              padding="checkbox"
              sx={headCellSx}
              aria-label="Szczegóły"
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_COLUMN_COUNT} sx={{ borderBottom: 0 }}>
                <Box
                  role="status"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    py: 6,
                    textAlign: 'center',
                  }}
                >
                  <SearchOffOutlined
                    aria-hidden
                    sx={{ fontSize: 40, color: 'text.secondary' }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>
                    Brak dokumentów do wyświetlenia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Żaden dokument nie spełnia wybranych kryteriów wyszukiwania
                    i filtrów.
                  </Typography>
                  {onResetFilters && (
                    <Button
                      variant="outlined"
                      onClick={onResetFilters}
                      sx={{ mt: 1 }}
                    >
                      Wyczyść wyszukiwanie i filtry
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <DocumentTableRow
                key={document.id}
                document={document}
                expanded={expandedIds.has(document.id)}
                selected={selectedIds.has(document.id)}
                onToggleExpand={onToggleExpand}
                onToggleSelect={onToggleSelect}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
