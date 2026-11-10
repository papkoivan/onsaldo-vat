import { describe, expect, it } from 'vitest'
import { DEFAULT_COLUMN_ORDER } from '../types/columns'
import { moveColumn } from './columnOrder'

describe('moveColumn', () => {
  it('moves a column to the position of the column it is dropped on', () => {
    expect(
      moveColumn(DEFAULT_COLUMN_ORDER, 'contractor', 'documentNumber'),
    ).toEqual([
      'issueDate',
      'documentNumber',
      'contractor',
      'ksefNumber',
      'identifier',
    ])
    expect(moveColumn(DEFAULT_COLUMN_ORDER, 'identifier', 'issueDate')).toEqual(
      ['contractor', 'identifier', 'issueDate', 'documentNumber', 'ksefNumber'],
    )
  })

  it('keeps every column exactly once', () => {
    const result = moveColumn(DEFAULT_COLUMN_ORDER, 'ksefNumber', 'contractor')
    expect([...result].sort()).toEqual([...DEFAULT_COLUMN_ORDER].sort())
  })

  it('returns the same order when nothing changes', () => {
    expect(moveColumn(DEFAULT_COLUMN_ORDER, 'issueDate', 'issueDate')).toBe(
      DEFAULT_COLUMN_ORDER,
    )
  })

  it('does not mutate the input', () => {
    const input = [...DEFAULT_COLUMN_ORDER]
    moveColumn(input, 'contractor', 'identifier')
    expect(input).toEqual(DEFAULT_COLUMN_ORDER)
  })
})
