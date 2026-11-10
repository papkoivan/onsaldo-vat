import type { ReactElement } from 'react'
import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined'
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import Chip from '@mui/material/Chip'
import type { KsefStatus } from '@/domain/vat'
import { KSEF_STATUS_LABELS } from '../utils/ksefStatus'

interface KsefStatusChipProps {
  status: KsefStatus
}

interface StatusAppearance {
  label: string
  icon: ReactElement
  color: 'success' | 'warning' | 'error'
}

const appearance: Record<KsefStatus, StatusAppearance> = {
  confirmed: {
    label: KSEF_STATUS_LABELS.confirmed,
    icon: <CheckCircleOutlineOutlined />,
    color: 'success',
  },
  pending: {
    label: KSEF_STATUS_LABELS.pending,
    icon: <ScheduleOutlined />,
    color: 'warning',
  },
  rejected: {
    label: KSEF_STATUS_LABELS.rejected,
    icon: <ErrorOutlineOutlined />,
    color: 'error',
  },
}

export function KsefStatusChip({ status }: KsefStatusChipProps) {
  const { label, icon, color } = appearance[status]

  return (
    <Chip
      size="small"
      color={color}
      label={label}
      icon={icon}
      sx={{ '& .MuiChip-icon': { fontSize: 16 } }}
    />
  )
}
