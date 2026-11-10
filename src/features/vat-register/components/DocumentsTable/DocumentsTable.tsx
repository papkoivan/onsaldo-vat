import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import type { VatDocument } from '@/domain/vat'
import type { DocumentSort, SortKey } from '../../types/sort'
import { DocumentTableRow } from './DocumentTableRow'
import { DocumentsTableHead } from './DocumentsTableHead'
import { tableContainerSx, tableSx } from './tableLayout'

interface DocumentsTableProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
}

export function DocumentsTable({
  documents,
  expandedIds,
  onToggleExpand,
  sort,
  onSortChange,
}: DocumentsTableProps) {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small" aria-label="Dokumenty rejestru VAT" sx={tableSx}>
        <DocumentsTableHead sort={sort} onSortChange={onSortChange} />
        <TableBody>
          {documents.map((document) => (
            <DocumentTableRow
              key={document.id}
              document={document}
              expanded={expandedIds.has(document.id)}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
