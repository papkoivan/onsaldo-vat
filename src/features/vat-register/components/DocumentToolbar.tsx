import { useState } from 'react'
import type { MouseEvent, ReactElement } from 'react'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import PrintOutlined from '@mui/icons-material/PrintOutlined'
import RestartAltOutlined from '@mui/icons-material/RestartAltOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { colors } from '@/theme/tokens'
import { useViewportDown } from '../hooks/useViewportDown'
import { DocumentSearch } from './DocumentSearch'

interface DocumentToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  onPrint: () => void
  /** Undefined until documents are available — the action stays disabled. */
  onExport?: () => void
  /** Undefined until document selection is available — the action stays disabled. */
  onTag?: () => void
  /** Undefined when there are no documents to select. */
  onSelectAll?: () => void
  canResetAll: boolean
  onResetAll: () => void
}

interface ToolbarIconButtonProps {
  label: string
  icon: ReactElement
  onClick?: () => void
  disabledHint: string
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

function ToolbarIconButton({
  label,
  icon,
  onClick,
  disabledHint,
}: ToolbarIconButtonProps) {
  const disabled = onClick === undefined

  return (
    <Tooltip title={disabled ? `${label} — ${disabledHint}` : label}>
      <span>
        <IconButton
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          sx={outlinedButtonSx}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export function DocumentToolbar({
  searchValue,
  onSearchChange,
  onSearchClear,
  activeFilterCount,
  onOpenFilters,
  onPrint,
  onExport,
  onTag,
  onSelectAll,
  canResetAll,
  onResetAll,
}: DocumentToolbarProps) {
  const compact = useViewportDown('sm')
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const closeMenu = () => setMenuAnchor(null)

  const handleResetAll = () => {
    closeMenu()
    onResetAll()
  }

  const handleMenuAction = (action?: () => void) => () => {
    closeMenu()
    action?.()
  }

  const handleSelectAll = () => {
    closeMenu()
    onSelectAll?.()
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
        {!compact && (
          <>
            <ToolbarIconButton
              label="Oznacz dokumenty"
              icon={<LocalOfferOutlined />}
              onClick={onTag}
              disabledHint="najpierw zaznacz dokumenty (wkrótce)"
            />
            <ToolbarIconButton
              label="Drukuj"
              icon={<PrintOutlined />}
              onClick={onPrint}
              disabledHint=""
            />
            <ToolbarIconButton
              label="Eksportuj do CSV"
              icon={<FileDownloadOutlined />}
              onClick={onExport}
              disabledHint="dostępne po wczytaniu dokumentów (wkrótce)"
            />
          </>
        )}
        <Tooltip title="Więcej akcji">
          <IconButton
            aria-label="Więcej akcji"
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
          {compact && [
            <MenuItem
              key="tag"
              disabled={!onTag}
              onClick={handleMenuAction(onTag)}
              sx={menuItemSx}
            >
              <ListItemIcon>
                <LocalOfferOutlined fontSize="small" />
              </ListItemIcon>
              Oznacz dokumenty
            </MenuItem>,
            <MenuItem
              key="print"
              onClick={handleMenuAction(onPrint)}
              sx={menuItemSx}
            >
              <ListItemIcon>
                <PrintOutlined fontSize="small" />
              </ListItemIcon>
              Drukuj
            </MenuItem>,
            <MenuItem
              key="export"
              disabled={!onExport}
              onClick={handleMenuAction(onExport)}
              sx={menuItemSx}
            >
              <ListItemIcon>
                <FileDownloadOutlined fontSize="small" />
              </ListItemIcon>
              Eksportuj do CSV
            </MenuItem>,
            <Divider key="divider" />,
          ]}
          <MenuItem
            disabled={!canResetAll}
            onClick={handleResetAll}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <RestartAltOutlined fontSize="small" />
            </ListItemIcon>
            Wyczyść wyszukiwanie i filtry
          </MenuItem>
          <MenuItem
            disabled={!onSelectAll}
            onClick={handleSelectAll}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <CheckBoxOutlined fontSize="small" />
            </ListItemIcon>
            Zaznacz wszystkie widoczne
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
