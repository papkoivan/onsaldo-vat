import { colors } from '@/theme/tokens'
import { WIDE_DESKTOP } from '../tableStyles'

// used with `<TableContainer component={Paper} variant="card">`; tables get a stronger border
export const tableContainerSx = { borderColor: colors.borderTable } as const

// tighter horizontal rhythm below the wide-desktop breakpoint
export const tableSx = {
  '& .MuiTableCell-root:not(.MuiTableCell-paddingCheckbox)': {
    px: 1.25,
    [WIDE_DESKTOP]: { px: 2 },
  },
} as const
