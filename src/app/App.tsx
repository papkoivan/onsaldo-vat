import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { VatRegisterPage } from '@/features/vat-register'
import { theme } from '@/theme/theme'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VatRegisterPage />
    </ThemeProvider>
  )
}
