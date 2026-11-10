import { useMemo } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PercentOutlined from '@mui/icons-material/PercentOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { VatBreakdownItem, VatBreakdownRow, VatTotals } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { formatCurrency, formatPercent, formatVatRate } from '@/utils/format'
import { buildBreakdownRows, calculateTotals } from '@/utils/vatCalculations'
import { visuallyHiddenSx } from '@/utils/a11y'
import type { DataStatus } from '../types/viewState'
import { useViewportDown } from '../hooks/useViewportDown'

interface VatRateBreakdownProps {
  items: readonly VatBreakdownItem[]
  status: DataStatus
}

const numericCellSx = {
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const

const headCellSx = {
  py: 1,
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'text.secondary',
  backgroundColor: colors.surfaceMuted,
  borderBottom: 'none',
} as const

function AmountPair({ net, vat }: { net: number; vat: number }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        columnGap: 2,
      }}
    >
      {[
        ['Netto', net],
        ['VAT', vat],
      ].map(([label, value]) => (
        <Box key={label} sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
          >
            {formatCurrency(Number(value))}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/** Phone layout: one block per VAT rate instead of a four-column table. */
function BreakdownList({
  rows,
  totals,
}: {
  rows: readonly VatBreakdownRow[]
  totals: VatTotals
}) {
  return (
    <Box
      component="ul"
      aria-label="Kwoty według stawek VAT"
      sx={{ display: 'grid', gap: 1.5, m: 0, p: 0, listStyle: 'none' }}
    >
      {rows.map((row) => (
        <Box
          component="li"
          key={row.rate}
          sx={{
            p: 1.5,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Stawka {formatVatRate(row.rate)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatPercent(row.share)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={row.share * 100}
            aria-label={`Udział stawki ${formatVatRate(row.rate)}`}
            sx={{
              height: 8,
              my: 1,
              borderRadius: 4,
              backgroundColor: colors.surfaceMuted,
            }}
          />
          <AmountPair net={row.netAmount} vat={row.vatAmount} />
        </Box>
      ))}
      <Box
        component="li"
        sx={{
          p: 1.5,
          borderRadius: '8px',
          backgroundColor: colors.primaryLight,
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Razem</Typography>
        <AmountPair net={totals.netAmount} vat={totals.vatAmount} />
      </Box>
    </Box>
  )
}

function BreakdownLoading() {
  return (
    <Box>
      <Box role="status" sx={visuallyHiddenSx}>
        Ładowanie kwot według stawek VAT…
      </Box>
      <Box aria-hidden sx={{ display: 'grid', gap: 1 }}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={36} />
        ))}
      </Box>
    </Box>
  )
}

function BreakdownUnavailable() {
  return (
    <Typography color="text.secondary" sx={{ px: 1, py: 2 }}>
      Kwoty według stawek VAT są niedostępne, ponieważ nie udało się załadować
      dokumentów.
    </Typography>
  )
}

export function VatRateBreakdown({ items, status }: VatRateBreakdownProps) {
  const compact = useViewportDown('sm')
  const rows = useMemo(() => buildBreakdownRows(items), [items])
  const totals = useMemo(() => calculateTotals(items), [items])

  return (
    <Accordion
      disableGutters
      elevation={0}
      square={false}
      slotProps={{ heading: { component: 'h2' } }}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: '12px !important',
        backgroundColor: 'background.paper',
        '&::before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="vat-rate-breakdown-content"
        id="vat-rate-breakdown-header"
        sx={{ minHeight: 52, px: { xs: 2, md: 2.5 } }}
      >
        <PercentOutlined
          fontSize="small"
          sx={{ color: 'primary.main', mr: 1.25 }}
        />
        <Typography sx={{ fontWeight: 600 }}>
          Kwoty według stawek VAT
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 1, md: 2 }, pt: 0, pb: 2 }}>
        {status === 'loading' ? (
          <BreakdownLoading />
        ) : status === 'unavailable' ? (
          <BreakdownUnavailable />
        ) : compact ? (
          <BreakdownList rows={rows} totals={totals} />
        ) : (
          <TableContainer>
            <Table size="small" aria-label="Kwoty według stawek VAT">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, borderTopLeftRadius: 8 }}>
                    Stawka VAT
                  </TableCell>
                  <TableCell sx={{ ...headCellSx, ...numericCellSx }}>
                    Netto
                  </TableCell>
                  <TableCell sx={{ ...headCellSx, ...numericCellSx }}>
                    VAT
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headCellSx,
                      borderTopRightRadius: 8,
                      minWidth: 200,
                    }}
                  >
                    Udział
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.rate}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: 500 }}
                    >
                      {formatVatRate(row.rate)}
                    </TableCell>
                    <TableCell sx={numericCellSx}>
                      {formatCurrency(row.netAmount)}
                    </TableCell>
                    <TableCell sx={numericCellSx}>
                      {formatCurrency(row.vatAmount)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={row.share * 100}
                          aria-label={`Udział stawki ${formatVatRate(row.rate)}`}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.surfaceMuted,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            width: 56,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatPercent(row.share)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow sx={{ backgroundColor: colors.primaryLight }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: 'none',
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    Razem
                  </TableCell>
                  <TableCell
                    sx={{
                      ...numericCellSx,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: 'none',
                    }}
                  >
                    {formatCurrency(totals.netAmount)}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...numericCellSx,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      borderBottom: 'none',
                    }}
                  >
                    {formatCurrency(totals.vatAmount)}
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: 'none', borderBottomRightRadius: 8 }}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
