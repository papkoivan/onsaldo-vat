import CloseOutlined from '@mui/icons-material/CloseOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'
import type { FilterKey, VatFilters } from '../types/filters'
import { FilterForm } from './FilterForm'

interface FiltersDrawerProps {
  open: boolean
  values: VatFilters
  onChange: (key: FilterKey, value: string) => void
  onClose: () => void
  onReset: () => void
  onApply: () => void
}

const TITLE_ID = 'filters-drawer-title'

export function FiltersDrawer({
  open,
  values,
  onChange,
  onClose,
  onReset,
  onApply,
}: FiltersDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': TITLE_ID,
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
            boxShadow: '-8px 0 24px rgba(20, 33, 28, 0.08)',
          },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          pt: 2.5,
          pb: 2,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Box>
          <Typography
            id={TITLE_ID}
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700 }}
          >
            Filtry
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Zawęź listę dokumentów według wybranych parametrów.
          </Typography>
        </Box>
        <Tooltip title="Zamknij">
          <IconButton
            edge="end"
            aria-label="Zamknij filtry"
            onClick={onClose}
            sx={{ mt: -0.5 }}
          >
            <CloseOutlined />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
        <FilterForm values={values} onChange={onChange} />
      </Box>

      <Box
        component="footer"
        sx={{
          display: 'flex',
          gap: 1.5,
          px: 3,
          py: 2,
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Button variant="outlined" color="inherit" onClick={onReset}>
          Wyczyść
        </Button>
        <Button variant="contained" fullWidth onClick={onApply}>
          Zastosuj filtry
        </Button>
      </Box>
    </Drawer>
  )
}
