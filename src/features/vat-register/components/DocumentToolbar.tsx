import { useState } from 'react'
import type { MouseEvent, ReactElement } from 'react'
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined'
import ClearOutlined from '@mui/icons-material/ClearOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import PrintOutlined from '@mui/icons-material/PrintOutlined'
import RestartAltOutlined from '@mui/icons-material/RestartAltOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { colors } from '@/theme/tokens'
import { useViewportDown } from '../hooks/useViewportDown'
import { DocumentSearch } from './DocumentSearch'

interface DocumentToolbarProps {
  /** Search, filters and the actions menu are unavailable (no data to work on). */
  disabled?: boolean
  /** Replaces the default tooltip hint on actions that need documents. */
  unavailableReason?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  activeFilterCount: number
  onOpenFilters: () => void
  /** Undefined when there are no documents to print — the action stays disabled. */
  onPrint?: () => void
  /** Undefined when there are no documents to export — the action stays disabled. */
  onExport?: () => void
  /** Undefined while nothing is selected. */
  onExportSelected?: () => void
  /** Undefined while nothing is selected. Receives the element to anchor the tag menu to. */
  onTag?: (anchor: HTMLElement) => void
  /** Undefined while nothing is selected. */
  onClearSelection?: () => void
  /** Undefined when there are no documents to select. */
  onSelectAll?: () => void
  canResetAll: boolean
  onResetAll: () => void
}

interface ToolbarIconButtonProps {
  label: string
  icon: ReactElement
  onClick?: (event: MouseEvent<HTMLElement>) => void
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
  disabled = false,
  unavailableReason,
  searchValue,
  onSearchChange,
  onSearchClear,
  activeFilterCount,
  onOpenFilters,
  onPrint,
  onExport,
  onExportSelected,
  onTag,
  onClearSelection,
  onSelectAll,
  canResetAll,
  onResetAll,
}: DocumentToolbarProps) {
  const compact = useViewportDown('sm')
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const closeMenu = () => setMenuAnchor(null)

  const handleMenuAction = (action?: () => void) => () => {
    closeMenu()
    action?.()
  }

  // On phones the tag menu opens from the "more" button, which stays in the layout.
  const handleMenuTag = () => {
    const anchor = menuAnchor
    closeMenu()
    if (anchor) onTag?.(anchor)
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
        {!compact && (
          <>
            <ToolbarIconButton
              label="Oznacz dokumenty"
              icon={<LocalOfferOutlined />}
              onClick={onTag && ((event) => onTag(event.currentTarget))}
              disabledHint={unavailableReason ?? 'najpierw zaznacz dokumenty'}
            />
            <ToolbarIconButton
              label="Drukuj"
              icon={<PrintOutlined />}
              onClick={onPrint}
              disabledHint={unavailableReason ?? 'brak dokumentów do wydruku'}
            />
            <ToolbarIconButton
              label="Eksportuj do CSV"
              icon={<FileDownloadOutlined />}
              onClick={onExport}
              disabledHint={unavailableReason ?? 'brak dokumentów do eksportu'}
            />
          </>
        )}
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
          {compact && [
            <MenuItem
              key="tag"
              disabled={!onTag}
              onClick={handleMenuTag}
              sx={menuItemSx}
            >
              <ListItemIcon>
                <LocalOfferOutlined fontSize="small" />
              </ListItemIcon>
              Oznacz zaznaczone dokumenty
            </MenuItem>,
            <MenuItem
              key="print"
              disabled={!onPrint}
              onClick={handleMenuAction(onPrint)}
              sx={menuItemSx}
            >
              <ListItemIcon>
                <PrintOutlined fontSize="small" />
              </ListItemIcon>
              Drukuj wyniki
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
              Eksportuj wyniki (CSV)
            </MenuItem>,
            <Divider key="divider" />,
          ]}
          <MenuItem
            disabled={!onExportSelected}
            onClick={handleMenuAction(onExportSelected)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <FileDownloadOutlined fontSize="small" />
            </ListItemIcon>
            Eksportuj zaznaczone (CSV)
          </MenuItem>
          <MenuItem
            disabled={!onSelectAll}
            onClick={handleMenuAction(onSelectAll)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <CheckBoxOutlined fontSize="small" />
            </ListItemIcon>
            Zaznacz wszystkie widoczne
          </MenuItem>
          <MenuItem
            disabled={!onClearSelection}
            onClick={handleMenuAction(onClearSelection)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <ClearOutlined fontSize="small" />
            </ListItemIcon>
            Wyczyść zaznaczenie
          </MenuItem>
          <Divider />
          <MenuItem
            disabled={!canResetAll}
            onClick={handleMenuAction(onResetAll)}
            sx={menuItemSx}
          >
            <ListItemIcon>
              <RestartAltOutlined fontSize="small" />
            </ListItemIcon>
            Wyczyść wyszukiwanie i filtry
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
