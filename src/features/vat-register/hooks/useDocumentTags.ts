import { useCallback, useState } from 'react'
import type { DocumentTagAssignments, DocumentTagId } from '../types/tags'
import { addTag, removeTag } from '../utils/tags'

export function useDocumentTags() {
  const [assignments, setAssignments] = useState<DocumentTagAssignments>({})

  const add = useCallback(
    (documentIds: readonly string[], tagId: DocumentTagId) =>
      setAssignments((current) => addTag(current, documentIds, tagId)),
    [],
  )

  const remove = useCallback(
    (documentIds: readonly string[], tagId: DocumentTagId) =>
      setAssignments((current) => removeTag(current, documentIds, tagId)),
    [],
  )

  return { assignments, add, remove }
}

export type DocumentTagsState = ReturnType<typeof useDocumentTags>
