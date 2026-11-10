import { Fragment } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { formatCurrency, formatDate } from '@/utils/format'
import type { DocumentTagId } from '../../types/tags'
import { DocumentDetails } from '../DocumentDetails'
import { DocumentTagChips } from '../DocumentTagChips'
import { KsefStatusChip } from '../KsefStatusChip'
import {
  TABLE_COLUMN_COUNT,
  WIDE_DESKTOP,
  desktopOnlyCellSx,
  laptopUpCellSx,
  numericCellSx,
  truncatedTextSx,
} from '../tableStyles'

interface DocumentTableRowProps {
  document: VatDocument
  expanded: boolean
  selected: boolean
  onToggleExpand: (id: string) => void
  onToggleSelect: (id: string) => void
  tags: readonly DocumentTagId[]
  onRemoveTag: (document: VatDocument, tagId: DocumentTagId) => void
}

export function DocumentTableRow({
  document,
  expanded,
  selected,
  onToggleExpand,
  onToggleSelect,
  tags,
  onRemoveTag,
}: DocumentTableRowProps) {
  const detailsId = `document-details-${document.id}`
  const expandLabel = `${expanded ? 'Zwiń' : 'Rozwiń'} szczegóły dokumentu ${document.documentNumber}`
  const borderBottom = expanded ? 'none' : undefined

  return (
    <Fragment>
      <TableRow
        hover
        selected={selected}
        sx={{
          height: 52,
          '& > td': { borderBottom },
          '&.MuiTableRow-hover:hover': { backgroundColor: colors.surfaceMuted },
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: colors.primaryLight,
          },
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={() => onToggleSelect(document.id)}
            slotProps={{
              input: {
                'aria-label': `Zaznacz dokument ${document.documentNumber}`,
              },
            }}
          />
        </TableCell>
        <TableCell sx={{ maxWidth: { xs: 200, lg: 260 }, fontWeight: 600 }}>
          <Box sx={truncatedTextSx} title={document.contractor}>
            {document.contractor}
          </Box>
          {tags.length > 0 && (
            <Box sx={{ mt: 0.5, fontWeight: 400 }}>
              <DocumentTagChips tagIds={tags} />
            </Box>
          )}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {formatDate(document.issueDate)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {document.documentNumber}
        </TableCell>
        <TableCell
          sx={{
            ...desktopOnlyCellSx,
            maxWidth: 240,
            [WIDE_DESKTOP]: { maxWidth: 300 },
          }}
        >
          {document.ksefNumber ? (
            <Box sx={truncatedTextSx} title={document.ksefNumber}>
              {document.ksefNumber}
            </Box>
          ) : (
            <KsefStatusChip status={document.ksefStatus} />
          )}
        </TableCell>
        <TableCell sx={{ ...desktopOnlyCellSx, whiteSpace: 'nowrap' }}>
          {document.identifier}
        </TableCell>
        <TableCell sx={{ ...numericCellSx, ...laptopUpCellSx }}>
          {formatCurrency(document.netAmount)}
        </TableCell>
        <TableCell sx={{ ...numericCellSx, ...laptopUpCellSx }}>
          {formatCurrency(document.vatAmount)}
        </TableCell>
        <TableCell sx={{ ...numericCellSx, fontWeight: 600 }}>
          {formatCurrency(document.grossAmount)}
        </TableCell>
        <TableCell padding="checkbox" align="right">
          <Tooltip title={expanded ? 'Zwiń szczegóły' : 'Rozwiń szczegóły'}>
            <IconButton
              aria-label={expandLabel}
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => onToggleExpand(document.id)}
            >
              <ExpandMore
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 150ms ease',
                }}
              />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={TABLE_COLUMN_COUNT}
          sx={{ p: 0, borderBottom: expanded ? undefined : 'none' }}
        >
          <Collapse in={expanded} timeout="auto">
            <DocumentDetails
              document={document}
              id={detailsId}
              tags={tags}
              onRemoveTag={(tagId) => onRemoveTag(document, tagId)}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
