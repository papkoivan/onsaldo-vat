import type { ReactElement, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'

type StatePanelTone = 'primary' | 'neutral' | 'error'

interface StatePanelProps {
  icon: ReactElement
  tone: StatePanelTone
  title: string
  children: ReactNode
  actions?: ReactNode
  /** `alert` interrupts screen readers, so it is reserved for failures. */
  role: 'status' | 'alert'
}

const tones: Record<StatePanelTone, { color: string; background: string }> = {
  primary: { color: colors.primary, background: colors.primaryLight },
  neutral: { color: colors.textSecondary, background: colors.surfaceMuted },
  error: { color: colors.errorText, background: colors.errorBg },
}

export function StatePanel({
  icon,
  tone,
  title,
  children,
  actions,
  role,
}: StatePanelProps) {
  const { color, background } = tones[tone]

  return (
    <Box
      role={role}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.25,
        px: { xs: 2, md: 3 },
        py: { xs: 5, md: 7 },
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          color,
          backgroundColor: background,
          '& svg': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ maxWidth: 440, overflowWrap: 'anywhere' }}
      >
        {children}
      </Typography>
      {actions && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            gap: 1,
            mt: 1,
            width: { xs: '100%', sm: 'auto' },
            '& .MuiButton-root': { minHeight: 44 },
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  )
}
