import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { RegisterType } from '@/domain/vat'
import { getFilterOptions } from '@/mocks/filterOptions'
import { layout } from '@/theme/tokens'
import { PageHeader } from './components/PageHeader'
import type { PageHeaderBadge } from './components/PageHeader'
import { DemoStateSwitcher } from './components/DemoStateSwitcher'
import { DocumentSection } from './components/DocumentSection'
import { RegisterTabs } from './components/RegisterTabs'
import { VatConfirmationNotice } from './components/VatConfirmationNotice'
import { VatRateBreakdown } from './components/VatRateBreakdown'
import { VatSummary } from './components/VatSummary'
import { useDocumentSearch } from './hooks/useDocumentSearch'
import { useDocuments } from './hooks/useDocuments'
import { useVatFilters } from './hooks/useVatFilters'
import { DEMO_NO_RESULTS_QUERY } from './types/viewState'
import type { DemoDataState, VatViewState } from './types/viewState'
import { deriveViewState, getDataStatus } from './utils/viewState'

const headerBadges: readonly PageHeaderBadge[] = [
  { label: 'Wymaga potwierdzenia', tone: 'warning' },
  { label: 'DEMO', tone: 'neutral' },
]

const COMPANY_NAME = 'Onsaldo Preview Sp. z o.o.'

export function VatRegisterPage() {
  const [register, setRegister] = useState<RegisterType>('sales')
  const search = useDocumentSearch()
  const filters = useVatFilters()
  const [dataState, setDataState] = useState<DemoDataState>('filled')

  const { documents, totals, breakdown, sourceCount } = useDocuments(
    register,
    search.query,
    filters.appliedFilters,
    dataState,
  )
  const viewState = deriveViewState({
    dataState,
    sourceCount,
    matchCount: documents.length,
  })
  const financialStatus = getDataStatus(viewState)

  const handleRegisterChange = (next: RegisterType) => {
    setRegister(next)
    filters.resetRegisterFilters()
  }

  // "No results" is a preset of the filled state: it types a query that matches nothing.
  const handleDemoStateChange = (next: VatViewState) => {
    if (next === 'no-results') {
      setDataState('filled')
      search.setValueNow(DEMO_NO_RESULTS_QUERY)
      return
    }
    if (
      next === 'filled' &&
      (viewState === 'no-results' ||
        search.inputValue === DEMO_NO_RESULTS_QUERY)
    ) {
      search.clear()
      if (viewState === 'no-results') filters.clearAll()
    }
    setDataState(next)
  }

  return (
    <Box
      component="main"
      sx={{
        maxWidth: layout.maxContentWidth,
        mx: 'auto',
        px: {
          xs: `${layout.pagePaddingXMobile}px`,
          md: `${layout.pagePaddingX}px`,
        },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={{ xs: 2, md: 2.5 }}>
        <DemoStateSwitcher value={viewState} onChange={handleDemoStateChange} />
        <PageHeader
          companyName={COMPANY_NAME}
          title="Rejestry i VAT"
          subtitle="Sprzedaż i zakupy w wybranym okresie — podgląd danych demonstracyjnych."
          badges={headerBadges}
        />
        <RegisterTabs value={register} onChange={handleRegisterChange} />
        <VatConfirmationNotice>
          Kontekst VAT wymaga potwierdzenia. Poniżej wyłącznie dane
          demonstracyjne, nie ewidencja organizacji.
        </VatConfirmationNotice>
        <Stack useFlexGap spacing={{ xs: 1.5, md: 2 }}>
          <VatSummary totals={totals} status={financialStatus} />
          <VatRateBreakdown items={breakdown} status={financialStatus} />
        </Stack>
        <DocumentSection
          register={register}
          companyName={COMPANY_NAME}
          documents={documents}
          filterOptions={getFilterOptions(register)}
          search={search}
          filters={filters}
          viewState={viewState}
          dataScope={dataState}
          onRetry={() => setDataState('filled')}
        />
      </Stack>
    </Box>
  )
}
