import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { formatDocumentCountGenitive } from '@/utils/format'
import type { BulkTagAction } from '../hooks/useBulkTagging'
import { getTag } from '../utils/tags'

interface BulkActionConfirmDialogProps {
  open: boolean
  action: BulkTagAction | null
  documentCount: number
  onConfirm: () => void
  onCancel: () => void
}

const TITLE_ID = 'bulk-action-dialog-title'
const DESCRIPTION_ID = 'bulk-action-dialog-description'

export function BulkActionConfirmDialog({
  open,
  action,
  documentCount,
  onConfirm,
  onCancel,
}: BulkActionConfirmDialogProps) {
  const isRemoval = action?.type === 'remove'
  const label = action ? getTag(action.tagId).label : ''
  const count = formatDocumentCountGenitive(documentCount)

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      sx={{ '& .MuiDialog-paper': { mx: 2, width: 'calc(100% - 32px)' } }}
    >
      <DialogTitle id={TITLE_ID}>
        {isRemoval ? 'Usunąć oznaczenie' : 'Dodać oznaczenie'} „{label}”?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={DESCRIPTION_ID}>
          {isRemoval
            ? `Oznaczenie zostanie usunięte z ${count}.`
            : `Oznaczenie zostanie dodane do ${count}.`}{' '}
          Zmiana dotyczy wyłącznie lokalnych danych demonstracyjnych — dane
          księgowe dokumentów pozostaną bez zmian.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          color="inherit"
          onClick={onCancel}
          autoFocus={isRemoval}
          sx={{ minHeight: 44 }}
        >
          Anuluj
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          autoFocus={!isRemoval}
          sx={{ minHeight: 44 }}
        >
          {isRemoval ? 'Usuń oznaczenie' : 'Dodaj oznaczenie'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
