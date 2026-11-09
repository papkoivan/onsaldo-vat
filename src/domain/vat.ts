export type RegisterType = 'sales' | 'purchases'

export type VatRate = number | 'np'

export interface VatBreakdownItem {
  rate: VatRate
  netAmount: number
  vatAmount: number
}

export interface VatTotals {
  netAmount: number
  vatAmount: number
  grossAmount: number
}

export interface VatBreakdownRow extends VatBreakdownItem {
  /** Fraction of total net amount, 0..1 */
  share: number
}

export type KsefStatus = 'confirmed' | 'pending' | 'rejected'

export interface VatDocument {
  id: string
  contractor: string
  nip: string

  issueDate: string
  saleDate: string

  documentNumber: string
  ksefNumber: string | null
  ksefStatus: KsefStatus

  identifier: string
  operationType: string
  jpkCode: string | null
  documentSeries: string

  netAmount: number
  vatAmount: number
  grossAmount: number

  vatBreakdown: VatBreakdownItem[]
}
