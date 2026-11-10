// Semicolon is the list separator of Polish spreadsheet locales (comma is the decimal mark there).
export const CSV_DELIMITER = ';'
// Without a BOM Excel opens UTF-8 files in a legacy code page and mangles Polish letters.
export const CSV_BOM = '\uFEFF'
const CSV_LINE_BREAK = '\r\n'

const NEEDS_QUOTING = /[;,"\r\n]/
const FORMULA_PREFIX = /^[=+\-@\t\r]/

export function escapeCsvField(value: string): string {
  return NEEDS_QUOTING.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

/** Stops free text from being evaluated as a formula when the file is opened in a spreadsheet. */
export const neutralizeFormula = (value: string): string =>
  FORMULA_PREFIX.test(value) ? `'${value}` : value

export function buildCsv(rows: readonly (readonly string[])[]): string {
  const body = rows
    .map((row) => row.map(escapeCsvField).join(CSV_DELIMITER))
    .join(CSV_LINE_BREAK)
  return `${CSV_BOM}${body}${CSV_LINE_BREAK}`
}
