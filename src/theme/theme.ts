import { createTheme } from '@mui/material/styles'
import { neutralOutlinedStyle } from './neutralOutlined'
import { colors, fontFamily, layout } from './tokens'

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    card: true
  }
}

// `main` is the strong (text/icon) colour, `light` the tinted background
const semanticTones = {
  success: {
    main: colors.successText,
    light: colors.successBg,
    border: colors.successBorder,
  },
  warning: {
    main: colors.warningText,
    light: colors.warningBg,
    border: colors.warningBorder,
  },
  error: {
    main: colors.errorText,
    light: colors.errorBg,
    border: colors.errorBorder,
  },
  info: {
    main: colors.infoText,
    light: colors.infoBg,
    border: colors.infoBorder,
  },
} as const

const semanticToneNames = ['success', 'warning', 'error', 'info'] as const

const tintedSurface = (
  tone: (typeof semanticTones)[keyof typeof semanticTones],
) =>
  ({
    color: tone.main,
    backgroundColor: tone.light,
    border: `1px solid ${tone.border}`,
  }) as const

const breakpointValues = { xs: 0, sm: 600, md: 768, lg: 1024, xl: 1200 }

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
    },
    success: {
      main: semanticTones.success.main,
      light: semanticTones.success.light,
    },
    warning: {
      main: semanticTones.warning.main,
      light: semanticTones.warning.light,
    },
    error: { main: semanticTones.error.main, light: semanticTones.error.light },
    info: { main: semanticTones.info.main, light: semanticTones.info.light },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
    background: { default: colors.background, paper: colors.surface },
  },
  // xs <768 mobile (cards) · md 768 tablet · lg 1024 laptop · xl 1200 desktop
  breakpoints: { values: breakpointValues },
  shape: { borderRadius: layout.radius },
  typography: {
    fontFamily,
    h4: {
      fontWeight: 700,
      lineHeight: 1.2,
      fontSize: '1.75rem',
      [`@media (min-width:${breakpointValues.md}px)`]: { fontSize: '2.125rem' },
    },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
  },
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
    MuiPaper: {
      variants: [
        {
          props: { variant: 'card' },
          style: {
            border: `1px solid ${colors.border}`,
            borderRadius: layout.radiusLg,
          },
        },
      ],
    },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: false },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          '&::before': { display: 'none' },
          // MUI rounds first/last accordions with the base radius; match the card radius
          '&, &:first-of-type, &:last-of-type': {
            borderRadius: layout.radiusLg,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 52,
          paddingInline: theme.spacing(2),
          [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(2.5) },
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingInline: theme.spacing(2),
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(2),
          [theme.breakpoints.up('md')]: { paddingInline: theme.spacing(2.5) },
        }),
      },
    },
    MuiChip: {
      variants: [
        // badges are semibold; filter chips (outlined) keep the regular weight
        { props: { variant: 'filled' }, style: { fontWeight: 600 } },
        {
          props: { variant: 'filled', color: 'default' },
          style: {
            color: colors.textSecondary,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          },
        },
        ...semanticToneNames.map((tone) => ({
          props: { variant: 'filled' as const, color: tone },
          style: tintedSurface(semanticTones[tone]),
        })),
      ],
    },
    MuiAlert: {
      variants: semanticToneNames.map((tone) => ({
        props: { variant: 'standard' as const, severity: tone },
        style: tintedSurface(semanticTones[tone]),
      })),
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: colors.borderTable },
        head: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: colors.textSecondary,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
          paddingInline: theme.spacing(1.5),
        }),
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
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: layout.touchTarget,
        },
        // small buttons are dense from md up; the touch target only matters below it
        sizeSmall: ({ theme }) => ({
          [theme.breakpoints.up('md')]: { minHeight: 'auto' },
        }),
      },
      variants: [
        {
          props: { variant: 'outlined', color: 'inherit' },
          style: {
            ...neutralOutlinedStyle,
            // toggled state, opted into by the caller with `data-active`
            '&[data-active="true"]:not(.Mui-disabled)': {
              color: colors.primary,
              borderColor: colors.primary,
              backgroundColor: colors.primaryLight,
              '&:hover': {
                borderColor: colors.primaryDark,
                backgroundColor: colors.primaryLight,
              },
            },
          },
        },
      ],
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 48, borderBottom: `1px solid ${colors.border}` },
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 48,
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          lineHeight: 1.25,
          paddingInline: theme.spacing(1),
          color: colors.textSecondary,
          borderRadius: `${layout.radius}px ${layout.radius}px 0 0`,
          [theme.breakpoints.up('sm')]: {
            fontSize: '0.9375rem',
            paddingInline: theme.spacing(2),
          },
          '&.Mui-selected': {
            color: colors.primary,
            backgroundColor: colors.primaryLight,
          },
        }),
      },
    },
  },
})
