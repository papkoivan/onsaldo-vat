import { describe, expect, it } from 'vitest'
import type { RegisterType } from '@/domain/vat'
import { ALL_FILTER_VALUE } from '@/features/vat-register/types/filters'
import {
  aggregateVatBreakdown,
  calculateDocumentTotals,
  calculateTotals,
  calculateVatAmount,
  sumMoney,
} from '@/utils/vatCalculations'
import { documentsByRegister } from './documents'
import { getFilterOptions } from './filterOptions'

const registers: RegisterType[] = ['sales', 'purchases']

describe.each(registers)('%s mock register', (register) => {
  const documents = documentsByRegister[register]

  it('has unique ids, document numbers and identifiers', () => {
    for (const field of ['id', 'documentNumber', 'identifier'] as const) {
      const values = documents.map((document) => document[field])
      expect(new Set(values).size, field).toBe(values.length)
    }
  })

  it('keeps net + VAT = gross on every document', () => {
    for (const document of documents) {
      expect(
        sumMoney([document.netAmount, document.vatAmount]),
        document.documentNumber,
      ).toBe(document.grossAmount)
    }
  })

  it('has per-rate breakdowns that add up to the document and use correct VAT', () => {
    for (const document of documents) {
      expect(calculateTotals(document.vatBreakdown), document.id).toEqual({
        netAmount: document.netAmount,
        vatAmount: document.vatAmount,
        grossAmount: document.grossAmount,
      })
      for (const item of document.vatBreakdown) {
        expect(item.vatAmount, document.id).toBe(
          calculateVatAmount(item.netAmount, item.rate),
        )
      }
      const rates = document.vatBreakdown.map((item) => item.rate)
      expect(new Set(rates).size, document.id).toBe(rates.length)
    }
  })

  it('aggregates to the register totals', () => {
    expect(calculateTotals(aggregateVatBreakdown(documents))).toEqual(
      calculateDocumentTotals(documents),
    )
  })

  it('uses ISO dates and assigns a KSeF number only to confirmed documents', () => {
    for (const document of documents) {
      expect(document.issueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(document.saleDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(document.ksefNumber !== null, document.id).toBe(
        document.ksefStatus === 'confirmed',
      )
    }
  })

  it('only uses values reachable through the register filters', () => {
    const options = getFilterOptions(register)
    const has = (key: 'operationType' | 'documentSeries', value: string) =>
      options[key].some((option) => option.value === value)

    for (const document of documents) {
      expect(has('operationType', document.operationType), document.id).toBe(
        true,
      )
      expect(has('documentSeries', document.documentSeries), document.id).toBe(
        true,
      )
      if (document.jpkCode !== null) {
        expect(
          options.jpkCode.some((option) => option.value === document.jpkCode),
          document.id,
        ).toBe(true)
      }
    }
  })
})

describe('default period', () => {
  it('has more than one page of documents so pagination is demonstrable', () => {
    expect(ALL_FILTER_VALUE).toBe('all')
    const october = documentsByRegister.sales.filter((document) =>
      document.issueDate.startsWith('2026-10'),
    )
    expect(october.length).toBeGreaterThan(10)
  })
})
