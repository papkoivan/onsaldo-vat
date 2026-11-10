import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'
import { useViewportDown } from '../hooks/useViewportDown'
import type { VatViewState } from '../types/viewState'

interface DemoStateSwitcherProps {
  value: VatViewState
  onChange: (next: VatViewState) => void
}

const OPTIONS: readonly { value: VatViewState; label: string }[] = [
  { value: 'filled', label: 'Wypełniony' },
  { value: 'empty', label: 'Pusty' },
  { value: 'no-results', label: 'Brak wyników' },
  { value: 'loading', label: 'Ładowanie' },
  { value: 'error', label: 'Błąd' },
]

const LABEL = 'Stan danych (tylko demo)'

/** Prototype-only control: it is not part of the accounting workflow. */
export function DemoStateSwitcher({ value, onChange }: DemoStateSwitcherProps) {
  const compact = useViewportDown('md')

  return (
    <Box
      role="region"
      aria-label="Panel demonstracyjny"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 2,
        rowGap: 1,
        px: 1.5,
        py: 1,
        border: `1px dashed ${colors.textSecondary}`,
        borderRadius: '10px',
        backgroundColor: colors.surfaceMuted,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Chip
          size="small"
          icon={<ScienceOutlined />}
          label="PROTOTYP"
          sx={{
            fontWeight: 700,
            fontSize: '0.6875rem',
            letterSpacing: '0.04em',
            color: colors.textSecondary,
            backgroundColor: 'background.paper',
            border: `1px solid ${colors.border}`,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Przełącznik stanów do prezentacji i testów — nie jest funkcją
          aplikacji.
        </Typography>
      </Box>
      <Box sx={{ ml: { md: 'auto' }, width: { xs: '100%', md: 'auto' } }}>
        {compact ? (
          <TextField
            select
            fullWidth
            size="small"
            label={LABEL}
            value={value}
            onChange={(event) => {
              const option = OPTIONS.find(
                ({ value: candidate }) => candidate === event.target.value,
              )
              if (option) onChange(option.value)
            }}
            sx={{
              '& .MuiInputBase-root': {
                minHeight: 44,
                backgroundColor: 'background.paper',
              },
            }}
          >
            {OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ minHeight: 44 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <ToggleButtonGroup
            exclusive
            size="small"
            value={value}
            aria-label={LABEL}
            onChange={(_event, next: VatViewState | null) => {
              if (next !== null) onChange(next)
            }}
            sx={{ backgroundColor: 'background.paper' }}
          >
            {OPTIONS.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                sx={{ textTransform: 'none', fontWeight: 600, px: 1.5 }}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  )
}
