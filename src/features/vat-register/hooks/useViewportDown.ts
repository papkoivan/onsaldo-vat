import { useTheme } from '@mui/material/styles'
import type { Breakpoint } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

/** True below the given breakpoint. Evaluated synchronously to avoid a layout flash on first render. */
export function useViewportDown(key: Breakpoint): boolean {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down(key), { noSsr: true })
}
