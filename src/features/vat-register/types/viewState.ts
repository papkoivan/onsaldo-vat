/** What the demo switcher puts the data source into. */
export type DemoDataState = 'filled' | 'empty' | 'loading' | 'error'

/** What the page actually presents; `no-results` is derived from the search and filters. */
export type VatViewState = DemoDataState | 'no-results'

/** Availability of the financial figures (summary cards and VAT rate breakdown). */
export type DataStatus = 'ready' | 'loading' | 'unavailable'

/** The "no search results" demo preset types this phrase into the search box. */
export const DEMO_NO_RESULTS_QUERY = 'zzz-brak-wynikow'
