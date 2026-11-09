import { useMemo } from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PercentOutlined from '@mui/icons-material/PercentOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { VatBreakdownItem } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import { formatCurrency, formatPercent, formatVatRate } from '@/utils/format'
import { buildBreakdownRows, calculateTotals } from '@/utils/vatCalculations'

interface VatRateBreakdownProps {
  items: readonly VatBreakdownItem[]
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

export function VatRateBreakdown({ items }: VatRateBreakdownProps) {
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
      <AccordionDetails
        id="vat-rate-breakdown-content"
        sx={{ px: { xs: 1, md: 2 }, pt: 0, pb: 2 }}
      >
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
                  sx={{ ...headCellSx, borderTopRightRadius: 8, minWidth: 200 }}
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
      </AccordionDetails>
    </Accordion>
  )
}
