import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined'
import RefreshOutlined from '@mui/icons-material/RefreshOutlined'
import Button from '@mui/material/Button'
import { StatePanel } from './StatePanel'

export function DocumentsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StatePanel
      role="alert"
      tone="error"
      icon={<ErrorOutlineOutlined />}
      title="Nie udało się załadować dokumentów"
      actions={
        <Button
          variant="contained"
          startIcon={<RefreshOutlined />}
          onClick={onRetry}
        >
          Spróbuj ponownie
        </Button>
      }
    >
      Wystąpił problem podczas pobierania danych rejestru. Spróbuj ponownie za
      chwilę.
    </StatePanel>
  )
}
