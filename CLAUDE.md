# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontend-only prototype of the "Rejestry i VAT" page of a Polish accounting app. All data is bundled mock data; there is no backend or API. The UI language is Polish (labels, test queries and accessible names are Polish strings), while code and identifiers are English. See `README.md` for the feature list.

## Commands

Requires Node `^20.19` or `>=22.12`.

```bash
npm run dev            # Vite dev server
npm run build          # tsc -b && vite build
npm run lint           # ESLint
npm run format:check   # Prettier (npm run format to write)
npm test               # vitest run (once, no watch)
npx vitest run src/features/vat-register/utils/filterDocuments.test.ts   # single file
npx vitest run -t "removes a single filter chip"                         # single test by name
```

Vitest config lives in `vite.config.ts` (jsdom, setup in `src/test/setup.ts`). Use the `@/` alias for imports from `src/`. TypeScript is strict with `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (use `import type`) and `erasableSyntaxOnly` (no enums or parameter properties).

## Architecture

Single page: `App` -> `VatRegisterPage` (`src/features/vat-register/`). The page component owns the top-level state and passes it down; there is no router, global store or context.

- **State lives in `VatRegisterPage`:** active `register` (`sales` | `purchases`), `dataState` (demo switcher), plus the `useDocumentSearch` and `useVatFilters` hooks. Everything else (pagination, sorting, expanded rows, column order, feedback snackbar, print) is local to `DocumentSection` and its hooks.
- **Data pipeline:** `useDocuments(register, query, filters, dataState)` picks the mock dataset from `src/mocks/documents.ts`, runs `filterDocuments` (search + filters), then derives `totals` and the VAT-rate `breakdown`. The financial summary is computed from _all_ filtered documents, never from the current page. Sorting and pagination happen later, inside `DocumentSection`.
- **Filters (`hooks/useVatFilters.ts`):** two copies of the state, `draftFilters` (edited in the drawer) and `appliedFilters` (used for data and chips). Drafts are copied from applied on open and only committed by `applyDraft`. Initial state is `EMPTY_FILTERS` (every field `ALL_FILTER_VALUE` = `'all'`); there must be no pre-selected filters. Switching register calls `resetRegisterFilters`, which resets operation type, JPK code and series (they differ per register) but keeps the period.
- **Demo states:** `DemoStateSwitcher` drives `dataState` (`filled` | `empty` | `loading` | `error`). `deriveViewState` (`utils/viewState.ts`) adds the derived `no-results` state. The mock dataset is never mutated; `useDocuments` simply returns no documents while loading or failed. The "no results" preset is implemented by typing `DEMO_NO_RESULTS_QUERY` into the search box.
- **Responsive rendering:** `DocumentSection` renders `DocumentsTable` (>= 768 px, sortable, drag-reorderable columns via dnd-kit, extra columns only from 1200 px) or `DocumentsList` of cards (mobile). Column definitions are in `DocumentsTable/columns.tsx`, pure ordering logic in `utils/columnOrder.ts`.
- **Print / CSV:** `usePrintView` renders `PrintView` only between `beforeprint` and `afterprint` (using `flushSync`), so browser Ctrl/Cmd+P also prints the register. CSV is built in `utils/exportDocuments.ts` on top of `src/utils/csv.ts` and delivered through `src/utils/download.ts` (mocked in tests).
- **Domain and money:** types in `src/domain/vat.ts`. Amounts are PLN `number`s summed as integer grosze (`src/utils/vatCalculations.ts`); dates are ISO `YYYY-MM-DD` and the period filter matches against the issue date.
- **Mocks:** `src/mocks/` builds sales and purchase documents (`buildDocument.ts`) and the filter options per register (`filterOptions.ts`).
- **Theme:** MUI theme and design tokens in `src/theme/` (`tokens.ts` has layout constants); components style through MUI `sx`.

## Testing conventions

Business logic is pure functions covered by colocated `*.test.ts` files. Page-level behavior is tested end to end with React Testing Library in `VatRegisterPage.test.tsx`, which renders `<App />`, queries by Polish accessible names, and computes expected totals independently from `documentsByRegister` (`expectedTotals`). `downloadTextFile` is mocked there. When changing default state, update those expectations rather than the app code.
