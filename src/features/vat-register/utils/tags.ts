import { colors } from '@/theme/tokens'
import type {
  DocumentTag,
  DocumentTagAssignments,
  DocumentTagId,
} from '../types/tags'

export const DOCUMENT_TAGS: readonly DocumentTag[] = [
  {
    id: 'review',
    label: 'Do sprawdzenia',
    color: colors.infoText,
    background: colors.infoBg,
    border: colors.infoBorder,
  },
  {
    id: 'paid',
    label: 'Opłacono',
    color: colors.successText,
    background: colors.successBg,
    border: colors.successBorder,
  },
  {
    id: 'unpaid',
    label: 'Nieopłacono',
    color: colors.warningText,
    background: colors.warningBg,
    border: colors.warningBorder,
  },
  {
    id: 'urgent',
    label: 'Pilne',
    color: colors.errorText,
    background: colors.errorBg,
    border: colors.errorBorder,
  },
  {
    id: 'clarification',
    label: 'Wyjaśnienia',
    color: colors.textPrimary,
    background: colors.surfaceMuted,
    border: colors.border,
  },
]

const tagsById = new Map(DOCUMENT_TAGS.map((tag) => [tag.id, tag]))

export const getTag = (id: DocumentTagId): DocumentTag => {
  const tag = tagsById.get(id)
  if (!tag) throw new Error(`Unknown tag: ${id}`)
  return tag
}

/** Keeps tags in the canonical display order regardless of assignment order. */
const sortTags = (ids: Iterable<DocumentTagId>): DocumentTagId[] => {
  const set = new Set(ids)
  return DOCUMENT_TAGS.map((tag) => tag.id).filter((id) => set.has(id))
}

export function addTag(
  assignments: DocumentTagAssignments,
  documentIds: readonly string[],
  tagId: DocumentTagId,
): DocumentTagAssignments {
  const next: Record<string, readonly DocumentTagId[]> = { ...assignments }
  for (const id of documentIds) {
    next[id] = sortTags([...(next[id] ?? []), tagId])
  }
  return next
}

export function removeTag(
  assignments: DocumentTagAssignments,
  documentIds: readonly string[],
  tagId: DocumentTagId,
): DocumentTagAssignments {
  const next: Record<string, readonly DocumentTagId[]> = { ...assignments }
  for (const id of documentIds) {
    const remaining = (next[id] ?? []).filter((current) => current !== tagId)
    if (remaining.length > 0) {
      next[id] = remaining
    } else {
      delete next[id]
    }
  }
  return next
}

export const hasTag = (
  assignments: DocumentTagAssignments,
  documentId: string,
  tagId: DocumentTagId,
): boolean => assignments[documentId]?.includes(tagId) ?? false

export const countWithTag = (
  assignments: DocumentTagAssignments,
  documentIds: readonly string[],
  tagId: DocumentTagId,
): number => documentIds.filter((id) => hasTag(assignments, id, tagId)).length
