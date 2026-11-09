import ClearOutlined from '@mui/icons-material/ClearOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { colors } from '@/theme/tokens'

interface DocumentSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export function DocumentSearch({
  value,
  onChange,
  onClear,
}: DocumentSearchProps) {
  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Szukaj kontrahenta, numeru dokumentu lub KSeF..."
      size="small"
      fullWidth
      slotProps={{
        htmlInput: { 'aria-label': 'Szukaj dokumentów' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
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
          height: 40,
          backgroundColor: 'background.paper',
          '& fieldset': { borderColor: colors.border },
        },
      }}
    />
  )
}
