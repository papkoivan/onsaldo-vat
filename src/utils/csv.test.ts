import { describe, expect, it } from 'vitest'
import { CSV_BOM, buildCsv, escapeCsvField, neutralizeFormula } from './csv'

describe('escapeCsvField', () => {
  it('leaves plain text untouched', () => {
    expect(escapeCsvField('Demo Alfa 04')).toBe('Demo Alfa 04')
  })

  it.each([
    ['a;b', '"a;b"'],
    ['a,b', '"a,b"'],
    ['line\nbreak', '"line\nbreak"'],
    ['line\r\nbreak', '"line\r\nbreak"'],
  ])('quotes %j', (input, expected) => {
    expect(escapeCsvField(input)).toBe(expected)
  })

  it('doubles embedded quotes', () => {
    expect(escapeCsvField('5" "pipe"')).toBe('"5"" ""pipe"""')
  })
})

describe('neutralizeFormula', () => {
  it.each(['=SUM(A1)', '+1', '-1', '@cmd'])('prefixes %j', (input) => {
    expect(neutralizeFormula(input)).toBe(`'${input}`)
  })

  it('keeps ordinary text', () => {
    expect(neutralizeFormula('FV/2026/10/0001')).toBe('FV/2026/10/0001')
  })
})

describe('buildCsv', () => {
  it('starts with a UTF-8 BOM and uses CRLF-separated, semicolon-delimited rows', () => {
    const csv = buildCsv([
      ['Kontrahent', 'Kwota'],
      ['Zażółć; gęślą', '1,50'],
    ])
    expect(csv.startsWith(CSV_BOM)).toBe(true)
    expect(csv.slice(1)).toBe('Kontrahent;Kwota\r\n"Zażółć; gęślą";"1,50"\r\n')
  })
})
