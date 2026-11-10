import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useViewportDown } from '../hooks/useViewportDown'
import { PAGE_SIZE_OPTIONS } from '../hooks/usePagination'
import type { PaginationState } from '../hooks/usePagination'
import { OutlinedIconButton } from './OutlinedIconButton'

interface DocumentsPaginationProps {
  pagination: PaginationState
}

const PAGINATION_LABELS = {
  first: 'Pierwsza strona',
  last: 'Ostatnia strona',
  next: 'Następna strona',
  previous: 'Poprzednia strona',
} as const

function getPaginationItemLabel(
  type:
    | 'page'
    | 'first'
    | 'last'
    | 'next'
    | 'previous'
    | 'start-ellipsis'
    | 'end-ellipsis',
  page: number | null,
  selected: boolean,
): string {
  if (type === 'page')
    return `${selected ? 'Strona' : 'Przejdź do strony'} ${page}`
  if (type === 'start-ellipsis' || type === 'end-ellipsis')
    return 'Więcej stron'
  return PAGINATION_LABELS[type]
}

const PAGE_SIZE_LABEL_ID = 'documents-page-size-label'

export function DocumentsPagination({ pagination }: DocumentsPaginationProps) {
  const compact = useViewportDown('md')
  const {
    page,
    pageCount,
    pageSize,
    totalCount,
    rangeStart,
    rangeEnd,
    setPage,
    setPageSize,
  } = pagination

  if (totalCount === 0) return null

  return (
    <Box
      component="nav"
      aria-label="Paginacja dokumentów"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 2,
        rowGap: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', md: 'flex-start' },
          gap: 2,
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          role="status"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {rangeStart}–{rangeEnd} z {totalCount}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            id={PAGE_SIZE_LABEL_ID}
            variant="body2"
            color="text.secondary"
          >
            Na stronie
          </Typography>
          <Select
            size="small"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            labelId={PAGE_SIZE_LABEL_ID}
            sx={{
              height: { xs: 44, md: 36 },
              backgroundColor: 'background.paper',
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {compact ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Tooltip title="Poprzednia strona">
            <span>
              <OutlinedIconButton
                aria-label="Poprzednia strona"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft />
              </OutlinedIconButton>
            </span>
          </Tooltip>
          <Typography
            variant="body2"
            aria-live="polite"
            sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
          >
            Strona {page} z {pageCount}
          </Typography>
          <Tooltip title="Następna strona">
            <span>
              <OutlinedIconButton
                aria-label="Następna strona"
                disabled={page >= pageCount}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight />
              </OutlinedIconButton>
            </span>
          </Tooltip>
        </Box>
      ) : (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_event, next) => setPage(next)}
          shape="rounded"
          getItemAriaLabel={getPaginationItemLabel}
          color="primary"
        />
      )}
    </Box>
  )
}
