import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { VatDocument } from '@/domain/vat'
import type { DocumentTagAssignments, DocumentTagId } from '../../types/tags'
import { colors } from '@/theme/tokens'
import { DocumentsEmptyState } from '../DocumentsEmptyState'
import {
  TABLE_COLUMN_COUNT,
  WIDE_DESKTOP,
  desktopOnlyCellSx,
  laptopUpCellSx,
  numericCellSx,
} from '../tableStyles'
import { DocumentTableRow } from './DocumentTableRow'

interface DocumentsTableProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  selectedIds: ReadonlySet<string>
  allSelected: boolean
  someSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  tagAssignments: DocumentTagAssignments
  onRemoveTag: (document: VatDocument, tagId: DocumentTagId) => void
  /** Undefined when there is nothing to reset. */
  onResetFilters?: () => void
}

const NO_TAGS: readonly DocumentTagId[] = []

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
  tagAssignments,
  onRemoveTag,
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
        sx={{
          // tighter horizontal rhythm below the desktop breakpoint
          '& .MuiTableCell-root:not(.MuiTableCell-paddingCheckbox)': {
            px: 1.25,
            [WIDE_DESKTOP]: { px: 2 },
          },
        }}
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
            <TableCell
              sx={{ ...headCellSx, ...numericCellSx, ...laptopUpCellSx }}
            >
              Kwota netto
            </TableCell>
            <TableCell
              sx={{ ...headCellSx, ...numericCellSx, ...laptopUpCellSx }}
            >
              VAT
            </TableCell>
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
                <DocumentsEmptyState onResetFilters={onResetFilters} />
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
                tags={tagAssignments[document.id] ?? NO_TAGS}
                onRemoveTag={onRemoveTag}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
