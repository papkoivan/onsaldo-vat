# Onsaldo – VAT Register Dashboard

A responsive, interactive **frontend-only prototype** of the "Rejestry i VAT" page of a Polish accounting application. It redesigns the VAT sales and purchase registers as a clean enterprise dashboard while keeping the original fields, actions and teal visual identity.

> **This is a demonstration.** All data is mock data bundled with the app. There are no API requests, no backend and no real accounting or tax operations. Exports are generated locally in the browser.

The user interface is in Polish.

## Technology stack

- React 19 + TypeScript (strict mode)
- Vite
- Material UI (MUI) + MUI Icons, Emotion styling, Inter font
- dnd-kit (drag-and-drop column reordering)
- Vitest + React Testing Library (jsdom)
- ESLint + Prettier

## Getting started

Requires Node.js `^20.19` or `>=22.12`.

```bash
npm install
npm run dev        # development server with hot reload
npm run build      # type-check and production build into dist/
npm run preview    # serve the production build locally
npm test           # run the test suite once
npm run lint       # ESLint
npm run format:check
```

## Features

- **Registers** – sales and purchases tabs, each with its own documents; switching resets the register-specific filters.
- **Financial summary** – Netto / VAT / Brutto, always visible and calculated from _all_ documents matching the search and filters (not only the current page).
- **VAT rate breakdown** – collapsible "Kwoty według stawek VAT" with the VAT amount and its share of total VAT for each rate (23% and np).
- **Documents table** (tablet and desktop, from 768 px) – sortable identification columns (contractor, date, document number, KSeF number, identifier) and expandable rows (several at once). The KSeF number and identifier columns are shown only from 1200 px; below that, like the amounts (netto, VAT, brutto), the VAT rate breakdown and all other fields, they are in the expanded row.
- **Column reordering** – drag the handle in a column header (or use the keyboard: Space, arrow keys, Space/Escape) to change the order of the visible columns. The order is kept while the page is open and is not persisted.
- **KSeF status** – each document has a status (confirmed, pending, rejected) shown as a chip; documents without a KSeF number show the status in place of the number.
- **Document cards** (mobile, below 768 px) – expandable cards with every field; no horizontal overflow down to 320 px.
- **Search** – by contractor, document number, KSeF number and identifier; diacritic- and case-insensitive; combines with filters.
- **Filters drawer** – year, month, operation type, JPK V7 code, document series. The period is matched against the issue date, and the page opens with October 2026 already applied. Changes are drafts until "Zastosuj filtry"; closing the drawer discards them. Applied filters appear as removable chips.
- **Pagination** – 10 (default), 20 or 25 per page; goes back to page 1 on search, filter, sort and register changes.
- **Actions** – in the "Więcej akcji" menu: CSV export of the filtered documents in the current sort order (UTF-8 with BOM, `;` separated, all fields plus netto/VAT per rate) and a print view (A4 landscape) of the same documents. The "Etykiety" menu item is a non-functional placeholder.
- **States** – filled, empty, no results, loading (skeletons) and error with retry, switchable from the clearly marked **PROTOTYP** panel at the top of the page. "No results" is a preset that types a phrase matching nothing into the search box.

## Project structure

```text
src/
  app/                    App shell and theme provider
  domain/                 Core types (VatDocument, VatBreakdownItem, ...)
  features/vat-register/  The VAT register page: components, hooks, types, utils
  mocks/                  Mock documents and filter options
  theme/                  MUI theme and design tokens
  utils/                  Money calculations, formatting, CSV, download helpers
  test/                   Test setup
```

Business logic (filtering, sorting, column reordering, VAT and money calculations, CSV building) lives in pure functions under `src/utils/` and `src/features/vat-register/utils/` and is covered by unit tests; page-level workflows are covered by React Testing Library tests in `VatRegisterPage.test.tsx`.

## Notes on money

Amounts are `number`s in PLN, summed and rounded as integer grosze (half away from zero) to avoid floating-point drift. Currency is formatted with `Intl.NumberFormat('pl-PL')`; dates are stored as ISO `YYYY-MM-DD`.

## Known limitations

- Sorting is available on the table layout (desktop and tablet). The mobile card list keeps the default newest-first order.
- Column reordering is available on the table layout only and is not persisted between visits.
- Printing uses the browser's print dialog; layout differs between browsers.
