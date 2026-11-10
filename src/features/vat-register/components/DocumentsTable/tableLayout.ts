import { colors } from '@/theme/tokens'
import { WIDE_DESKTOP } from '../tableStyles'

export const tableContainerSx = {
  border: `1px solid ${colors.borderTable}`,
  borderRadius: '12px',
  backgroundColor: 'background.paper',
} as const

// tighter horizontal rhythm below the wide-desktop breakpoint
export const tableSx = {
  '& .MuiTableCell-root:not(.MuiTableCell-paddingCheckbox)': {
    px: 1.25,
    [WIDE_DESKTOP]: { px: 2 },
  },
} as const
