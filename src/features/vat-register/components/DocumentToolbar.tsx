import { useState } from 'react'
import type { MouseEvent } from 'react'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import PrintOutlined from '@mui/icons-material/PrintOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { colors } from '@/theme/tokens'
import { DocumentSearch } from './DocumentSearch'

interface DocumentToolbarProps {
  /** Search, filters and the actions menu are unavailable (no data to work on). */
  disabled?: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  /** Undefined when there are no documents to print — the action stays disabled. */
  onPrint?: () => void
  /** Undefined when there are no documents to export — the action stays disabled. */
  onExport?: () => void
}

// 44px touch targets below the tablet breakpoint, 40px from md up
const buttonSize = { xs: 44, md: 40 } as const

const outlinedButtonSx = {
  width: buttonSize,
  height: buttonSize,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  backgroundColor: 'background.paper',
  color: 'text.primary',
  '&:hover': { backgroundColor: colors.surfaceMuted },
  '&.Mui-disabled': { backgroundColor: colors.surfaceMuted },
} as const

const menuItemSx = { minHeight: 44 } as const

export function DocumentToolbar({
  disabled = false,
  searchValue,
  onSearchChange,
  onSearchClear,
  activeFilterCount,
  onOpenFilters,
  onPrint,
  onExport,
}: DocumentToolbarProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const closeMenu = () => setMenuAnchor(null)

  const handleMenuAction = (action?: () => void) => () => {
    closeMenu()
    action?.()
  }

  return (
    <Box
      role="toolbar"
      aria-label="Narzędzia dokumentów"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
        <DocumentSearch
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          disabled={disabled}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          flex: { xs: '1 1 100%', md: '0 0 auto' },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterAltOutlined />}
          onClick={onOpenFilters}
          disabled={disabled}
          aria-haspopup="dialog"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            minWidth: 0,
            px: { xs: 1.5, md: 2 },
            height: buttonSize,
            color: 'primary.main',
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
            },
          }}
        >
          {activeFilterCount > 0 ? `Filtry (${activeFilterCount})` : 'Filtry'}
        </Button>
        <Tooltip title="Więcej akcji">
          <IconButton
            aria-label="Więcej akcji"
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={menuAnchor ? true : undefined}
            aria-controls={menuAnchor ? 'document-more-menu' : undefined}
            onClick={(event: MouseEvent<HTMLElement>) =>
              setMenuAnchor(event.currentTarget)
            }
            sx={outlinedButtonSx}
          >
            <MoreHoriz />
          </IconButton>
        </Tooltip>
        <Menu
          id="document-more-menu"
          anchorEl={menuAnchor}
          open={menuAnchor !== null}
          onClose={closeMenu}
        >
          <MenuItem
            disabled={!onPrint}
            onClick={handleMenuAction(onPrint)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <PrintOutlined fontSize="small" />
            </ListItemIcon>
            Drukuj wyniki
          </MenuItem>
          <MenuItem
            disabled={!onExport}
            onClick={handleMenuAction(onExport)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <FileDownloadOutlined fontSize="small" />
            </ListItemIcon>
            Eksportuj wyniki (CSV)
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
