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
  // xs <768 mobile (cards) · md 768 tablet · lg 1024 laptop · xl 1200 desktop
  breakpoints: { values: { xs: 0, sm: 600, md: 768, lg: 1024, xl: 1200 } },
  shape: { borderRadius: layout.radius },
  typography: { fontFamily },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: layout.minViewportWidth },
        // The print view lives in #print-root: invisible on screen, and the only thing printed.
        '#print-root': { display: 'none' },
        '@media print': {
          // only when the print view exists; otherwise the page itself prints
          'body:has(#print-root > *) > :not(#print-root)': {
            display: 'none !important',
          },
          '#print-root': { display: 'block' },
          body: { minWidth: 0, backgroundColor: '#ffffff' },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `2px solid ${colors.primary}`,
            outlineOffset: 2,
          },
          // items that fill their container would have the ring clipped outside it
          '&.MuiMenuItem-root.Mui-focusVisible, &.MuiTab-root.Mui-focusVisible':
            { outlineOffset: -2 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: colors.borderInput },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': { color: colors.textSecondary, opacity: 1 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 48, borderBottom: `1px solid ${colors.border}` },
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          textTransform: 'none',
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: colors.textSecondary,
          borderRadius: `${layout.radius}px ${layout.radius}px 0 0`,
          '&.Mui-selected': {
            color: colors.primary,
            backgroundColor: colors.primaryLight,
          },
        },
      },
    },
  },
})
