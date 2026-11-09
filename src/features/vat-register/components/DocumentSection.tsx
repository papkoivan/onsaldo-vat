import { useMemo } from 'react'
import Stack from '@mui/material/Stack'
import type { FilterKey, FilterOption } from '../types/filters'
import type { VatDocument } from '@/domain/vat'
import { useDocumentSelection } from '../hooks/useDocumentSelection'
import type { DocumentSearchState } from '../hooks/useDocumentSearch'
import { useExpandedDocuments } from '../hooks/useExpandedDocuments'
import type { VatFiltersState } from '../hooks/useVatFilters'
import { ActiveFilters } from './ActiveFilters'
import { DocumentsTable } from './DocumentsTable/DocumentsTable'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import { DocumentToolbar } from './DocumentToolbar'
import { FiltersDrawer } from './FiltersDrawer'

interface DocumentSectionProps {
  documents: readonly VatDocument[]
  filterOptions: Record<FilterKey, readonly FilterOption[]>
  search: DocumentSearchState
  filters: VatFiltersState
}

const TITLE_ID = 'documents-section-title'

export function DocumentSection({
  documents,
  filterOptions,
  search,
  filters,
}: DocumentSectionProps) {
  const visibleIds = useMemo(
    () => documents.map((document) => document.id),
    [documents],
  )
  const expanded = useExpandedDocuments()
  const selection = useDocumentSelection(visibleIds)

  const canResetAll =
    filters.activeFilters.length > 0 || search.inputValue !== ''

  const handleResetAll = () => {
    search.clear()
    filters.clearAll()
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
        onPrint={() => window.print()}
        onSelectAll={documents.length > 0 ? selection.selectAll : undefined}
        canResetAll={canResetAll}
        onResetAll={handleResetAll}
      />
      <ActiveFilters
        filters={filters.activeFilters}
        onRemove={filters.removeFilter}
        onClearAll={filters.clearAll}
      />
      <DocumentsTable
        documents={documents}
        expandedIds={expanded.expandedIds}
        onToggleExpand={expanded.toggle}
        selectedIds={selection.selectedIds}
        allSelected={selection.allSelected}
        someSelected={selection.someSelected}
        onToggleSelect={selection.toggle}
        onToggleSelectAll={selection.toggleAll}
        onResetFilters={canResetAll ? handleResetAll : undefined}
      />
      <FiltersDrawer
        open={filters.isDrawerOpen}
        values={filters.draftFilters}
        options={filterOptions}
        onChange={filters.setDraftValue}
        onClose={filters.closeDrawer}
        onReset={filters.resetDraft}
        onApply={filters.applyDraft}
      />
    </Stack>
  )
}
