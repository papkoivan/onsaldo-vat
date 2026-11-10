import { createPortal } from 'react-dom'
import Box from '@mui/material/Box'
import GlobalStyles from '@mui/material/GlobalStyles'
import type { RegisterType, VatDocument } from '@/domain/vat'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDocumentCount,
  formatNip,
  formatVatRate,
} from '@/utils/format'
import { calculateDocumentTotals } from '@/utils/vatCalculations'
import type { ActiveFilter } from '../types/filters'
import { KSEF_STATUS_LABELS } from '../utils/ksefStatus'
import { REGISTER_LABELS } from '../utils/registers'

interface PrintViewProps {
  companyName: string
  register: RegisterType
  documents: readonly VatDocument[]
  searchQuery: string
  filters: readonly ActiveFilter[]
  printedAt: Date
}

const COLUMNS = [
  'Lp.',
  'Kontrahent',
  'Daty',
  'Dokument',
  'KSeF',
  'Identyfikacja',
  'Stawki VAT',
  'Netto',
  'VAT',
  'Brutto',
] as const

const NUMERIC_COLUMNS = new Set<string>(['Netto', 'VAT', 'Brutto'])

// Black on white with hairline borders only, so the output reads the same in grayscale.
const printSx = {
  color: '#000',
  backgroundColor: '#fff',
  fontSize: '9pt',
  lineHeight: 1.35,
  '& h1': { m: 0, fontSize: '16pt', fontWeight: 700 },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '7.5pt',
  },
  '& th, & td': {
    border: '0.5pt solid #555',
    px: '4px',
    py: '3px',
    textAlign: 'left',
    verticalAlign: 'top',
    overflowWrap: 'anywhere',
  },
  '& th': { fontWeight: 700, backgroundColor: '#e6e6e6' },
  '& .num': {
    textAlign: 'right',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
  '& thead': { display: 'table-header-group' },
  '& tfoot': { display: 'table-row-group' },
  '& tr': { breakInside: 'avoid', pageBreakInside: 'avoid' },
  '& .nowrap': { whiteSpace: 'nowrap', overflowWrap: 'normal' },
  '& .muted': { color: '#444' },
} as const

function Cell({ label, children }: { label?: string; children: string }) {
  return (
    <div>
      {label && <span className="muted">{label}: </span>}
      {children}
    </div>
  )
}

function PrintRow({
  document,
  index,
}: {
  document: VatDocument
  index: number
}) {
  return (
    <tr>
      <td className="num nowrap">{index + 1}</td>
      <td>
        <strong>{document.contractor}</strong>
        <Cell label="NIP">{formatNip(document.nip)}</Cell>
      </td>
      <td className="nowrap">
        <Cell label="Wyst.">{formatDate(document.issueDate)}</Cell>
        <Cell label="Sprz.">{formatDate(document.saleDate)}</Cell>
      </td>
      <td>
        <strong className="nowrap">{document.documentNumber}</strong>
        <Cell label="Seria">{document.documentSeries}</Cell>
      </td>
      <td>
        <div>{document.ksefNumber ?? '—'}</div>
        <Cell label="Status">{KSEF_STATUS_LABELS[document.ksefStatus]}</Cell>
      </td>
      <td>
        <Cell label="ID">{document.identifier}</Cell>
        <Cell label="Operacja">{document.operationType}</Cell>
        <Cell label="JPK V7">{document.jpkCode ?? '—'}</Cell>
      </td>
      <td>
        {document.vatBreakdown.map((item) => (
          <div key={item.rate}>
            {formatVatRate(item.rate)}: {formatCurrency(item.netAmount)} /{' '}
            {formatCurrency(item.vatAmount)}
          </div>
        ))}
      </td>
      <td className="num">{formatCurrency(document.netAmount)}</td>
      <td className="num">{formatCurrency(document.vatAmount)}</td>
      <td className="num">
        <strong>{formatCurrency(document.grossAmount)}</strong>
      </td>
    </tr>
  )
}

export function PrintView({
  companyName,
  register,
  documents,
  searchQuery,
  filters,
  printedAt,
}: PrintViewProps) {
  const root = document.getElementById('print-root')
  if (!root) return null

  const totals = calculateDocumentTotals(documents)
  const scope = [
    ...filters.map((filter) => `${filter.label}: ${filter.valueLabel}`),
    ...(searchQuery ? [`Szukana fraza: „${searchQuery}”`] : []),
  ]

  return createPortal(
    <Box sx={printSx}>
      <GlobalStyles
        styles={{ '@page': { size: 'A4 landscape', margin: '12mm' } }}
      />
      <header>
        <Box sx={{ fontSize: '9pt' }} className="muted">
          {companyName}
        </Box>
        <h1>{REGISTER_LABELS[register]}</h1>
        <Box sx={{ mt: '4px' }}>
          Data wydruku: {formatDateTime(printedAt)} · Dokumenty:{' '}
          {formatDocumentCount(documents.length)}
        </Box>
        <Box sx={{ mt: '2px' }}>
          Zakres:{' '}
          {scope.length > 0
            ? scope.join(' · ')
            : 'wszystkie dokumenty rejestru'}
        </Box>
        <Box sx={{ mt: '2px', mb: '8px', fontWeight: 700 }}>
          Razem — netto: {formatCurrency(totals.netAmount)} · VAT:{' '}
          {formatCurrency(totals.vatAmount)} · brutto:{' '}
          {formatCurrency(totals.grossAmount)}
        </Box>
      </header>
      <table>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                className={NUMERIC_COLUMNS.has(column) ? 'num' : undefined}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents.map((document, index) => (
            <PrintRow key={document.id} document={document} index={index} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={7}>Razem ({formatDocumentCount(documents.length)})</th>
            <th className="num">{formatCurrency(totals.netAmount)}</th>
            <th className="num">{formatCurrency(totals.vatAmount)}</th>
            <th className="num">{formatCurrency(totals.grossAmount)}</th>
          </tr>
        </tfoot>
      </table>
      <Box className="muted" sx={{ mt: '8px', fontSize: '7.5pt' }}>
        Dane demonstracyjne (prototyp).
      </Box>
    </Box>,
    root,
  )
}
