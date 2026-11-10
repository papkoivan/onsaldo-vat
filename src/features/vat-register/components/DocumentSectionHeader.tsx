import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { colors } from '@/theme/tokens'
import { formatDocumentCount } from '@/utils/format'

interface DocumentSectionHeaderProps {
  titleId: string
  title: string
  /** Null when the number of documents is unknown (loading or failed). */
  count: number | null
  loading?: boolean
}

export function DocumentSectionHeader({
  titleId,
  title,
  count,
  loading = false,
}: DocumentSectionHeaderProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Typography
        id={titleId}
        variant="h5"
        component="h2"
        tabIndex={-1}
        sx={{ fontWeight: 700, '&:focus': { outline: 'none' } }}
      >
        {title}
      </Typography>
      {loading && (
        <Skeleton
          aria-hidden
          variant="rounded"
          width={96}
          height={24}
          sx={{ borderRadius: '12px' }}
        />
      )}
      {count !== null && (
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
      )}
    </Stack>
  )
}
