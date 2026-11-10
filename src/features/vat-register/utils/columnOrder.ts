import { arrayMove } from '@dnd-kit/sortable'
import type { ColumnKey } from '../types/columns'

/** Puts `active` at the position currently held by `over`; unknown keys leave the order untouched. */
export function moveColumn(
  order: readonly ColumnKey[],
  active: ColumnKey,
  over: ColumnKey,
): readonly ColumnKey[] {
  const from = order.indexOf(active)
  const to = order.indexOf(over)
  if (from === -1 || to === -1 || from === to) return order
  return arrayMove([...order], from, to)
}
