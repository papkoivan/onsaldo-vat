import SearchOffOutlined from '@mui/icons-material/SearchOffOutlined'
import Button from '@mui/material/Button'
import { StatePanel } from './StatePanel'

interface NoResultsStateProps {
  searchQuery: string
  hasActiveFilters: boolean
  onClearSearch: () => void
  onClearFilters: () => void
}

export function NoResultsState({
  searchQuery,
  hasActiveFilters,
  onClearSearch,
  onClearFilters,
}: NoResultsStateProps) {
  const hasSearch = searchQuery !== ''

  return (
    <StatePanel
      role="status"
      tone="neutral"
      icon={<SearchOffOutlined />}
      title="Nie znaleziono dokumentów"
      actions={
        <>
          {hasSearch && (
            <Button variant="outlined" onClick={onClearSearch}>
              Wyczyść wyszukiwanie
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="outlined" onClick={onClearFilters}>
              Wyczyść filtry
            </Button>
          )}
        </>
      }
    >
      {hasSearch
        ? `Wyszukiwanie „${searchQuery}” ${hasActiveFilters ? 'wraz z aktywnymi filtrami ' : ''}nie zwróciło żadnych dokumentów.`
        : 'Aktywne filtry nie zwróciły żadnych dokumentów.'}{' '}
      Zmień kryteria lub wyczyść je, aby zobaczyć wszystkie dokumenty rejestru.
    </StatePanel>
  )
}
