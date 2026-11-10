import ClearOutlined from '@mui/icons-material/ClearOutlined'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'
import { formatDocumentCount } from '@/utils/format'
import { useViewportDown } from '../hooks/useViewportDown'

interface BulkActionsBarProps {
  selectedCount: number
  onOpenTagMenu: (anchor: HTMLElement) => void
  onClearSelection: () => void
}

const TOUCH_TARGET = { xs: 44, md: 36 } as const

export function BulkActionsBar({
  selectedCount,
  onOpenTagMenu,
  onClearSelection,
}: BulkActionsBarProps) {
  const compact = useViewportDown('sm')

  if (selectedCount === 0) return null

  return (
    <Box
      role="region"
      aria-label="Akcje dla zaznaczonych dokumentów"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 2,
        rowGap: 1,
        px: 2,
        py: 1,
        border: `1px solid ${colors.successBorder}`,
        borderRadius: '10px',
        backgroundColor: colors.primaryLight,
      }}
    >
      <Typography role="status" sx={{ fontWeight: 600, color: 'primary.main' }}>
        Zaznaczono: {formatDocumentCount(selectedCount)}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Button
          variant="contained"
          startIcon={<LocalOfferOutlined />}
          aria-haspopup="menu"
          onClick={(event) => onOpenTagMenu(event.currentTarget)}
          sx={{ minHeight: TOUCH_TARGET, flex: { xs: 1, sm: 'none' } }}
        >
          Oznaczenia
        </Button>
        {compact ? (
          <Tooltip title="Wyczyść zaznaczenie">
            <IconButton
              aria-label="Wyczyść zaznaczenie"
              onClick={onClearSelection}
              sx={{
                width: 44,
                height: 44,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: 'background.paper',
              }}
            >
              <ClearOutlined />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ClearOutlined />}
            onClick={onClearSelection}
            sx={{
              minHeight: TOUCH_TARGET,
              backgroundColor: 'background.paper',
              borderColor: colors.border,
            }}
          >
            Wyczyść zaznaczenie
          </Button>
        )}
      </Box>
    </Box>
  )
}
