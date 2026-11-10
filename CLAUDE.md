# CLAUDE.md

# Project: Onsaldo – VAT Register Dashboard

## 1. Project Overview

Build a responsive, interactive frontend prototype of an accounting application based on the provided Onsaldo VAT Register design references.

The application represents a Polish accounting dashboard for managing VAT sales and purchase registers.

The goal is to redesign the original interface into a modern, clean, intuitive SaaS experience while preserving:
- All original business information.
- All existing fields and actions.
- The original visual identity and color palette.
- All important user workflows.

This is a frontend-only demonstration prototype. No real accounting operations or external integrations should be performed.

## 2. Technology Stack

Use the following technologies:

- React
- TypeScript (strict mode)
- Vite
- Material UI (MUI)
- MUI Icons
- React Hooks
- CSS Modules or Emotion (prefer MUI's styling system where appropriate)

Use Material UI components as the primary UI building blocks.

Preferred MUI components:
- Box
- Stack
- Grid
- Container
- Paper
- Card
- Typography
- Button
- IconButton
- Tabs
- Tab
- TextField
- Select
- MenuItem
- Drawer
- Dialog
- Chip
- Table
- TableContainer
- TableHead
- TableBody
- TableRow
- TableCell
- Collapse
- Accordion
- Pagination
- Tooltip
- Menu
- Snackbar
- Alert
- Skeleton

Do not introduce additional UI libraries without a good reason.

## 3. Design Direction

### General style

Use a Clean Enterprise Dashboard design direction.

The interface should feel:
- Modern
- Minimalistic
- Professional
- Clean
- Easy to scan
- Consistent
- Suitable for business and accounting software

Avoid unnecessary decoration, excessive shadows, gradients, and visual clutter.

### Color palette

Preserve the visual identity of the provided references.

Suggested starting tokens:

```css
:root {
  --color-primary: #167C70;
  --color-primary-dark: #11685F;
  --color-primary-light: #E5F3F0;

  --color-background: #F7F8FC;
  --color-surface: #FFFFFF;

  --color-text-primary: #17243A;
  --color-text-secondary: #64748B;

  --color-border: #DCE3EB;

  --color-warning: #B7791F;
  --color-warning-background: #FFF7E7;

  --color-success: #16836D;
  --color-error: #D14343;
}
```

These values are initial design tokens and can be adjusted slightly to match the reference screenshots.

### Typography

Use Inter as the primary font.

Typography should have a clear hierarchy:
- Page title: prominent and bold.
- Section headings: medium or semibold.
- Table content: compact and readable.
- Supporting information: muted secondary text.

### Components

Use:
- Consistent border radiuses (8–12px).
- Subtle borders.
- Minimal shadows.
- Consistent spacing.
- Clear hover, focus, active, disabled, and loading states.

Avoid arbitrary styling differences between similar components.

## 4. Application Scope

Implement one primary page:

**Rejestry i VAT**

The page contains:

1. Page header.
2. Sales / purchases register switcher.
3. VAT confirmation notice.
4. Financial summary.
5. Expandable VAT rate breakdown.
6. Document toolbar.
7. Search.
8. Filters drawer.
9. Documents table.
10. Expandable document details.
11. Pagination.
12. Additional document actions.

Do not implement unrelated application pages or a complete application sidebar.

Navigation should remain minimal.

## 5. Layout and Responsive Design

The application must work correctly across different viewport sizes.

Target breakpoints:

| Device | Width |
|---|---:|
| Desktop | >= 1440px |
| Laptop | 1200–1439px |
| Tablet | 768–1199px |
| Mobile | 320–767px |

Use responsive layouts rather than simply scaling down the desktop interface.

### Desktop

- Display the complete document table.
- Show all primary columns.
- Keep the financial summary visible.
- Display search and action controls in one toolbar.
- Use a right-side Drawer for filters.

### Laptop

- Preserve the main table layout.
- Reduce unnecessary horizontal spacing.
- Hide secondary columns when necessary.
- Keep hidden information accessible through expandable rows.

### Tablet

- Use a reduced set of primary table columns.
- Preserve document identification and financial information.
- Make additional information available through expandable rows.
- Keep toolbar actions accessible.

### Mobile (including iPhone SE – 320px)

- Replace the table with document cards.
- Display the most important document information.
- Use expandable cards to show all remaining fields.
- Stack financial summary cards vertically when necessary.
- Open filters in a mobile-friendly Drawer.
- Ensure buttons have sufficiently large touch targets.
- Prevent horizontal page overflow.

### Important responsive requirement

Never remove business data simply because a column is hidden.

Every field available on desktop must remain accessible on smaller screens through an appropriate interaction.

## 6. Page Structure

Recommended component hierarchy:

```text
VatRegisterPage
│
├── PageHeader
│
├── RegisterTabs
│
├── VatConfirmationNotice
│
├── VatSummary
│   ├── SummaryCard
│   ├── SummaryCard
│   ├── SummaryCard
│   └── VatRateBreakdown
│
├── DocumentSection
│   ├── DocumentToolbar
│   │   ├── DocumentSearch
│   │   ├── FilterButton
│   │   ├── PrintAction
│   │   ├── ExportAction
│   │   └── MoreActions
│   │
│   ├── ActiveFilters
│   │
│   ├── FiltersDrawer
│   │
│   ├── DocumentsTable
│   │   └── DocumentRow
│   │       └── DocumentDetails
│   │
│   ├── DocumentsList
│   │   └── DocumentCard
│   │       └── DocumentDetails
│   │
│   └── DocumentsPagination
│
└── DemoStateSwitcher
```

Use separate components for desktop table rows and mobile document cards.

Reuse the document details component where possible.

## 7. Financial Summary

The financial summary must ALWAYS remain visible.

It contains:

- Netto
- VAT
- Brutto

Values must be calculated from the currently filtered documents.

The summary must update when:
- The register changes.
- Filters are applied.
- Search results change.
- The selected period changes.

### VAT rate breakdown

The section `Kwoty według stawek VAT` must be collapsible.

Default state: collapsed.

When expanded, display one compact row per VAT rate:
- VAT rate label: only two rates exist in the demo data, 23% and np (not subject to VAT); both are always listed, even when zero.
- A horizontal bar showing the rate's share of the total VAT amount.
- The VAT amount for that rate, bold and right-aligned.

Keep the section minimal: no table header, no separate net-amount column, no percentage text, no totals row and no decorative icon. Net amounts per rate stay available in the document details and the CSV export.

Do not hardcode calculated totals in the UI.

Calculate them from document data.

## 8. Document Register

### Desktop table columns

Display the following information:

- Kontrahent
- Data
- Numer dokumentu
- Numer KSeF
- Identyfikator
- Actions (expand / collapse details)

Amounts (netto, VAT, brutto) are not table columns; they are shown in the expanded row and in the financial summary.

Use appropriate sorting indicators and interactions.

### Expandable rows

Document details must expand directly below the corresponding table row.

Multiple documents can remain expanded simultaneously.

The expanded section should display all additional document information, including:

- Contractor details.
- NIP.
- Issue date.
- Sale date.
- Document number.
- KSeF status and number.
- Identifier.
- Operation type.
- JPK V7 code.
- Document series.
- Net amount.
- VAT amount.
- Gross amount.
- VAT rate breakdown, where applicable.

Do not navigate to another page when expanding a document.

### Mobile cards

On mobile, replace the table with document cards.

Each card should display:
- Contractor.
- Document number.
- Date.
- KSeF status.
- Expand/collapse control.

All remaining fields must be available when expanded.

## 9. Filters

Filters must be placed inside a right-side Material UI Drawer on desktop.

On mobile, use a full-width or bottom-oriented panel suitable for small screens.

Available filters:

- Rok
- Miesiąc
- Rodzaj operacji
- Kod JPK V7
- Serie dokumentów

### Filter behavior

- Changing filter values should not immediately apply them.
- `Zastosuj filtry` applies the selected values.
- `Wyczyść` resets filter selections.
- Closing the Drawer without applying should discard unapplied changes.
- Active filters should be displayed as removable chips.
- Provide a convenient way to clear all active filters.

Use controlled React state.

## 10. Search

Implement functional document search.

Search should support:
- Contractor name.
- Document number.
- KSeF number.
- Identifier.

Search must work together with other filters.

Changing search results must update:
- Document list.
- Result count.
- Financial summary.
- VAT rate breakdown.

## 11. Document Actions

Implement the following actions:

### Register-level actions

- Print.
- Export.
- Additional actions menu.

### Document-level actions

- Expand document details.

Documents have no selection checkboxes, so there are no bulk actions.

### Export

Implement CSV export using the currently filtered documents.

The export should include all relevant document fields, not only currently visible table columns.

### Print

Provide a print-friendly document view using browser printing.

Do not perform real external accounting operations.

## 12. Pagination

Default page size: 10 documents.

Requirements:
- Show current page.
- Show total number of pages.
- Previous / next controls.
- Page size selection.
- Update the displayed range.
- Reset to page 1 when filters or search change.

The available page sizes can include 10, 20, and 25.

## 13. Application States

The prototype must demonstrate three primary states.

### Filled state

- Display mock documents.
- Calculate financial summary.
- Display VAT rate breakdown.
- Enable search, filters, sorting, pagination, and document expansion.

### Empty state

Support both:
- No documents in the selected register.
- No documents matching current filters.

Display a meaningful empty state with an option to clear filters.

### Error state

Simulate a data loading error.

Display:
- Clear error message.
- Retry button.
- Ability to return to the filled state.

Also implement a loading state using MUI Skeleton components.

### Demo state switcher

Provide a development/demo control for switching between:
- Filled
- Empty
- Error
- Loading

This control must be clearly identified as a prototype/testing feature.

## 14. Data Model

Create strongly typed TypeScript interfaces.

Example:

```ts
export type RegisterType = 'sales' | 'purchases';

export interface VatBreakdownItem {
  rate: 23 | 'np';
  netAmount: number;
  vatAmount: number;
}

export interface VatDocument {
  id: string;
  contractor: string;
  nip: string;

  issueDate: string;
  saleDate: string;

  documentNumber: string;
  ksefNumber: string | null;
  ksefStatus: 'confirmed' | 'pending' | 'rejected';

  identifier: string;
  operationType: string;
  jpkCode: string | null;
  documentSeries: string;

  netAmount: number;
  vatAmount: number;
  grossAmount: number;

  vatBreakdown: VatBreakdownItem[];
}
```

Use numeric values for financial calculations.

Format money using `Intl.NumberFormat` with the `pl-PL` locale and PLN currency.

Keep dates in ISO format internally.

## 15. State Management

Prefer React built-in state management for this prototype.

Use:
- `useState`
- `useMemo`
- `useCallback`
- `useEffect` when necessary

Avoid unnecessary global state libraries.

Separate:
- Applied filters.
- Draft filter values.
- Search query.
- Selected register.
- Current page.
- Expanded document IDs.
- Demo application state.

Derive filtered documents and financial calculations rather than maintaining duplicated state.

Use `useMemo` for expensive derived calculations where appropriate.

Avoid unnecessary effects and duplicated derived data.

## 16. Code Quality

Follow these rules:

- Use TypeScript strict mode.
- Avoid `any`.
- Prefer explicit interfaces and types.
- Use functional React components.
- Keep components focused and reusable.
- Extract complex business logic into hooks or utility functions.
- Keep mock data separate from UI components.
- Avoid unnecessary abstractions.
- Avoid large monolithic components.
- Use meaningful names.
- Handle empty and error cases.
- Do not introduce dependencies without justification.

Keep business logic separate from presentation logic.

## 17. Accessibility

Ensure:
- Semantic HTML.
- Keyboard-accessible interactions.
- Visible focus states.
- Appropriate ARIA attributes.
- Accessible Drawer behavior.
- Tooltips for icon-only actions.
- Sufficient contrast.
- Clear interactive states.

Expandable rows and cards must be keyboard accessible.

## 18. Testing

Prioritize testing important user workflows:

- Switching between sales and purchases.
- Searching documents.
- Applying and clearing filters.
- Sorting table columns.
- Expanding multiple documents.
- Calculating financial summaries.
- Calculating VAT breakdowns.
- Pagination.
- CSV export.
- Empty state.
- Error state.
- Responsive layouts.

Use Vitest and React Testing Library if tests are added.

## 19. Development Workflow

Work incrementally.

Recommended implementation order:

1. Initialize Vite + React + TypeScript.
2. Install and configure Material UI.
3. Define theme and design tokens.
4. Create TypeScript data models.
5. Prepare mock documents.
6. Build the page layout.
7. Implement financial summary.
8. Implement VAT breakdown.
9. Implement document table.
10. Implement expandable document details.
11. Implement search and filters.
12. Implement pagination.
13. Implement export and print.
14. Implement loading, empty, and error states.
15. Implement responsive layouts.
16. Verify behavior and visual consistency.

Do not implement everything in a single large component or a single large development step.

After each major step:
- Check TypeScript errors.
- Run the application.
- Verify the implemented behavior.
- Fix regressions before continuing.

## 20. Important Constraints

- This is a frontend demonstration prototype.
- Do not connect to real accounting systems.
- Do not make real API requests.
- Do not implement actual accounting or tax calculations beyond the supplied demo data.
- Do not remove original fields or actions.
- Do not invent integrations.
- Do not sacrifice usability to reproduce the original screenshot pixel by pixel.
- Preserve the original visual identity while improving the information architecture.

## 21. Definition of Done

The prototype is considered complete when:

- The page visually matches the approved design direction.
- Sales and purchases registers work.
- Search and filters work.
- Financial summary is always visible.
- VAT breakdown is expandable.
- Multiple document rows can be expanded simultaneously.
- All document information remains accessible across screen sizes.
- Desktop uses a full table.
- Mobile uses expandable cards.
- Pagination works with 10 documents by default.
- CSV export works.
- Printing works.
- Filled, empty, loading, and error states are available.
- No horizontal page overflow occurs at 320px.
- No TypeScript errors remain.
- The application runs successfully using the documented Vite commands.

---

**General instruction to Claude:**

Before implementing a feature, inspect the existing code and understand the current architecture.

Follow the approved design decisions in this document.

Do not make large architectural or visual changes without a clear reason.

Prefer simple, maintainable solutions over unnecessary abstractions.

When a requirement is ambiguous, explain the ambiguity and propose a reasonable implementation rather than silently inventing business behavior.
