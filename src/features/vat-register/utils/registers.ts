import type { RegisterType } from '@/domain/vat'

export const REGISTER_LABELS: Record<RegisterType, string> = {
  sales: 'Rejestr VAT sprzedaży',
  purchases: 'Rejestr VAT zakupów',
}

/** ASCII-only slugs, safe for file names. */
export const REGISTER_FILE_SLUGS: Record<RegisterType, string> = {
  sales: 'rejestr-vat-sprzedazy',
  purchases: 'rejestr-vat-zakupow',
}
