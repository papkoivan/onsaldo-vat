export const TABLE_COLUMN_COUNT = 6

export const numericCellSx = {
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const

// Below this breakpoint the hidden columns' data is still available in the
// expanded row (and on mobile the table is replaced by cards).
export const desktopOnlyCellSx = {
  display: { xs: 'none', xl: 'table-cell' },
} as const

export const truncatedTextSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const

// Full 10-column table needs the original roomy spacing only on wide desktops.
export const WIDE_DESKTOP = '@media (min-width:1440px)'
