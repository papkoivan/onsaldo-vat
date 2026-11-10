import { useMemo } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import type { VatBreakdownItem } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { visuallyHiddenSx } from '@/utils/a11y'
import { formatCurrency, formatVatRate } from '@/utils/format'
import { buildBreakdownRows } from '@/utils/vatCalculations'
import type { DataStatus } from '../types/viewState'

interface VatRateBreakdownProps {
  items: readonly VatBreakdownItem[]
  status: DataStatus
}

const TITLE = 'Kwoty według stawek VAT'

const rowSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(36px, 48px) minmax(0, 1fr) minmax(88px, auto)',
  alignItems: 'center',
  columnGap: { xs: 1.5, md: 2 },
} as const

function BreakdownLoading() {
  return (
    <Box>
      <Box role="status" sx={visuallyHiddenSx}>
        Ładowanie kwot według stawek VAT…
      </Box>
      <Box aria-hidden sx={{ display: 'grid', gap: 1.5 }}>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={24} />
        ))}
      </Box>
    </Box>
  )
}

function BreakdownUnavailable() {
  return (
    <Typography color="text.secondary">
      Kwoty według stawek VAT są niedostępne, ponieważ nie udało się załadować
      dokumentów.
    </Typography>
  )
}

export function VatRateBreakdown({ items, status }: VatRateBreakdownProps) {
  const rows = useMemo(() => buildBreakdownRows(items), [items])

  return (
    <Accordion slotProps={{ heading: { component: 'h2' } }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="vat-rate-breakdown-content"
        id="vat-rate-breakdown-header"
        slotProps={{
          content: {
            sx: { flexWrap: 'wrap', alignItems: 'baseline', columnGap: 1 },
          },
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{TITLE}</Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          VAT · DEMO
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {status === 'loading' ? (
          <BreakdownLoading />
        ) : status === 'unavailable' ? (
          <BreakdownUnavailable />
        ) : (
          <Box
            component="ul"
            aria-label={TITLE}
            sx={{ display: 'grid', gap: 1.5, m: 0, p: 0, listStyle: 'none' }}
          >
            {rows.map((row) => {
              const rate = formatVatRate(row.rate)
              return (
                <Box component="li" key={row.rate} sx={rowSx}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {rate}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={row.share * 100}
                    aria-label={`Udział stawki ${rate} w kwocie VAT`}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: colors.border,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Box component="span" sx={visuallyHiddenSx}>
                      VAT:{' '}
                    </Box>
                    {formatCurrency(row.vatAmount)}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
