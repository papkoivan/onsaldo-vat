import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import type { RegisterType } from '@/domain/vat'
import { REGISTER_LABELS } from '../../utils/registers'
import { StatePanel } from './StatePanel'

export function EmptyRegisterState({ register }: { register: RegisterType }) {
  return (
    <StatePanel
      role="status"
      tone="primary"
      icon={<DescriptionOutlined />}
      title="Brak dokumentów"
    >
      {REGISTER_LABELS[register]} nie zawiera obecnie żadnych dokumentów.
    </StatePanel>
  )
}
