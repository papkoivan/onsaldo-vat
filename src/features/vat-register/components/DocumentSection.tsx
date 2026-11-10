import { useMemo } from 'react'
import Stack from '@mui/material/Stack'
import type { RegisterType, VatDocument } from '@/domain/vat'
import { downloadTextFile } from '@/utils/download'
import { formatDocumentCount } from '@/utils/format'
import type { FilterKey, FilterOption } from '../types/filters'
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
import { ActiveFilters } from './ActiveFilters'
import { BulkActionConfirmDialog } from './BulkActionConfirmDialog'
import { BulkActionsBar } from './BulkActionsBar'
import { DocumentsList } from './DocumentsList/DocumentsList'
import { DocumentsPagination } from './DocumentsPagination'
import { DocumentsTable } from './DocumentsTable/DocumentsTable'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import { DocumentToolbar } from './DocumentToolbar'
import { FeedbackSnackbar } from './FeedbackSnackbar'
import { FiltersDrawer } from './FiltersDrawer'
import { PrintView } from './PrintView'
import { TagActionsMenu } from './TagActionsMenu'

interface DocumentSectionProps {
  register: RegisterType
  companyName: string
  /** Every document matching the search and applied filters, in display order. */
  documents: readonly VatDocument[]
  filterOptions: Record<FilterKey, readonly FilterOption[]>
  search: DocumentSearchState
  filters: VatFiltersState
}

const TITLE_ID = 'documents-section-title'

export function DocumentSection({
  register,
  companyName,
  documents,
  filterOptions,
  search,
  filters,
}: DocumentSectionProps) {
  const isMobile = useViewportDown('md')
  const pagination = usePagination(documents)
  const { pageItems } = pagination
  const visibleIds = useMemo(
    () => pageItems.map((document) => document.id),
    [pageItems],
  )
  const expanded = useExpandedDocuments()
  const selection = useDocumentSelection(visibleIds)
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

  const handleResetAll = () => {
    search.clear()
    filters.clearAll()
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
        count={documents.length}
      />
      <DocumentToolbar
        searchValue={search.inputValue}
        onSearchChange={search.setInputValue}
        onSearchClear={search.clear}
        activeFilterCount={filters.activeFilters.length}
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
        filters={filters.activeFilters}
        onRemove={filters.removeFilter}
        onClearAll={filters.clearAll}
      />
      {isMobile ? (
        <DocumentsList
          documents={pageItems}
          expandedIds={expanded.expandedIds}
          onToggleExpand={expanded.toggle}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggle}
          tagAssignments={tags.assignments}
          onRemoveTag={bulkTagging.removeFromDocument}
          onResetFilters={canResetAll ? handleResetAll : undefined}
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
          tagAssignments={tags.assignments}
          onRemoveTag={bulkTagging.removeFromDocument}
          onResetFilters={canResetAll ? handleResetAll : undefined}
        />
      )}
      <DocumentsPagination pagination={pagination} />
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
      {printedAt && (
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
