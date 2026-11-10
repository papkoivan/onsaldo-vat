import type { ReactNode } from 'react'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Alert from '@mui/material/Alert'

interface VatConfirmationNoticeProps {
  children: ReactNode
}

export function VatConfirmationNotice({
  children,
}: VatConfirmationNoticeProps) {
  return (
    <Alert
      severity="warning"
      role="status"
      icon={<InfoOutlined fontSize="small" />}
      sx={{ alignItems: 'center', py: 0.25, borderRadius: '10px' }}
    >
      {children}
    </Alert>
  )
}
