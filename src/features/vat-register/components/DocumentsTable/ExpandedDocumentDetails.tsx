import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { VatDocument } from '@/domain/vat'
import { colors } from '@/theme/tokens'
import {
  formatCurrency,
  formatDate,
  formatNip,
  formatVatRate,
} from '@/utils/format'
import { KsefStatusChip } from './KsefStatusChip'
import { numericCellSx } from './tableStyles'

interface ExpandedDocumentDetailsProps {
  document: VatDocument
  id: string
}

interface DetailSectionProps {
  title: string
  children: ReactNode
}

interface DetailRowProps {
  label: string
  children: ReactNode
  numeric?: boolean
  emphasized?: boolean
}

const EMPTY_VALUE = '—'

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Box
      component="section"
      sx={{
        minWidth: 0,
        p: 2,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography
        variant="subtitle2"
        component="h3"
        sx={{ fontWeight: 700, mb: 1.5 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function DetailList({ children }: { children: ReactNode }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', rowGap: 1 }}>
      {children}
    </Box>
  )
}

function DetailRow({
  label,
  children,
  numeric = false,
  emphasized = false,
}: DetailRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(96px, 40%) minmax(0, 1fr)',
        columnGap: 1.5,
        alignItems: 'center',
      }}
    >
      <Typography
        component="dt"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        sx={{
          m: 0,
          overflowWrap: 'anywhere',
          fontWeight: emphasized ? 700 : 500,
          ...(numeric && numericCellSx),
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

const compactHeadCellSx = {
  px: 0,
  py: 0.5,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'text.secondary',
} as const

const compactBodyCellSx = { px: 0, py: 0.5, fontSize: '0.8125rem' } as const

export function ExpandedDocumentDetails({
  document,
  id,
}: ExpandedDocumentDetailsProps) {
  return (
    <Box
      id={id}
      role="region"
      aria-label={`Szczegóły dokumentu ${document.documentNumber}`}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
        p: 2,
        backgroundColor: colors.surfaceMuted,
      }}
    >
      <DetailSection title="Informacje o dokumencie">
        <DetailList>
          <DetailRow label="Kontrahent">{document.contractor}</DetailRow>
          <DetailRow label="NIP">{formatNip(document.nip)}</DetailRow>
          <DetailRow label="Data wystawienia">
            {formatDate(document.issueDate)}
          </DetailRow>
          <DetailRow label="Data sprzedaży">
            {formatDate(document.saleDate)}
          </DetailRow>
          <DetailRow label="Numer dokumentu">
            {document.documentNumber}
          </DetailRow>
          <DetailRow label="Rodzaj operacji">
            {document.operationType}
          </DetailRow>
          <DetailRow label="Kod JPK V7">
            {document.jpkCode ?? EMPTY_VALUE}
          </DetailRow>
          <DetailRow label="Seria dokumentu">
            {document.documentSeries}
          </DetailRow>
        </DetailList>
      </DetailSection>

      <DetailSection title="Informacje finansowe">
        <DetailList>
          <DetailRow label="Netto" numeric>
            {formatCurrency(document.netAmount)}
          </DetailRow>
          <DetailRow label="VAT" numeric>
            {formatCurrency(document.vatAmount)}
          </DetailRow>
          <DetailRow label="Brutto" numeric emphasized>
            {formatCurrency(document.grossAmount)}
          </DetailRow>
        </DetailList>
        <Table
          size="small"
          aria-label="Kwoty według stawek VAT"
          sx={{ mt: 1.5, '& td, & th': { borderColor: colors.border } }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={compactHeadCellSx}>Stawka</TableCell>
              <TableCell sx={{ ...compactHeadCellSx, ...numericCellSx }}>
                Netto
              </TableCell>
              <TableCell sx={{ ...compactHeadCellSx, ...numericCellSx }}>
                VAT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {document.vatBreakdown.map((item) => (
              <TableRow
                key={item.rate}
                sx={{ '&:last-child > *': { borderBottom: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ ...compactBodyCellSx, fontWeight: 500 }}
                >
                  {formatVatRate(item.rate)}
                </TableCell>
                <TableCell sx={{ ...compactBodyCellSx, ...numericCellSx }}>
                  {formatCurrency(item.netAmount)}
                </TableCell>
                <TableCell sx={{ ...compactBodyCellSx, ...numericCellSx }}>
                  {formatCurrency(item.vatAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DetailSection>

      <DetailSection title="Informacje dodatkowe">
        <DetailList>
          <DetailRow label="Numer KSeF">
            {document.ksefNumber ?? EMPTY_VALUE}
          </DetailRow>
          <DetailRow label="Status KSeF">
            <KsefStatusChip status={document.ksefStatus} />
          </DetailRow>
          <DetailRow label="Identyfikator">{document.identifier}</DetailRow>
        </DetailList>
      </DetailSection>
    </Box>
  )
}
