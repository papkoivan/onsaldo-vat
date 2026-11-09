import type { RegisterType, VatBreakdownItem } from '@/domain/vat'

const salesVatBreakdown: readonly VatBreakdownItem[] = [
  { rate: 23, netAmount: 7000, vatAmount: 1610 },
  { rate: 8, netAmount: 2000, vatAmount: 160 },
  { rate: 0, netAmount: 700, vatAmount: 0 },
  { rate: 'np', netAmount: 0, vatAmount: 0 },
]

const purchasesVatBreakdown: readonly VatBreakdownItem[] = [
  { rate: 23, netAmount: 7000, vatAmount: 1610 },
  { rate: 8, netAmount: 2000, vatAmount: 160 },
  { rate: 0, netAmount: 700, vatAmount: 0 },
  { rate: 'np', netAmount: 0, vatAmount: 0 },
]

export const vatBreakdownByRegister: Record<
  RegisterType,
  readonly VatBreakdownItem[]
> = {
  sales: salesVatBreakdown,
  purchases: purchasesVatBreakdown,
}
