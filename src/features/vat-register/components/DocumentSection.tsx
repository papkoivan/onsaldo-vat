import { useCallback, useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import type { RegisterType, VatDocument } from '@/domain/vat'
import { downloadTextFile } from '@/utils/download'
import { formatDocumentCount } from '@/utils/format'
import type { FilterKey, FilterOption } from '../types/filters'
import { DEFAULT_SORT } from '../types/sort'
import type { SortKey } from '../types/sort'
import type { DocumentSearchState } from '../hooks/useDocumentSearch'
import { useExpandedDocuments } from '../hooks/useExpandedDocuments'
import { useFeedback } from '../hooks/useFeedback'
import { usePagination } from '../hooks/usePagination'
import { usePrintView } from '../hooks/usePrintView'
import { useViewportDown } from '../hooks/useViewportDown'
import type { VatFiltersState } from '../hooks/useVatFilters'
import {
  CSV_MIME_TYPE,
  buildDocumentsCsv,
  buildExportFilename,
} from '../utils/exportDocuments'
import { nextSort, sortDocuments } from '../utils/sortDocuments'
import type { VatViewState } from '../types/viewState'
import { ActiveFilters } from './ActiveFilters'
import { DocumentsList } from './DocumentsList/DocumentsList'
import { DocumentsPagination } from './DocumentsPagination'
import { DocumentsTable } from './DocumentsTable/DocumentsTable'
import { DocumentsErrorState } from './DocumentStates/DocumentsErrorState'
import { DocumentsLoadingState } from './DocumentStates/DocumentsLoadingState'
import { EmptyRegisterState } from './DocumentStates/EmptyRegisterState'
import { NoResultsState } from './DocumentStates/NoResultsState'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import { DocumentToolbar } from './DocumentToolbar'
import { FeedbackSnackbar } from './FeedbackSnackbar'
import { FiltersDrawer } from './FiltersDrawer'
import { PrintView } from './PrintView'

interface DocumentSectionProps {
  register: RegisterType
  companyName: string
  /** Every document matching the search and applied filters, before sorting. */
  documents: readonly VatDocument[]
  filterOptions: Record<FilterKey, readonly FilterOption[]>
  search: DocumentSearchState
  filters: VatFiltersState
  viewState: VatViewState
  onRetry: () => void
}

const TITLE_ID = 'documents-section-title'

export function DocumentSection({
  register,
  companyName,
  documents: matchingDocuments,
  filterOptions,
  search,
  filters,
  viewState,
  onRetry,
}: DocumentSectionProps) {
  const isMobile = useViewportDown('md')
  const [sort, setSort] = useState(DEFAULT_SORT)
  const documents = useMemo(
    () => sortDocuments(matchingDocuments, sort),
    [matchingDocuments, sort],
  )
  const handleSortChange = useCallback(
    (key: SortKey) => setSort((current) => nextSort(current, key)),
    [],
  )
  const pagination = usePagination(documents)
  const { pageItems } = pagination
  const expanded = useExpandedDocuments()
  const feedback = useFeedback()
  const { printedAt, print } = usePrintView()

  const hasDocuments = documents.length > 0

  const isFilled = viewState === 'filled'
  // nothing to search or filter while the register is empty, loading or failed
  const toolbarDisabled =
    viewState === 'empty' || viewState === 'loading' || viewState === 'error'

  // the control that was just used disappears; keep keyboard and screen reader users anchored
  const focusTitle = () => document.getElementById(TITLE_ID)?.focus()

  const renderDocuments = () => {
    switch (viewState) {
      case 'loading':
        return <DocumentsLoadingState layout={isMobile ? 'cards' : 'table'} />
      case 'error':
        return (
          <DocumentsErrorState
            onRetry={() => {
              onRetry()
              focusTitle()
            }}
          />
        )
      case 'empty':
        return <EmptyRegisterState register={register} />
      case 'no-results':
        return (
          <NoResultsState
            searchQuery={search.query}
            hasActiveFilters={filters.activeFilters.length > 0}
            onClearSearch={() => {
              search.clear()
              focusTitle()
            }}
            onClearFilters={() => {
              filters.clearAll()
              focusTitle()
            }}
          />
        )
      case 'filled':
        return isMobile ? (
          <DocumentsList
            documents={pageItems}
            expandedIds={expanded.expandedIds}
            onToggleExpand={expanded.toggle}
          />
        ) : (
          <DocumentsTable
            documents={pageItems}
            expandedIds={expanded.expandedIds}
            onToggleExpand={expanded.toggle}
            sort={sort}
            onSortChange={handleSortChange}
          />
        )
    }
  }

  const exportDocuments = () => {
    const filename = buildExportFilename(register, new Date())
    try {
      downloadTextFile(filename, buildDocumentsCsv(documents), CSV_MIME_TYPE)
      feedback.notify({
        severity: 'success',
        message: `Wyeksportowano ${formatDocumentCount(documents.length)} do pliku ${filename}.`,
      })
    } catch {
      feedback.notify({
        severity: 'error',
        message: 'Nie udało się wyeksportować pliku CSV. Spróbuj ponownie.',
      })
    }
  }

  return (
    <Stack
      component="section"
      aria-labelledby={TITLE_ID}
      useFlexGap
      spacing={1.5}
      sx={{ pt: { xs: 1, md: 1.5 } }}
    >
      <DocumentSectionHeader
        titleId={TITLE_ID}
        title="Dokumenty"
        count={
          viewState === 'loading' || viewState === 'error'
            ? null
            : documents.length
        }
        loading={viewState === 'loading'}
      />
      <DocumentToolbar
        disabled={toolbarDisabled}
        searchValue={search.inputValue}
        onSearchChange={search.setInputValue}
        onSearchClear={search.clear}
        activeFilterCount={toolbarDisabled ? 0 : filters.activeFilters.length}
        onOpenFilters={filters.openDrawer}
        onPrint={hasDocuments ? print : undefined}
        onExport={hasDocuments ? exportDocuments : undefined}
      />
      <ActiveFilters
        filters={
          viewState === 'filled' || viewState === 'no-results'
            ? filters.activeFilters
            : []
        }
        onRemove={filters.removeFilter}
        onClearAll={filters.clearAll}
      />
      {renderDocuments()}
      {isFilled && <DocumentsPagination pagination={pagination} />}
      <FiltersDrawer
        open={filters.isDrawerOpen}
        values={filters.draftFilters}
        options={filterOptions}
        onChange={filters.setDraftValue}
        onClose={filters.closeDrawer}
        onReset={filters.resetDraft}
        onApply={filters.applyDraft}
      />
      <FeedbackSnackbar feedback={feedback.feedback} onClose={feedback.close} />
      {printedAt && isFilled && (
        <PrintView
          companyName={companyName}
          register={register}
          documents={documents}
          searchQuery={search.query}
          filters={filters.activeFilters}
          printedAt={printedAt}
        />
      )}
    </Stack>
  )
}
