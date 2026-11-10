import DragIndicator from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { colors } from '@/theme/tokens'
import { visuallyHiddenSx } from '@/utils/a11y'
import type { DocumentSort, SortKey } from '../../types/sort'
import { desktopOnlyCellSx } from '../tableStyles'
import type { TableColumn } from './columns'

interface DocumentsTableHeadProps {
  columns: readonly TableColumn[]
  /** Hidden columns are not reorderable, so they get no drag handle. */
  reorderableKeys: ReadonlySet<TableColumn['key']>
  disabled?: boolean
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
}

const headCellSx = {
  py: 1,
  whiteSpace: 'nowrap',
  backgroundColor: colors.surfaceMuted,
} as const

const DIRECTION_TEXT = {
  asc: 'posortowano rosnąco',
  desc: 'posortowano malejąco',
} as const

interface HeadCellProps {
  column: TableColumn
  reorderable: boolean
  disabled: boolean
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
}

function HeadCell({
  column,
  reorderable,
  disabled,
  sort,
  onSortChange,
}: HeadCellProps) {
  const { key, label, desktopOnly } = column
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: key, disabled: !reorderable || disabled })
  const active = sort.key === key

  return (
    <TableCell
      ref={setNodeRef}
      sortDirection={active ? sort.direction : false}
      sx={{
        ...headCellSx,
        ...(desktopOnly ? desktopOnlyCellSx : {}),
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        boxShadow: isDragging ? '0 2px 8px rgba(20, 33, 28, 0.2)' : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TableSortLabel
          active={active}
          direction={active ? sort.direction : 'asc'}
          disabled={disabled}
          onClick={() => onSortChange(key)}
        >
          {label}
          {active && (
            <Box component="span" sx={visuallyHiddenSx}>
              , {DIRECTION_TEXT[sort.direction]}
            </Box>
          )}
        </TableSortLabel>
        {reorderable && (
          <Tooltip title="Przeciągnij, aby zmienić kolejność kolumn">
            <span>
              <IconButton
                ref={setActivatorNodeRef}
                size="small"
                disabled={disabled}
                aria-label={`Przesuń kolumnę ${label}`}
                {...attributes}
                {...listeners}
                sx={{
                  p: 0.25,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                  color: 'text.secondary',
                }}
              >
                <DragIndicator fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </TableCell>
  )
}

export function DocumentsTableHead({
  columns,
  reorderableKeys,
  disabled = false,
  sort,
  onSortChange,
}: DocumentsTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <HeadCell
            key={column.key}
            column={column}
            reorderable={reorderableKeys.has(column.key)}
            disabled={disabled}
            sort={sort}
            onSortChange={onSortChange}
          />
        ))}
        <TableCell padding="checkbox" sx={headCellSx}>
          <Box component="span" sx={visuallyHiddenSx}>
            Szczegóły
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}
