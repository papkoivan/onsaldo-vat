export type DocumentTagId =
  'review' | 'paid' | 'unpaid' | 'urgent' | 'clarification'

export interface DocumentTag {
  id: DocumentTagId
  label: string
  color: string
  background: string
  border: string
}

/** Tag assignments keyed by document id. Documents without tags have no entry. */
export type DocumentTagAssignments = Readonly<
  Record<string, readonly DocumentTagId[]>
>
