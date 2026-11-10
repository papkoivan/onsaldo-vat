import CloseOutlined from '@mui/icons-material/CloseOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import type { DocumentTagId } from '../types/tags'
import { getTag } from '../utils/tags'

interface DocumentTagChipsProps {
  tagIds: readonly DocumentTagId[]
  /** When provided, chips can be removed (click the "x", or Backspace/Delete on a focused chip). */
  onRemove?: (tagId: DocumentTagId) => void
}

export function DocumentTagChips({ tagIds, onRemove }: DocumentTagChipsProps) {
  if (tagIds.length === 0) return null

  return (
    <Box
      role="group"
      aria-label="Oznaczenia dokumentu"
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
    >
      {tagIds.map((tagId) => {
        const tag = getTag(tagId)
        return (
          <Chip
            key={tag.id}
            size="small"
            label={tag.label}
            onDelete={onRemove ? () => onRemove(tag.id) : undefined}
            deleteIcon={
              <CloseOutlined
                titleAccess={`Usuń oznaczenie: ${tag.label}`}
                sx={{ fontSize: '14px !important' }}
              />
            }
            sx={{
              height: 22,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: tag.color,
              backgroundColor: tag.background,
              border: `1px solid ${tag.border}`,
              '& .MuiChip-deleteIcon': { color: tag.color, opacity: 0.7 },
            }}
          />
        )
      })}
    </Box>
  )
}
