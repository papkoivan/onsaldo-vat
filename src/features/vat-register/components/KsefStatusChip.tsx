import type { ReactElement } from 'react'
import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined'
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined'
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined'
import Chip from '@mui/material/Chip'
import type { KsefStatus } from '@/domain/vat'
import { colors } from '@/theme/tokens'

interface KsefStatusChipProps {
  status: KsefStatus
}

interface StatusAppearance {
  label: string
  icon: ReactElement
  color: string
  background: string
  border: string
}

const appearance: Record<KsefStatus, StatusAppearance> = {
  confirmed: {
    label: 'Potwierdzony',
    icon: <CheckCircleOutlineOutlined />,
    color: colors.successText,
    background: colors.successBg,
    border: colors.successBorder,
  },
  pending: {
    label: 'Brak potwierdzenia',
    icon: <ScheduleOutlined />,
    color: colors.warningText,
    background: colors.warningBg,
    border: colors.warningBorder,
  },
  rejected: {
    label: 'Odrzucony',
    icon: <ErrorOutlineOutlined />,
    color: colors.errorText,
    background: colors.errorBg,
    border: colors.errorBorder,
  },
}

export function KsefStatusChip({ status }: KsefStatusChipProps) {
  const { label, icon, color, background, border } = appearance[status]

  return (
    <Chip
      size="small"
      label={label}
      icon={icon}
      sx={{
        height: 24,
        fontWeight: 600,
        color,
        backgroundColor: background,
        border: `1px solid ${border}`,
        '& .MuiChip-icon': { color, fontSize: 16 },
      }}
    />
  )
}
