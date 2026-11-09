import { useState } from 'react'
import type { MouseEvent, ReactElement } from 'react'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined'
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import PrintOutlined from '@mui/icons-material/PrintOutlined'
import RestartAltOutlined from '@mui/icons-material/RestartAltOutlined'
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
  canResetAll: boolean
  onResetAll: () => void
}

interface ToolbarIconButtonProps {
  label: string
  icon: ReactElement
  onClick?: () => void
  disabledHint: string
}

const buttonSize = 40

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
  canResetAll,
  onResetAll,
}: DocumentToolbarProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const closeMenu = () => setMenuAnchor(null)

  const handleResetAll = () => {
    closeMenu()
    onResetAll()
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
            flexGrow: { xs: 1, sm: 0 },
            minWidth: 0,
            px: { xs: 1.5, md: 2 },
            '& .MuiButton-startIcon': {
              display: { xs: 'none', sm: 'inherit' },
            },
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
          <MenuItem disabled={!canResetAll} onClick={handleResetAll}>
            <ListItemIcon>
              <RestartAltOutlined fontSize="small" />
            </ListItemIcon>
            Wyczyść wyszukiwanie i filtry
          </MenuItem>
          <MenuItem disabled>Zaznacz wszystkie (wkrótce)</MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
