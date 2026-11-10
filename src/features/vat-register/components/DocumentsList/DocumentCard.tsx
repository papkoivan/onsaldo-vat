import type { MouseEvent } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { formatCurrency, formatDate } from '@/utils/format'
import type { DocumentTagId } from '../../types/tags'
import { DocumentDetails } from '../DocumentDetails'
import { DocumentTagChips } from '../DocumentTagChips'
import { KsefStatusChip } from '../KsefStatusChip'

interface DocumentCardProps {
  document: VatDocument
  expanded: boolean
  selected: boolean
  onToggleExpand: (id: string) => void
  onToggleSelect: (id: string) => void
  tags: readonly DocumentTagId[]
  onRemoveTag: (document: VatDocument, tagId: DocumentTagId) => void
}

const TOUCH_TARGET = 44

export function DocumentCard({
  document,
  expanded,
  selected,
  onToggleExpand,
  onToggleSelect,
  tags,
  onRemoveTag,
}: DocumentCardProps) {
  const detailsId = `document-details-${document.id}`
  const expandLabel = `${expanded ? 'Zwiń' : 'Rozwiń'} szczegóły dokumentu ${document.documentNumber}`

  // The whole header is a larger tap area; real controls keep their own behaviour.
  const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest('button, input, a')
    )
      return
    onToggleExpand(document.id)
  }

  return (
    <Box
      component="li"
      sx={{
        overflow: 'hidden',
        border: `1px solid ${selected ? colors.primary : colors.border}`,
        borderRadius: '12px',
        backgroundColor: selected ? colors.primaryLight : 'background.paper',
      }}
    >
      <Box
        onClick={handleHeaderClick}
        sx={{
          display: 'grid',
          gridTemplateColumns: `${TOUCH_TARGET}px minmax(0, 1fr) ${TOUCH_TARGET}px`,
          alignItems: 'start',
          columnGap: 0.5,
          rowGap: 0.5,
          p: 1,
          cursor: 'pointer',
        }}
      >
        <Checkbox
          checked={selected}
          onChange={() => onToggleSelect(document.id)}
          slotProps={{
            input: {
              'aria-label': `Zaznacz dokument ${document.documentNumber}`,
            },
          }}
          sx={{ width: TOUCH_TARGET, height: TOUCH_TARGET }}
        />
        <Box sx={{ minWidth: 0, pt: 0.75 }}>
          <Typography
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.35,
              overflowWrap: 'anywhere',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {document.contractor}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: 'anywhere' }}
          >
            {document.documentNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(document.issueDate)}
          </Typography>
          {tags.length > 0 && (
            <Box sx={{ mt: 0.75 }}>
              <DocumentTagChips tagIds={tags} />
            </Box>
          )}
        </Box>
        <Tooltip title={expanded ? 'Zwiń szczegóły' : 'Rozwiń szczegóły'}>
          <IconButton
            aria-label={expandLabel}
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => onToggleExpand(document.id)}
            sx={{ width: TOUCH_TARGET, height: TOUCH_TARGET }}
          >
            <ExpandMore
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 150ms ease',
              }}
            />
          </IconButton>
        </Tooltip>
        <Box
          sx={{
            gridColumn: '1 / -1',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            columnGap: 1.5,
            rowGap: 0.5,
            px: 1,
            pb: 0.75,
          }}
        >
          <KsefStatusChip status={document.ksefStatus} />
          <Typography
            sx={{
              ml: 'auto',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            {formatCurrency(document.grossAmount)}
          </Typography>
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto">
        <DocumentDetails
          document={document}
          id={detailsId}
          variant="card"
          tags={tags}
          onRemoveTag={(tagId) => onRemoveTag(document, tagId)}
        />
      </Collapse>
    </Box>
  )
}
