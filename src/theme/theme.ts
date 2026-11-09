import { createTheme } from '@mui/material/styles'
import { colors, fontFamily, layout } from './tokens'

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
    },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
    background: { default: colors.background, paper: colors.surface },
  },
  shape: { borderRadius: layout.radius },
  typography: { fontFamily },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: layout.minViewportWidth },
      },
    },
  },
})
