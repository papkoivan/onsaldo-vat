import type { RegisterType, VatDocument } from '@/domain/vat'
import { purchaseDocuments } from './purchaseDocuments'
import { salesDocuments } from './salesDocuments'

export const documentsByRegister: Record<RegisterType, readonly VatDocument[]> =
  {
    sales: salesDocuments,
    purchases: purchaseDocuments,
  }
