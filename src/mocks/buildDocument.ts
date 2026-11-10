import type {
  KsefStatus,
  RegisterType,
  VatBreakdownItem,
  VatDocument,
  VatRate,
} from '@/domain/vat'
import { calculateTotals, calculateVatAmount } from '@/utils/vatCalculations'

export interface Contractor {
  name: string
  nip: string
}

export interface VatLine {
  rate: VatRate
  netAmount: number
}

export interface DocumentSeed {
  contractor: Contractor
  issueDate: string
  saleDate: string
  documentNumber: string
  ksefStatus: KsefStatus
  operationType: string
  jpkCode: string | null
  documentSeries: string
  lines: readonly VatLine[]
}

export const OWN_COMPANY_NIP = '5250000000'

const IDENTIFIER_PREFIX: Record<RegisterType, string> = {
  sales: 'SPR',
  purchases: 'ZAK',
}

const lineToBreakdown = ({ rate, netAmount }: VatLine): VatBreakdownItem => ({
  rate,
  netAmount,
  vatAmount: calculateVatAmount(netAmount, rate),
})

/** Stable pseudo-random hex so mock KSeF numbers do not change between reloads. */
function hexDigest(input: string, length: number): string {
  let hash = 2166136261
  for (const char of input) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  }
  let result = ''
  while (result.length < length) {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822519) + 374761393
    result += (hash >>> 0).toString(16).padStart(8, '0')
  }
  return result.slice(0, length).toUpperCase()
}

function buildKsefNumber(issuerNip: string, seed: DocumentSeed): string {
  const date = seed.issueDate.replaceAll('-', '')
  const body = hexDigest(seed.documentNumber, 12)
  const checksum = hexDigest(`${issuerNip}${date}${body}`, 2)
  return `${issuerNip}-${date}-${body}-${checksum}`
}

export function buildDocument(
  register: RegisterType,
  seed: DocumentSeed,
  index: number,
): VatDocument {
  const vatBreakdown = seed.lines.map(lineToBreakdown)
  const { netAmount, vatAmount, grossAmount } = calculateTotals(vatBreakdown)
  const sequence = String(index + 1).padStart(3, '0')
  const period = seed.issueDate.slice(2, 7).replace('-', '')
  const issuerNip = register === 'sales' ? OWN_COMPANY_NIP : seed.contractor.nip

  return {
    id: `${register}-${sequence}`,
    contractor: seed.contractor.name,
    nip: seed.contractor.nip,
    issueDate: seed.issueDate,
    saleDate: seed.saleDate,
    documentNumber: seed.documentNumber,
    // a number is assigned by KSeF only once the invoice has been accepted
    ksefNumber:
      seed.ksefStatus === 'confirmed' ? buildKsefNumber(issuerNip, seed) : null,
    ksefStatus: seed.ksefStatus,
    identifier: `${IDENTIFIER_PREFIX[register]}-${period}-${sequence}`,
    operationType: seed.operationType,
    jpkCode: seed.jpkCode,
    documentSeries: seed.documentSeries,
    netAmount,
    vatAmount,
    grossAmount,
    vatBreakdown,
  }
}
