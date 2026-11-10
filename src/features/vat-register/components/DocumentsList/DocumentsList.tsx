import Box from '@mui/material/Box'
import type { VatDocument } from '@/domain/vat'
import type { DocumentTagAssignments, DocumentTagId } from '../../types/tags'
import { DocumentCard } from './DocumentCard'

interface DocumentsListProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  selectedIds: ReadonlySet<string>
  onToggleSelect: (id: string) => void
  tagAssignments: DocumentTagAssignments
  onRemoveTag: (document: VatDocument, tagId: DocumentTagId) => void
}

const NO_TAGS: readonly DocumentTagId[] = []

export function DocumentsList({
  documents,
  expandedIds,
  onToggleExpand,
  selectedIds,
  onToggleSelect,
  tagAssignments,
  onRemoveTag,
}: DocumentsListProps) {
  return (
    <Box
      component="ul"
      aria-label="Dokumenty rejestru VAT"
      sx={{
        display: 'grid',
        gap: 1.5,
        m: 0,
        p: 0,
        listStyle: 'none',
      }}
    >
      {documents.map((document) => (
        <DocumentCard
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
    </Box>
  )
}
