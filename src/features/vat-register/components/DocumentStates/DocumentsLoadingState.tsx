import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { colors } from '@/theme/tokens'
import { visuallyHiddenSx } from '@/utils/a11y'
import { DEFAULT_PAGE_SIZE } from '../../hooks/usePagination'
import { DEFAULT_SORT } from '../../types/sort'
import { DocumentsTableHead } from '../DocumentsTable/DocumentsTableHead'
import { tableContainerSx, tableSx } from '../DocumentsTable/tableLayout'
import { desktopOnlyCellSx } from '../tableStyles'

interface DocumentsLoadingStateProps {
  layout: 'table' | 'cards'
}

const ROWS = Array.from({ length: DEFAULT_PAGE_SIZE }, (_, index) => index)
const noop = () => undefined

function TextSkeleton({ width }: { width: number | string }) {
  return <Skeleton variant="text" width={width} sx={{ maxWidth: '100%' }} />
}

function TableSkeleton() {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small" sx={tableSx}>
        <DocumentsTableHead disabled sort={DEFAULT_SORT} onSortChange={noop} />
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row} sx={{ height: 52 }}>
              <TableCell>
                <TextSkeleton width={120} />
              </TableCell>
              <TableCell>
                <TextSkeleton width={76} />
              </TableCell>
              <TableCell>
                <TextSkeleton width={116} />
              </TableCell>
              <TableCell sx={desktopOnlyCellSx}>
                <TextSkeleton width={230} />
              </TableCell>
              <TableCell sx={desktopOnlyCellSx}>
                <TextSkeleton width={96} />
              </TableCell>
              <TableCell padding="checkbox">
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ m: '8px' }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function CardsSkeleton() {
  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      {ROWS.map((row) => (
        <Box
          key={row}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 44px',
            alignItems: 'start',
            columnGap: 0.5,
            rowGap: 0.5,
            p: 1,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ pt: 0.75, minWidth: 0 }}>
            <Skeleton variant="text" width="60%" sx={{ fontSize: '1rem' }} />
            <TextSkeleton width={140} />
            <TextSkeleton width={80} />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ m: '10px' }}
          />
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              px: 1,
              pb: 0.75,
            }}
          >
            <Skeleton
              variant="rounded"
              width={110}
              height={24}
              sx={{ borderRadius: '12px' }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export function DocumentsLoadingState({ layout }: DocumentsLoadingStateProps) {
  return (
    <div>
      <Box role="status" sx={visuallyHiddenSx}>
        Ładowanie dokumentów…
      </Box>
      <Box aria-hidden>
        {layout === 'table' ? <TableSkeleton /> : <CardsSkeleton />}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1.5,
          }}
        >
          <Skeleton variant="text" width={72} />
          <Skeleton variant="rounded" width={140} height={36} />
        </Box>
      </Box>
    </div>
  )
}
