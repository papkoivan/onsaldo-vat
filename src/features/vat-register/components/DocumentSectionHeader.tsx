import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'
import { formatDocumentCount } from '@/utils/format'

interface DocumentSectionHeaderProps {
  titleId: string
  title: string
  count: number
}

export function DocumentSectionHeader({
  titleId,
  title,
  count,
}: DocumentSectionHeaderProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Typography
        id={titleId}
        variant="h5"
        component="h2"
        sx={{ fontWeight: 700 }}
      >
        {title}
      </Typography>
      <Chip
        label={formatDocumentCount(count)}
        size="small"
        sx={{
          fontWeight: 500,
          color: 'text.secondary',
          backgroundColor: colors.surfaceMuted,
          border: `1px solid ${colors.border}`,
        }}
      />
    </Stack>
  )
}
