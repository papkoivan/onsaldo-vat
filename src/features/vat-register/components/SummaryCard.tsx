import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatCurrency } from '@/utils/format'

interface SummaryCardProps {
  label: string
  value: number
  icon: ReactNode
}

export function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
        px: { xs: 2, md: 2.5 },
        py: 1.75,
        borderRadius: '12px',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        aria-hidden
        sx={{
          // icon hidden only on narrow tablets, where three cards share one row
          display: { xs: 'flex', sm: 'none', md: 'flex' },
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: '10px',
          backgroundColor: 'primary.light',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.375rem', sm: '1.25rem', lg: '1.5rem' },
            fontWeight: 700,
            lineHeight: 1.3,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {formatCurrency(value)}
        </Typography>
      </Box>
    </Paper>
  )
}
