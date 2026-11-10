import { useCallback, useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import type { RegisterType, VatDocument } from '@/domain/vat'
import { downloadTextFile } from '@/utils/download'
import { formatDocumentCount } from '@/utils/format'
import type { FilterKey, FilterOption } from '../types/filters'
import { DEFAULT_SORT } from '../types/sort'
import type { SortKey } from '../types/sort'
import { useBulkTagging } from '../hooks/useBulkTagging'
import { useDocumentSelection } from '../hooks/useDocumentSelection'
import type { DocumentSearchState } from '../hooks/useDocumentSearch'
import { useDocumentTags } from '../hooks/useDocumentTags'
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
import { BulkActionConfirmDialog } from './BulkActionConfirmDialog'
import { BulkActionsBar } from './BulkActionsBar'
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
import { TagActionsMenu } from './TagActionsMenu'

interface DocumentSectionProps {
  register: RegisterType
  companyName: string
  /** Every document matching the search and applied filters, before sorting. */
  documents: readonly VatDocument[]
  filterOptions: Record<FilterKey, readonly FilterOption[]>
  search: DocumentSearchState
  filters: VatFiltersState
  viewState: VatViewState
  /** Changes when the underlying dataset changes; visible selection is dropped then. */
  dataScope: string
  onRetry: () => void
}

const TITLE_ID = 'documents-section-title'

const UNAVAILABLE_REASONS: Partial<Record<VatViewState, string>> = {
  empty: 'rejestr nie zawiera dokumentów',
  'no-results': 'brak dokumentów spełniających kryteria',
  loading: 'trwa ładowanie danych',
  error: 'dane są niedostępne',
}

export function DocumentSection({
  register,
  companyName,
  documents: matchingDocuments,
  filterOptions,
  search,
  filters,
  viewState,
  dataScope,
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
  const visibleIds = useMemo(
    () => pageItems.map((document) => document.id),
    [pageItems],
  )
  const expanded = useExpandedDocuments()
  const selection = useDocumentSelection(visibleIds, `${register}:${dataScope}`)
  const tags = useDocumentTags()
  const feedback = useFeedback()
  const { printedAt, print } = usePrintView()

  // Selection spans pages; documents hidden by the current search/filters are not acted on.
  const selectedDocuments = useMemo(
    () =>
      documents.filter((document) => selection.selectedIds.has(document.id)),
    [documents, selection.selectedIds],
  )
  const bulkTagging = useBulkTagging({
    selectedDocuments,
    tags,
    notify: feedback.notify,
  })

  const canResetAll =
    filters.activeFilters.length > 0 || search.inputValue !== ''
  const hasDocuments = documents.length > 0
  const hasSelection = selectedDocuments.length > 0

  const isFilled = viewState === 'filled'
  // nothing to search or filter while the register is empty, loading or failed
  const toolbarDisabled =
    viewState === 'empty' || viewState === 'loading' || viewState === 'error'

  const handleResetAll = () => {
    search.clear()
    filters.clearAll()
  }

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
            selectedIds={selection.selectedIds}
            onToggleSelect={selection.toggle}
            tagAssignments={tags.assignments}
            onRemoveTag={bulkTagging.removeFromDocument}
          />
        ) : (
          <DocumentsTable
            documents={pageItems}
            expandedIds={expanded.expandedIds}
            onToggleExpand={expanded.toggle}
            selectedIds={selection.selectedIds}
            allSelected={selection.allSelected}
            someSelected={selection.someSelected}
            onToggleSelect={selection.toggle}
            onToggleSelectAll={selection.toggleAll}
            sort={sort}
            onSortChange={handleSortChange}
            tagAssignments={tags.assignments}
            onRemoveTag={bulkTagging.removeFromDocument}
          />
        )
    }
  }

  const exportDocuments = (
    toExport: readonly VatDocument[],
    scope?: string,
  ) => {
    const filename = buildExportFilename(register, new Date(), scope)
    try {
      downloadTextFile(
        filename,
        buildDocumentsCsv(toExport, tags.assignments),
        CSV_MIME_TYPE,
      )
      feedback.notify({
        severity: 'success',
        message: `Wyeksportowano ${formatDocumentCount(toExport.length)} do pliku ${filename}.`,
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
        unavailableReason={UNAVAILABLE_REASONS[viewState]}
        searchValue={search.inputValue}
        onSearchChange={search.setInputValue}
        onSearchClear={search.clear}
        activeFilterCount={toolbarDisabled ? 0 : filters.activeFilters.length}
        onOpenFilters={filters.openDrawer}
        onPrint={hasDocuments ? print : undefined}
        onExport={hasDocuments ? () => exportDocuments(documents) : undefined}
        onExportSelected={
          hasSelection
            ? () => exportDocuments(selectedDocuments, 'zaznaczone')
            : undefined
        }
        onTag={hasSelection ? bulkTagging.openMenu : undefined}
        onClearSelection={hasSelection ? selection.clear : undefined}
        onSelectAll={pageItems.length > 0 ? selection.selectAll : undefined}
        canResetAll={canResetAll}
        onResetAll={handleResetAll}
      />
      <BulkActionsBar
        selectedCount={selectedDocuments.length}
        onOpenTagMenu={bulkTagging.openMenu}
        onClearSelection={selection.clear}
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
      <TagActionsMenu
        anchorEl={bulkTagging.menuAnchor}
        onClose={bulkTagging.closeMenu}
        onExited={bulkTagging.handleMenuExited}
        selectedIds={bulkTagging.selectedIds}
        assignments={tags.assignments}
        onAdd={(tagId) => bulkTagging.request({ type: 'add', tagId })}
        onRemove={(tagId) => bulkTagging.request({ type: 'remove', tagId })}
      />
      <BulkActionConfirmDialog
        open={bulkTagging.pending?.open ?? false}
        action={bulkTagging.pending?.action ?? null}
        documentCount={bulkTagging.pending?.documentIds.length ?? 0}
        onConfirm={bulkTagging.confirm}
        onCancel={bulkTagging.cancel}
      />
      <FeedbackSnackbar feedback={feedback.feedback} onClose={feedback.close} />
      {printedAt && isFilled && (
        <PrintView
          companyName={companyName}
          register={register}
          documents={documents}
          tags={tags.assignments}
          searchQuery={search.query}
          filters={filters.activeFilters}
          printedAt={printedAt}
        />
      )}
    </Stack>
  )
}
