import { colors } from './tokens'

// Shared look of neutral bordered controls: `<Button variant="outlined" color="inherit">`
// (via the theme) and `OutlinedIconButton`.
export const neutralOutlinedStyle = {
  color: colors.textPrimary,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  '&:hover': {
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  '&.Mui-disabled': { backgroundColor: colors.surfaceMuted },
} as const
