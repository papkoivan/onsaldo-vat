import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import type { SyntheticEvent } from 'react'
import { useFeedback } from '../hooks/useFeedback'

interface FeedbackSnackbarProps {
  feedback: ReturnType<typeof useFeedback>['feedback']
  onClose: () => void
}

export function FeedbackSnackbar({ feedback, onClose }: FeedbackSnackbarProps) {
  const handleClose = (_event: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return
    onClose()
  }

  return (
    <Snackbar
      key={feedback?.key}
      open={feedback?.open ?? false}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ '@media print': { display: 'none' } }}
    >
      <Alert
        severity={feedback?.severity ?? 'info'}
        variant="filled"
        onClose={onClose}
        sx={{ width: '100%', alignItems: 'center' }}
      >
        {feedback?.message}
      </Alert>
    </Snackbar>
  )
}
