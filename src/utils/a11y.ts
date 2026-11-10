import { layout } from '@/theme/tokens'

/** Minimum pointer target size (WCAG 2.5.5) for icon-only buttons. */
export const touchTargetSx = {
  width: layout.touchTarget,
  height: layout.touchTarget,
} as const

/** Text for screen readers only (equivalent of the usual `.sr-only` class). */
export const visuallyHiddenSx = {
  position: 'absolute',
  // px strings: in `sx` a bare 1 means 100%
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const
