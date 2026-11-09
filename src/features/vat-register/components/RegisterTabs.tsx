import type { ReactElement, SyntheticEvent } from 'react'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import type { RegisterType } from '@/domain/vat'

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
  const handleChange = (_event: SyntheticEvent, next: RegisterType) =>
    onChange(next)

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="Rejestr VAT"
      variant="scrollable"
      scrollButtons={false}
    >
      {registerTabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          icon={tab.icon}
          iconPosition="start"
        />
      ))}
    </Tabs>
  )
}
