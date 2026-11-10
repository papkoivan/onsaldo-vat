import { describe, expect, it } from 'vitest'
import { deriveViewState, getDataStatus } from './viewState'

describe('deriveViewState', () => {
  it('is filled when documents match', () => {
    expect(
      deriveViewState({ dataState: 'filled', sourceCount: 14, matchCount: 3 }),
    ).toBe('filled')
  })

  it('tells a search with no matches apart from a register with no documents', () => {
    expect(
      deriveViewState({ dataState: 'filled', sourceCount: 14, matchCount: 0 }),
    ).toBe('no-results')
    expect(
      deriveViewState({ dataState: 'filled', sourceCount: 0, matchCount: 0 }),
    ).toBe('empty')
  })

  it('treats the empty demo dataset as an empty register', () => {
    expect(
      deriveViewState({ dataState: 'empty', sourceCount: 0, matchCount: 0 }),
    ).toBe('empty')
  })

  it.each(['loading', 'error'] as const)(
    '%s wins over whatever the data would show',
    (dataState) => {
      expect(
        deriveViewState({ dataState, sourceCount: 14, matchCount: 14 }),
      ).toBe(dataState)
    },
  )
})

describe('getDataStatus', () => {
  it('hides financial figures while loading or failed, shows them otherwise', () => {
    expect(getDataStatus('loading')).toBe('loading')
    expect(getDataStatus('error')).toBe('unavailable')
    expect(getDataStatus('filled')).toBe('ready')
    expect(getDataStatus('empty')).toBe('ready')
    expect(getDataStatus('no-results')).toBe('ready')
  })
})
