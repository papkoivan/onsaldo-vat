import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { RegisterType } from '@/domain/vat'
import { getFilterOptions } from '@/mocks/filterOptions'
import { layout } from '@/theme/tokens'
import { PageHeader } from './components/PageHeader'
import type { PageHeaderBadge } from './components/PageHeader'
import { DocumentSection } from './components/DocumentSection'
import { RegisterTabs } from './components/RegisterTabs'
import { VatConfirmationNotice } from './components/VatConfirmationNotice'
import { VatRateBreakdown } from './components/VatRateBreakdown'
import { VatSummary } from './components/VatSummary'
import { useDocumentSearch } from './hooks/useDocumentSearch'
import { useDocuments } from './hooks/useDocuments'
import { useVatFilters } from './hooks/useVatFilters'

const headerBadges: readonly PageHeaderBadge[] = [
  { label: 'Wymaga potwierdzenia', tone: 'warning' },
  { label: 'DEMO', tone: 'neutral' },
]

export function VatRegisterPage() {
  const [register, setRegister] = useState<RegisterType>('sales')
  const search = useDocumentSearch()
  const filters = useVatFilters()

  const { documents, totals, breakdown } = useDocuments(
    register,
    search.query,
    filters.appliedFilters,
  )

  const handleRegisterChange = (next: RegisterType) => {
    setRegister(next)
    filters.resetRegisterFilters()
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
        <PageHeader
          companyName="Onsaldo Preview Sp. z o.o."
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
          <VatSummary totals={totals} />
          <VatRateBreakdown items={breakdown} />
        </Stack>
        <DocumentSection
          documents={documents}
          filterOptions={getFilterOptions(register)}
          search={search}
          filters={filters}
        />
      </Stack>
    </Box>
  )
}
