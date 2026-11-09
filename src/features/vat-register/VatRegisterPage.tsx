import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { layout } from '@/theme/tokens'

export function VatRegisterPage() {
  return (
    <Box component="main" sx={{ px: `${layout.pagePaddingX}px`, py: 3 }}>
      <Typography variant="h4" component="h1">
        Rejestry VAT
      </Typography>
      <Typography color="text.secondary">Widok w przygotowaniu.</Typography>
    </Box>
  )
}
