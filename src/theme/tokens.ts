export const colors = {
  primary: '#0b6b52',
  primaryDark: '#085541',
  primaryLight: '#e3f2ed',
  warningBg: '#fff4d6',
  warningBorder: '#f3d98b',
  warningText: '#6b4a00',
  successBg: '#e3f2ed',
  successBorder: '#b7dccd',
  successText: '#0b6b52',
  infoBg: '#e8eff8',
  infoBorder: '#c0d2ea',
  infoText: '#1d4a80',
  errorBg: '#fdecea',
  errorBorder: '#f3c1bb',
  errorText: '#9f2b22',
  textPrimary: '#14211c',
  textSecondary: '#566660',
  border: '#dde5e1',
  borderTable: '#b4c3bc',
  // form control outlines need 3:1 against white (WCAG 1.4.11); `border` is for decorative dividers
  borderInput: '#7f918a',
  background: '#f7f9f8',
  surface: '#ffffff',
  surfaceMuted: '#f1f5f3',
} as const

export const layout = {
  minViewportWidth: 320,
  pagePaddingX: 24,
  pagePaddingXMobile: 16,
  maxContentWidth: 1680,
  radius: 8,
  radiusLg: 12,
  touchTarget: 44,
  // 44px touch targets below the tablet breakpoint, 40px from md up
  controlHeight: { xs: 44, md: 40 },
} as const

export const fontFamily =
  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
