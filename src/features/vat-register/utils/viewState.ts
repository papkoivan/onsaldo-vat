import type {
  DataStatus,
  DemoDataState,
  VatViewState,
} from '../types/viewState'

interface ViewStateInput {
  dataState: DemoDataState
  /** Documents the register holds before search and filters are applied. */
  sourceCount: number
  /** Documents left after search and filters. */
  matchCount: number
}

export function deriveViewState({
  dataState,
  sourceCount,
  matchCount,
}: ViewStateInput): VatViewState {
  if (dataState === 'loading' || dataState === 'error') return dataState
  if (dataState === 'empty' || sourceCount === 0) return 'empty'
  return matchCount === 0 ? 'no-results' : 'filled'
}

export function getDataStatus(viewState: VatViewState): DataStatus {
  if (viewState === 'loading') return 'loading'
  if (viewState === 'error') return 'unavailable'
  return 'ready'
}
