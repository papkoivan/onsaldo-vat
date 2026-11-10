import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { neutralOutlinedStyle } from '@/theme/neutralOutlined'
import { colors, layout } from '@/theme/tokens'

export const OutlinedIconButton = styled(IconButton)({
  width: layout.touchTarget,
  height: layout.touchTarget,
  border: `1px solid ${colors.border}`,
  borderRadius: layout.radius,
  ...neutralOutlinedStyle,
})
