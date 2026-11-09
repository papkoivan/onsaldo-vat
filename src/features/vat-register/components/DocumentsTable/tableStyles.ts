export const TABLE_COLUMN_COUNT = 10

export const numericCellSx = {
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const

// Secondary columns are shown from the desktop breakpoint up; below it the
// same data is available in the expanded row.
export const desktopOnlyCellSx = {
  display: { xs: 'none', xl: 'table-cell' },
} as const

export const truncatedTextSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const
