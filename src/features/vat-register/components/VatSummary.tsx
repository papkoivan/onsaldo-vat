import CalculateOutlined from '@mui/icons-material/CalculateOutlined'
import PaidOutlined from '@mui/icons-material/PaidOutlined'
import PercentOutlined from '@mui/icons-material/PercentOutlined'
import Box from '@mui/material/Box'
import type { VatTotals } from '@/domain/vat'
import type { DataStatus } from '../types/viewState'
import { SummaryCard } from './SummaryCard'

interface VatSummaryProps {
  totals: VatTotals
  status: DataStatus
}

export function VatSummary({ totals, status }: VatSummaryProps) {
  return (
    <Box
      component="section"
      aria-label="Podsumowanie finansowe"
      aria-busy={status === 'loading'}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        gap: { xs: 1, md: 2 },
        // two-column phone layout: Brutto gets its own full-width row
        '& > :nth-of-type(3)': { gridColumn: { sm: '1 / -1', md: 'auto' } },
      }}
    >
      <SummaryCard
        label="Netto"
        value={totals.netAmount}
        icon={<PaidOutlined />}
        status={status}
      />
      <SummaryCard
        label="VAT"
        value={totals.vatAmount}
        icon={<PercentOutlined />}
        status={status}
      />
      <SummaryCard
        label="Brutto"
        value={totals.grossAmount}
        icon={<CalculateOutlined />}
        status={status}
      />
    </Box>
  )
}
