import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import type { VatDocument } from '@/domain/vat'
import type { DocumentTagAssignments, DocumentTagId } from '../../types/tags'
import { DocumentTableRow } from './DocumentTableRow'
import { DocumentsTableHead } from './DocumentsTableHead'
import { tableContainerSx, tableSx } from './tableLayout'

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
}

const NO_TAGS: readonly DocumentTagId[] = []

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
}: DocumentsTableProps) {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small" aria-label="Dokumenty rejestru VAT" sx={tableSx}>
        <DocumentsTableHead
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
        <TableBody>
          {documents.map((document) => (
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
