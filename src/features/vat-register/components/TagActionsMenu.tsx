import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import type { DocumentTagAssignments, DocumentTagId } from '../types/tags'
import { DOCUMENT_TAGS, countWithTag } from '../utils/tags'

interface TagActionsMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onExited: () => void
  selectedIds: readonly string[]
  assignments: DocumentTagAssignments
  onAdd: (tagId: DocumentTagId) => void
  onRemove: (tagId: DocumentTagId) => void
}

const itemSx = { minHeight: 44 } as const
const subheaderSx = { lineHeight: '32px', fontWeight: 700 } as const

function TagDot({ color }: { color: string }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
  )
}

export function TagActionsMenu({
  anchorEl,
  onClose,
  onExited,
  selectedIds,
  assignments,
  onAdd,
  onRemove,
}: TagActionsMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={onClose}
      slotProps={{
        list: { 'aria-label': 'Oznaczenia zaznaczonych dokumentów' },
        paper: { sx: { maxWidth: 'calc(100vw - 32px)' } },
        transition: { onExited },
      }}
    >
      <ListSubheader disableSticky sx={subheaderSx}>
        Dodaj oznaczenie
      </ListSubheader>
      {DOCUMENT_TAGS.map((tag) => {
        const missing =
          selectedIds.length - countWithTag(assignments, selectedIds, tag.id)
        return (
          <MenuItem
            key={`add-${tag.id}`}
            disabled={missing === 0}
            aria-label={`Dodaj oznaczenie: ${tag.label}`}
            onClick={() => onAdd(tag.id)}
            sx={itemSx}
          >
            <ListItemIcon>
              <TagDot color={tag.color} />
            </ListItemIcon>
            {tag.label}
          </MenuItem>
        )
      })}
      <Divider />
      <ListSubheader disableSticky sx={subheaderSx}>
        Usuń oznaczenie
      </ListSubheader>
      {DOCUMENT_TAGS.map((tag) => {
        const present = countWithTag(assignments, selectedIds, tag.id)
        return (
          <MenuItem
            key={`remove-${tag.id}`}
            disabled={present === 0}
            aria-label={`Usuń oznaczenie: ${tag.label}${present > 0 ? ` (${present})` : ''}`}
            onClick={() => onRemove(tag.id)}
            sx={{ ...itemSx, justifyContent: 'space-between', gap: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <TagDot color={tag.color} />
              </ListItemIcon>
              {tag.label}
            </Box>
            {present > 0 && (
              <Typography variant="body2" color="text.secondary">
                {present}
              </Typography>
            )}
          </MenuItem>
        )
      })}
      <Divider />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', px: 2, py: 1, maxWidth: 280 }}
      >
        Oznaczenia są lokalne (demo) i nie są zapisywane w systemie księgowym.
      </Typography>
    </Menu>
  )
}
