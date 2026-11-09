import Box from '@mui/material/Box'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { DocumentsEmptyState } from '../DocumentsEmptyState'
import { DocumentCard } from './DocumentCard'

interface DocumentsListProps {
  documents: readonly VatDocument[]
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  selectedIds: ReadonlySet<string>
  onToggleSelect: (id: string) => void
  /** Undefined when there is nothing to reset. */
  onResetFilters?: () => void
}

export function DocumentsList({
  documents,
  expandedIds,
  onToggleExpand,
  selectedIds,
  onToggleSelect,
  onResetFilters,
}: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <Box
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          backgroundColor: 'background.paper',
        }}
      >
        <DocumentsEmptyState onResetFilters={onResetFilters} />
      </Box>
    )
  }

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
        />
      ))}
    </Box>
  )
}
