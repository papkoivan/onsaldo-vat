import { useCallback, useMemo, useRef, useState } from 'react'
import type { VatDocument } from '@/domain/vat'
import { formatDocumentCountGenitive } from '@/utils/format'
import type { DocumentTagId } from '../types/tags'
import { getTag, hasTag } from '../utils/tags'
import type { FeedbackNotifier } from './useFeedback'
import type { DocumentTagsState } from './useDocumentTags'

export interface BulkTagAction {
  type: 'add' | 'remove'
  tagId: DocumentTagId
}

interface PendingAction {
  action: BulkTagAction
  documentIds: readonly string[]
  /** Kept after cancelling so the dialog content does not change while it fades out. */
  open: boolean
}

interface UseBulkTaggingOptions {
  selectedDocuments: readonly VatDocument[]
  tags: DocumentTagsState
  notify: FeedbackNotifier
}

/** Documents a bulk action would actually change (already-tagged ones are skipped on add). */
function affectedIds(
  { type, tagId }: BulkTagAction,
  documents: readonly VatDocument[],
  tags: DocumentTagsState,
): string[] {
  return documents
    .filter(
      (document) =>
        hasTag(tags.assignments, document.id, tagId) === (type === 'remove'),
    )
    .map((document) => document.id)
}

export function useBulkTagging({
  selectedDocuments,
  tags,
  notify,
}: UseBulkTaggingOptions) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  // The dialog opens only after the menu has finished closing, so the menu's focus restore cannot race it.
  const queued = useRef<PendingAction | null>(null)

  const selectedIds = useMemo(
    () => selectedDocuments.map((document) => document.id),
    [selectedDocuments],
  )

  const openMenu = useCallback(
    (anchor: HTMLElement) => setMenuAnchor(anchor),
    [],
  )
  const closeMenu = useCallback(() => setMenuAnchor(null), [])

  const apply = useCallback(
    (action: BulkTagAction, documentIds: readonly string[]) => {
      const { label } = getTag(action.tagId)
      const count = formatDocumentCountGenitive(documentIds.length)
      if (action.type === 'add') {
        tags.add(documentIds, action.tagId)
        notify({
          severity: 'success',
          message: `Dodano oznaczenie „${label}” do ${count}.`,
        })
      } else {
        tags.remove(documentIds, action.tagId)
        notify({
          severity: 'success',
          message: `Usunięto oznaczenie „${label}” z ${count}.`,
        })
      }
    },
    [tags, notify],
  )

  const request = useCallback(
    (action: BulkTagAction) => {
      setMenuAnchor(null)
      const documentIds = affectedIds(action, selectedDocuments, tags)
      if (documentIds.length === 0) return
      // a single document is a simple action — only multi-document changes need confirmation
      if (documentIds.length === 1) {
        apply(action, documentIds)
        return
      }
      queued.current = { action, documentIds, open: true }
    },
    [selectedDocuments, tags, apply],
  )

  const handleMenuExited = useCallback(() => {
    if (queued.current) setPending(queued.current)
    queued.current = null
  }, [])

  const confirm = useCallback(() => {
    if (pending) apply(pending.action, pending.documentIds)
    setPending((current) => (current ? { ...current, open: false } : null))
  }, [pending, apply])

  const cancel = useCallback(() => {
    setPending((current) => (current ? { ...current, open: false } : null))
  }, [])

  const removeFromDocument = useCallback(
    (document: VatDocument, tagId: DocumentTagId) => {
      tags.remove([document.id], tagId)
      notify({
        severity: 'success',
        message: `Usunięto oznaczenie „${getTag(tagId).label}” z dokumentu ${document.documentNumber}.`,
      })
    },
    [tags, notify],
  )

  return {
    selectedIds,
    menuAnchor,
    openMenu,
    closeMenu,
    handleMenuExited,
    request,
    pending,
    confirm,
    cancel,
    removeFromDocument,
  }
}
