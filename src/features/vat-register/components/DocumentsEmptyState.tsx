import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface DocumentsEmptyStateProps {
  /** Undefined when there is nothing to reset. */
  onResetFilters?: () => void
}

export function DocumentsEmptyState({
  onResetFilters,
}: DocumentsEmptyStateProps) {
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 6,
        textAlign: 'center',
      }}
    >
      <SearchOffOutlined
        aria-hidden
        sx={{ fontSize: 40, color: 'text.secondary' }}
      />
      <Typography sx={{ fontWeight: 600 }}>
        Brak dokumentów do wyświetlenia
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Żaden dokument nie spełnia wybranych kryteriów wyszukiwania i filtrów.
      </Typography>
      {onResetFilters && (
        <Button variant="outlined" onClick={onResetFilters} sx={{ mt: 1 }}>
          Wyczyść wyszukiwanie i filtry
        </Button>
      )}
    </Box>
  )
}
