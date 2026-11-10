import { describe, expect, it } from 'vitest'
import { addTag, countWithTag, hasTag, removeTag } from './tags'

describe('document tags', () => {
  it('adds a tag to every given document without touching others', () => {
    const result = addTag({ c: ['paid'] }, ['a', 'b'], 'urgent')
    expect(result).toEqual({ a: ['urgent'], b: ['urgent'], c: ['paid'] })
  })

  it('does not duplicate a tag and keeps canonical order', () => {
    const once = addTag({}, ['a'], 'urgent')
    const result = addTag(addTag(once, ['a'], 'urgent'), ['a'], 'review')
    expect(result['a']).toEqual(['review', 'urgent'])
  })

  it('removes a tag and drops documents left without tags', () => {
    const result = removeTag(
      { a: ['paid', 'urgent'], b: ['urgent'] },
      ['a', 'b'],
      'urgent',
    )
    expect(result).toEqual({ a: ['paid'] })
  })

  it('does not mutate its input', () => {
    const input = { a: ['paid'] } as const
    addTag(input, ['a'], 'urgent')
    removeTag(input, ['a'], 'paid')
    expect(input).toEqual({ a: ['paid'] })
  })

  it('counts documents that carry a tag', () => {
    const assignments = { a: ['paid'], b: ['paid', 'urgent'] } as const
    expect(hasTag(assignments, 'a', 'urgent')).toBe(false)
    expect(countWithTag(assignments, ['a', 'b', 'c'], 'paid')).toBe(2)
  })
})
