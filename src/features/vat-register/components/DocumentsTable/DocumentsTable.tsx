import { useMemo } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type {
  Announcements,
  DragEndEvent,
  Modifier,
  ScreenReaderInstructions,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import type { VatDocument } from '@/domain/vat'
import type { ColumnKey } from '../../types/columns'
import type { DocumentSort, SortKey } from '../../types/sort'
import { useViewportDown } from '../../hooks/useViewportDown'
import { DocumentTableRow } from './DocumentTableRow'
import { DocumentsTableHead } from './DocumentsTableHead'
import { TABLE_COLUMNS } from './columns'
import { tableContainerSx, tableSx } from './tableLayout'

interface DocumentsTableProps {
  documents: readonly VatDocument[]
  columnOrder: readonly ColumnKey[]
  onColumnMove: (active: ColumnKey, over: ColumnKey) => void
  expandedIds: ReadonlySet<string>
  onToggleExpand: (id: string) => void
  sort: DocumentSort
  onSortChange: (key: SortKey) => void
}

const restrictToHorizontalAxis: Modifier = ({ transform }) => ({
  ...transform,
  y: 0,
})

const label = (id: string | number): string =>
  TABLE_COLUMNS[id as ColumnKey]?.label ?? String(id)

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'Aby zmienić kolejność kolumny, naciśnij spację, a następnie użyj strzałek w lewo i w prawo. Spacja zatwierdza nową pozycję, Escape anuluje.',
}

const announcements: Announcements = {
  onDragStart: ({ active }) => `Podniesiono kolumnę ${label(active.id)}.`,
  onDragOver: ({ active, over }) =>
    over
      ? `Kolumna ${label(active.id)} znajduje się nad kolumną ${label(over.id)}.`
      : undefined,
  onDragEnd: ({ active, over }) =>
    over
      ? `Kolumnę ${label(active.id)} przeniesiono na pozycję kolumny ${label(over.id)}.`
      : `Kolumna ${label(active.id)} pozostała na miejscu.`,
  onDragCancel: ({ active }) =>
    `Anulowano przenoszenie kolumny ${label(active.id)}.`,
}

export function DocumentsTable({
  documents,
  columnOrder,
  onColumnMove,
  expandedIds,
  onToggleExpand,
  sort,
  onSortChange,
}: DocumentsTableProps) {
  const compact = useViewportDown('xl')
  const columns = useMemo(
    () => columnOrder.map((key) => TABLE_COLUMNS[key]),
    [columnOrder],
  )
  // columns hidden on narrower screens have no layout box, so they cannot be drop targets
  const reorderableKeys = useMemo(
    () =>
      columns
        .filter((column) => !(compact && column.desktopOnly))
        .map((column) => column.key),
    [columns, compact],
  )
  const reorderableKeySet = useMemo(
    () => new Set(reorderableKeys),
    [reorderableKeys],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onColumnMove(active.id as ColumnKey, over.id as ColumnKey)
    }
  }

  return (
    <TableContainer component={Paper} variant="card" sx={tableContainerSx}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        accessibility={{ screenReaderInstructions, announcements }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={reorderableKeys}
          strategy={horizontalListSortingStrategy}
        >
          <Table size="small" aria-label="Dokumenty rejestru VAT" sx={tableSx}>
            <DocumentsTableHead
              columns={columns}
              reorderableKeys={reorderableKeySet}
              sort={sort}
              onSortChange={onSortChange}
            />
            <TableBody>
              {documents.map((document) => (
                <DocumentTableRow
                  key={document.id}
                  document={document}
                  columns={columns}
                  expanded={expandedIds.has(document.id)}
                  onToggleExpand={onToggleExpand}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </TableContainer>
  )
}
