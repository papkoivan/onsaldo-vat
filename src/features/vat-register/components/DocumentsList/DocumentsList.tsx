import Box from '@mui/material/Box'
import type { VatDocument } from '@/domain/vat'
import { DocumentCard } from './DocumentCard'

interface DocumentsListProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
}

export function DocumentsList({
  documents,
  expandedIds,
  onToggleExpand,
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
          onToggleExpand={onToggleExpand}
        />
      ))}
    </Box>
  )
}
