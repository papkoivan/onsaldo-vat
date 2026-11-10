import { Fragment } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { DocumentDetails } from '../DocumentDetails'
import { TABLE_COLUMN_COUNT } from '../tableStyles'
import type { TableColumn } from './columns'

interface DocumentTableRowProps {
  document: VatDocument
  columns: readonly TableColumn[]
  expanded: boolean
  onToggleExpand: (id: string) => void
}

export function DocumentTableRow({
  document,
  columns,
  expanded,
  onToggleExpand,
}: DocumentTableRowProps) {
  const detailsId = `document-details-${document.id}`
  const expandLabel = `${expanded ? 'Zwiń' : 'Rozwiń'} szczegóły dokumentu ${document.documentNumber}`
  const borderBottom = expanded ? 'none' : undefined

  return (
    <Fragment>
      <TableRow
        hover
        sx={{
          height: 52,
          '& > td': { borderBottom },
          '&.MuiTableRow-hover:hover': { backgroundColor: colors.surfaceMuted },
        }}
      >
        {columns.map(({ key, cellSx, render }) => (
          <TableCell key={key} sx={cellSx}>
            {render(document)}
          </TableCell>
        ))}
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
            <DocumentDetails document={document} id={detailsId} />
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
