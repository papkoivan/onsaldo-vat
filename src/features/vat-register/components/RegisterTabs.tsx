import type { ReactElement, SyntheticEvent } from 'react'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { RegisterType } from '@/domain/vat'
import { useViewportDown } from '../hooks/useViewportDown'

interface RegisterTabsProps {
  value: RegisterType
  onChange: (register: RegisterType) => void
}

interface RegisterTabConfig {
  value: RegisterType
  label: string
  icon: ReactElement
}

const registerTabs: readonly RegisterTabConfig[] = [
  {
    value: 'sales',
    label: 'Rejestr VAT sprzedaży',
    icon: <ReceiptLongOutlined />,
  },
  {
    value: 'purchases',
    label: 'Rejestr VAT zakupów',
    icon: <ShoppingCartOutlined />,
  },
]

export function RegisterTabs({ value, onChange }: RegisterTabsProps) {
  // two long labels cannot share a 320px row with icons, so phones get equal-width text-only tabs
  const compact = useViewportDown('sm')
  const handleChange = (_event: SyntheticEvent, next: RegisterType) =>
    onChange(next)

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="Rejestr VAT"
      variant={compact ? 'fullWidth' : 'scrollable'}
      scrollButtons={false}
    >
      {registerTabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          icon={compact ? undefined : tab.icon}
          iconPosition="start"
          sx={{
            px: { xs: 1, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            lineHeight: 1.25,
          }}
        />
      ))}
    </Tabs>
  )
}
