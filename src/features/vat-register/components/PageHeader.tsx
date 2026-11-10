import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface PageHeaderBadge {
  label: string
  tone: 'warning' | 'neutral'
}

interface PageHeaderProps {
  companyName: string
  title: string
  subtitle: string
  badges: readonly PageHeaderBadge[]
}

const badgeColors = { warning: 'warning', neutral: 'default' } as const

export function PageHeader({
  companyName,
  title,
  subtitle,
  badges,
}: PageHeaderProps) {
  return (
    <Stack
      component="header"
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        rowGap: 1.5,
      }}
    >
      <div>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          {companyName}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 0.25 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </div>
      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        {badges.map((badge) => (
          <Chip
            key={badge.label}
            label={badge.label}
            size="small"
            color={badgeColors[badge.tone]}
            sx={{ fontSize: '0.75rem' }}
          />
        ))}
      </Stack>
    </Stack>
  )
}
