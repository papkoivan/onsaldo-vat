import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import type { VatDocument } from '@/domain/vat'
import { formatDate } from '@/utils/format'
import type { ColumnKey } from '../../types/columns'
import { KsefStatusChip } from '../KsefStatusChip'
import {
  WIDE_DESKTOP,
  desktopOnlyCellSx,
  truncatedTextSx,
} from '../tableStyles'

export interface TableColumn {
  key: ColumnKey
  label: string
  /** Hidden below the `xl` breakpoint; its data stays available in the expanded row. */
  desktopOnly: boolean
  cellSx?: object
  render: (document: VatDocument) => ReactNode
}

export const TABLE_COLUMNS: Readonly<Record<ColumnKey, TableColumn>> = {
  contractor: {
    key: 'contractor',
    label: 'Kontrahent',
    desktopOnly: false,
    cellSx: { maxWidth: { xs: 200, lg: 260 }, fontWeight: 600 },
    render: ({ contractor }) => (
      <Box sx={truncatedTextSx} title={contractor}>
        {contractor}
      </Box>
    ),
  },
  issueDate: {
    key: 'issueDate',
    label: 'Data',
    desktopOnly: false,
    cellSx: { whiteSpace: 'nowrap' },
    render: ({ issueDate }) => formatDate(issueDate),
  },
  documentNumber: {
    key: 'documentNumber',
    label: 'Numer dokumentu',
    desktopOnly: false,
    cellSx: { whiteSpace: 'nowrap' },
    render: ({ documentNumber }) => documentNumber,
  },
  ksefNumber: {
    key: 'ksefNumber',
    label: 'Numer KSeF',
    desktopOnly: true,
    cellSx: {
      ...desktopOnlyCellSx,
      maxWidth: 240,
      [WIDE_DESKTOP]: { maxWidth: 300 },
    },
    render: ({ ksefNumber, ksefStatus }) =>
      ksefNumber ? (
        <Box sx={truncatedTextSx} title={ksefNumber}>
          {ksefNumber}
        </Box>
      ) : (
        <KsefStatusChip status={ksefStatus} />
      ),
  },
  identifier: {
    key: 'identifier',
    label: 'Identyfikator',
    desktopOnly: true,
    cellSx: { ...desktopOnlyCellSx, whiteSpace: 'nowrap' },
    render: ({ identifier }) => identifier,
  },
}
