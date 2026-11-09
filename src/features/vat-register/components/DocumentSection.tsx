import Stack from '@mui/material/Stack'
import type { DocumentSearchState } from '../hooks/useDocumentSearch'
import type { VatFiltersState } from '../hooks/useVatFilters'
import { ActiveFilters } from './ActiveFilters'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import { DocumentToolbar } from './DocumentToolbar'
import { FiltersDrawer } from './FiltersDrawer'

interface DocumentSectionProps {
  documentCount: number
  search: DocumentSearchState
  filters: VatFiltersState
}

const TITLE_ID = 'documents-section-title'

export function DocumentSection({
  documentCount,
  search,
  filters,
}: DocumentSectionProps) {
  const hasActiveFilters = filters.activeFilters.length > 0

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
        count={documentCount}
      />
      <DocumentToolbar
        searchValue={search.inputValue}
        onSearchChange={search.setInputValue}
        onSearchClear={search.clear}
        activeFilterCount={filters.activeFilters.length}
        onOpenFilters={filters.openDrawer}
        onPrint={() => window.print()}
        canResetAll={hasActiveFilters || search.inputValue !== ''}
        onResetAll={handleResetAll}
      />
      <ActiveFilters
        filters={filters.activeFilters}
        onRemove={filters.removeFilter}
        onClearAll={filters.clearAll}
      />
      <FiltersDrawer
        open={filters.isDrawerOpen}
        values={filters.draftFilters}
        onChange={filters.setDraftValue}
        onClose={filters.closeDrawer}
        onReset={filters.resetDraft}
        onApply={filters.applyDraft}
      />
    </Stack>
  )
}
