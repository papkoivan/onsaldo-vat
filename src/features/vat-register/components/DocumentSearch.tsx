import ClearOutlined from '@mui/icons-material/ClearOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { layout } from '@/theme/tokens'
import { useViewportDown } from '../hooks/useViewportDown'

interface DocumentSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  disabled?: boolean
}

export function DocumentSearch({
  value,
  onChange,
  onClear,
  disabled = false,
}: DocumentSearchProps) {
  // the long placeholder is clipped in the narrower tablet toolbar
  const compact = useViewportDown('lg')

  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={
        compact
          ? 'Szukaj dokumentów...'
          : 'Szukaj kontrahenta, numeru dokumentu lub KSeF...'
      }
      size="small"
      fullWidth
      disabled={disabled}
      slotProps={{
        htmlInput: { 'aria-label': 'Szukaj dokumentów' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          ),
          endAdornment:
            value && !disabled ? (
              <InputAdornment position="end">
                <Tooltip title="Wyczyść wyszukiwanie">
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label="Wyczyść wyszukiwanie"
                    onClick={onClear}
                  >
                    <ClearOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: layout.controlHeight,
          backgroundColor: 'background.paper',
        },
      }}
    />
  )
}
