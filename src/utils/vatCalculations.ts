import type { VatBreakdownItem, VatBreakdownRow, VatTotals } from '@/domain/vat'

const roundMoney = (value: number): number => Math.round(value * 100) / 100

export function calculateTotals(items: readonly VatBreakdownItem[]): VatTotals {
  const netAmount = roundMoney(
    items.reduce((sum, item) => sum + item.netAmount, 0),
  )
  const vatAmount = roundMoney(
    items.reduce((sum, item) => sum + item.vatAmount, 0),
  )
  return {
    netAmount,
    vatAmount,
    grossAmount: roundMoney(netAmount + vatAmount),
  }
}

export function buildBreakdownRows(
  items: readonly VatBreakdownItem[],
): VatBreakdownRow[] {
  const { netAmount: totalNet } = calculateTotals(items)
  return items.map((item) => ({
    ...item,
    share: totalNet > 0 ? item.netAmount / totalNet : 0,
  }))
}
