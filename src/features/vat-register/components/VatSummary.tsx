import CalculateOutlined from '@mui/icons-material/CalculateOutlined'
import PaidOutlined from '@mui/icons-material/PaidOutlined'
import PercentOutlined from '@mui/icons-material/PercentOutlined'
import Box from '@mui/material/Box'
import type { VatTotals } from '@/domain/vat'
import { SummaryCard } from './SummaryCard'

interface VatSummaryProps {
  totals: VatTotals
}

export function VatSummary({ totals }: VatSummaryProps) {
  return (
    <Box
      component="section"
      aria-label="Podsumowanie finansowe"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, minmax(0, 1fr))',
        },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      <SummaryCard
        label="Netto"
        value={totals.netAmount}
        icon={<PaidOutlined />}
      />
      <SummaryCard
        label="VAT"
        value={totals.vatAmount}
        icon={<PercentOutlined />}
      />
      <SummaryCard
        label="Brutto"
        value={totals.grossAmount}
        icon={<CalculateOutlined />}
      />
    </Box>
  )
}
