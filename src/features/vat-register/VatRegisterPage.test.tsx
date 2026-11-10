import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '@/app/App'
import type { RegisterType, VatDocument } from '@/domain/vat'
import { documentsByRegister } from '@/mocks/documents'
import { CSV_BOM } from '@/utils/csv'
import { downloadTextFile } from '@/utils/download'
import { formatCurrency } from '@/utils/format'

vi.mock('@/utils/download', () => ({ downloadTextFile: vi.fn() }))

const SEARCH_TIMEOUT = { timeout: 2000 }

const normalize = (text: string): string => text.replace(/\s+/g, ' ').trim()

/** Independent of the app code: sums integer grosze of the October 2026 documents. */
function expectedTotals(register: RegisterType, month = '2026-10') {
  const documents = documentsByRegister[register].filter((document) =>
    document.issueDate.startsWith(month),
  )
  const sum = (pick: (document: VatDocument) => number) =>
    documents.reduce(
      (total, document) => total + Math.round(pick(document) * 100),
      0,
    ) / 100
  return {
    count: documents.length,
    net: sum((d) => d.netAmount),
    vat: sum((d) => d.vatAmount),
    gross: sum((d) => d.grossAmount),
  }
}

const documentRows = () =>
  screen.queryAllByRole('button', { name: /szczegóły dokumentu / })

const summaryText = () =>
  normalize(
    screen.getByRole('region', {
      name: 'Podsumowanie finansowe',
      hidden: true,
    }).textContent ?? '',
  )

const expectSummary = (totals: { net: number; vat: number; gross: number }) => {
  const text = summaryText()
  expect(text).toContain(normalize(`Netto${formatCurrency(totals.net)}`))
  expect(text).toContain(normalize(`VAT${formatCurrency(totals.vat)}`))
  expect(text).toContain(normalize(`Brutto${formatCurrency(totals.gross)}`))
}

const firstRowContractor = () => {
  const [row] = screen.getAllByRole('row').slice(1)
  if (!row) throw new Error('no table rows')
  return row.textContent ?? ''
}

function setup() {
  const user = userEvent.setup()
  render(<App />)
  return user
}

beforeEach(() => {
  vi.mocked(downloadTextFile).mockClear()
})

describe('registers and financial summary', () => {
  it('opens the sales register for the default period with a first page of 10', () => {
    setup()
    const totals = expectedTotals('sales')

    expect(screen.getByRole('tab', { name: /sprzedaży/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(documentRows()).toHaveLength(10)
    expect(screen.getByText(`1–10 z ${totals.count}`)).toBeInTheDocument()
    expectSummary(totals)
  })

  it('switches to the purchases register with its own documents and totals', async () => {
    const user = setup()
    const salesFirst = firstRowContractor()

    await user.click(screen.getByRole('tab', { name: /zakupów/ }))

    expect(screen.getByRole('tab', { name: /zakupów/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(firstRowContractor()).not.toBe(salesFirst)
    expectSummary(expectedTotals('purchases'))
  })

  it('keeps the summary calculated from all filtered documents on every page', async () => {
    const user = setup()
    const before = summaryText()

    await user.click(
      screen.getByRole('button', { name: 'Przejdź do strony 2' }),
    )

    expect(documentRows()).toHaveLength(expectedTotals('sales').count - 10)
    expect(summaryText()).toBe(before)
  })
})

describe('search', () => {
  it('filters by contractor name, updates count and totals, and resets pagination', async () => {
    const user = setup()
    await user.click(
      screen.getByRole('button', { name: 'Przejdź do strony 2' }),
    )

    const target = documentsByRegister.sales.find((d) =>
      d.issueDate.startsWith('2026-10'),
    )
    if (!target) throw new Error('mock data needs an October document')

    await user.type(
      screen.getByRole('textbox', { name: 'Szukaj dokumentów' }),
      target.documentNumber,
    )

    await waitFor(() => expect(documentRows()).toHaveLength(1), SEARCH_TIMEOUT)
    expect(screen.getByText('1 dokument')).toBeInTheDocument()
    expectSummary({
      net: target.netAmount,
      vat: target.vatAmount,
      gross: target.grossAmount,
    })
  })

  it('finds documents regardless of Polish diacritics and shows the no-results state', async () => {
    const user = setup()
    const box = screen.getByRole('textbox', { name: 'Szukaj dokumentów' })

    await user.type(box, 'zzz-nie-ma-takiego')
    expect(
      await screen.findByText('Nie znaleziono dokumentów', {}, SEARCH_TIMEOUT),
    ).toBeInTheDocument()
    expectSummary({ net: 0, vat: 0, gross: 0 })

    // the search box icon and the empty-state button do the same thing; use the panel's
    await user.click(
      within(
        screen
          .getByText('Nie znaleziono dokumentów')
          .closest<HTMLElement>('[role="status"]') ?? document.body,
      ).getByRole('button', {
        name: 'Wyczyść wyszukiwanie',
      }),
    )
    await waitFor(() => expect(documentRows()).toHaveLength(10), SEARCH_TIMEOUT)
  })
})

describe('VAT rate breakdown', () => {
  it('is collapsed by default and lists the VAT amount per rate once expanded', async () => {
    const user = setup()
    const toggle = screen.getByRole('button', {
      name: 'Kwoty według stawek VAT VAT · DEMO',
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const list = screen.getByRole('list', { name: 'Kwoty według stawek VAT' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows.map((row) => row.firstElementChild?.textContent)).toEqual([
      '23%',
      'np',
    ])

    // 23% is the only rate with VAT, so it carries the whole VAT total of the summary
    const [rate23, notSubject] = rows
    expect(normalize(rate23?.textContent ?? '')).toContain(
      normalize(formatCurrency(expectedTotals('sales').vat)),
    )
    expect(normalize(notSubject?.textContent ?? '')).toContain(
      normalize(formatCurrency(0)),
    )
    const bars = within(list).getAllByRole('progressbar')
    expect(bars.map((bar) => bar.getAttribute('aria-valuenow'))).toEqual([
      '100',
      '0',
    ])
    expect(screen.queryByText('Razem')).not.toBeInTheDocument()
  })
})

describe('documents table', () => {
  it('shows only identification columns, with amounts moved to the expanded row', async () => {
    const user = setup()
    const headers = screen
      .getAllByRole('columnheader')
      .map((header) =>
        header.textContent?.replace(/, posortowano.*$/, '').trim(),
      )
      .filter(Boolean)

    expect(headers).toEqual([
      'Kontrahent',
      'Data',
      'Numer dokumentu',
      'Numer KSeF',
      'Identyfikator',
      'Szczegóły',
    ])
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

    const [expand] = screen.getAllByRole('button', {
      name: /^Rozwiń szczegóły dokumentu /,
    })
    if (!expand) throw new Error('expected an expandable row')
    await user.click(expand)

    const details = screen.getByRole('region', {
      name: /^Szczegóły dokumentu /,
    })
    for (const label of ['Netto', 'VAT', 'Brutto']) {
      expect(within(details).getAllByText(label).length).toBeGreaterThan(0)
    }
  })
})

describe('sorting', () => {
  it('sorts by document number in both directions without changing the totals', async () => {
    const user = setup()
    const before = summaryText()
    const header = screen.getByRole('columnheader', { name: /Numer dokumentu/ })

    await user.click(
      within(header).getByRole('button', { name: /^Numer dokumentu/ }),
    )
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    const ascending = firstRowContractor()

    await user.click(
      within(header).getByRole('button', { name: /^Numer dokumentu/ }),
    )
    expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(firstRowContractor()).not.toBe(ascending)
    expect(summaryText()).toBe(before)
  })

  it('offers a keyboard-focusable drag handle for every reorderable column', () => {
    setup()
    const handle = screen.getByRole('button', {
      name: 'Przesuń kolumnę Kontrahent',
    })
    expect(handle).toHaveAttribute('aria-roledescription', 'sortable')
    expect(handle).not.toHaveAttribute('tabindex', '-1')
  })

  it('marks the newest-first date order as the default', () => {
    setup()
    expect(screen.getByRole('columnheader', { name: /Data/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
  })
})

describe('filters drawer', () => {
  const openDrawer = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { name: /^Filtry/ }))
    return screen.findByRole('dialog', { name: 'Filtry' })
  }

  const chooseMonth = async (
    user: ReturnType<typeof userEvent.setup>,
    label: string,
  ) => {
    await user.click(screen.getByRole('combobox', { name: 'Miesiąc' }))
    await user.click(await screen.findByRole('option', { name: label }))
  }

  it('does not apply draft values until confirmed and discards them on close', async () => {
    const user = setup()
    const before = summaryText()

    await openDrawer(user)
    await chooseMonth(user, 'wrzesień')
    expect(summaryText()).toBe(before)

    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Filtry' }),
      ).not.toBeInTheDocument(),
    )
    expect(summaryText()).toBe(before)

    await openDrawer(user)
    expect(screen.getByRole('combobox', { name: 'Miesiąc' })).toHaveTextContent(
      'październik',
    )
  })

  it('applies filters, shows removable chips and clears them', async () => {
    const user = setup()

    await openDrawer(user)
    await chooseMonth(user, 'wrzesień')
    await user.click(screen.getByRole('button', { name: 'Zastosuj filtry' }))

    const chips = await screen.findByRole('group', { name: 'Aktywne filtry' })
    expect(within(chips).getByText('wrzesień')).toBeInTheDocument()
    expectSummary(expectedTotals('sales', '2026-09'))

    await user.click(
      within(chips).getByRole('button', { name: 'Wyczyść filtry' }),
    )
    expect(
      screen.queryByRole('group', { name: 'Aktywne filtry' }),
    ).not.toBeInTheDocument()
    expectSummary({
      net:
        documentsByRegister.sales.reduce(
          (s, d) => s + Math.round(d.netAmount * 100),
          0,
        ) / 100,
      vat:
        documentsByRegister.sales.reduce(
          (s, d) => s + Math.round(d.vatAmount * 100),
          0,
        ) / 100,
      gross:
        documentsByRegister.sales.reduce(
          (s, d) => s + Math.round(d.grossAmount * 100),
          0,
        ) / 100,
    })
  })

  it('removes a single filter chip', async () => {
    const user = setup()
    const chips = screen.getByRole('group', { name: 'Aktywne filtry' })
    expect(within(chips).getByText('2026')).toBeInTheDocument()

    await user.click(within(chips).getByText('październik'))
    await user.keyboard('{Delete}')

    expect(
      within(screen.getByRole('group', { name: 'Aktywne filtry' })).queryByText(
        'październik',
      ),
    ).not.toBeInTheDocument()
  })
})

describe('pagination', () => {
  it('changes the page size and reports the visible range', async () => {
    const user = setup()
    const { count } = expectedTotals('sales')

    await user.click(screen.getByRole('combobox', { name: 'Na stronie' }))
    await user.click(await screen.findByRole('option', { name: '20' }))

    expect(documentRows()).toHaveLength(Math.min(20, count))
    expect(
      screen.getByText(`1–${Math.min(20, count)} z ${count}`),
    ).toBeInTheDocument()
  })
})

describe('expanding documents', () => {
  it('keeps several documents expanded at once and across pages', async () => {
    const user = setup()
    const [first, second] = screen.getAllByRole('button', {
      name: /^Rozwiń szczegóły dokumentu /,
    })
    if (!first || !second) throw new Error('expected expandable rows')

    await user.click(first)
    await user.click(second)

    const expanded = screen.getAllByRole('button', {
      name: /^Zwiń szczegóły dokumentu /,
    })
    expect(expanded).toHaveLength(2)
    expect(expanded[0]).toHaveAttribute('aria-expanded', 'true')
    const controlled = expanded[0]?.getAttribute('aria-controls')
    expect(controlled && document.getElementById(controlled)).toBeTruthy()

    await user.click(
      screen.getByRole('button', { name: 'Przejdź do strony 2' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Przejdź do strony 1' }),
    )
    expect(
      screen.getAllByRole('button', { name: /^Zwiń szczegóły dokumentu / }),
    ).toHaveLength(2)
  })
})

describe('CSV export', () => {
  it('exports all filtered documents, not only the visible page, with a BOM and Polish text', async () => {
    const user = setup()
    const { count } = expectedTotals('sales')

    await user.click(screen.getByRole('button', { name: 'Więcej akcji' }))
    await user.click(
      screen.getByRole('menuitem', { name: 'Eksportuj wyniki (CSV)' }),
    )

    expect(downloadTextFile).toHaveBeenCalledTimes(1)
    const [filename, content, mimeType] =
      vi.mocked(downloadTextFile).mock.calls[0] ?? []
    expect(filename).toMatch(/^rejestr-vat-sprzedazy-\d{4}-\d{2}-\d{2}\.csv$/)
    expect(mimeType).toContain('charset=utf-8')
    expect(content?.startsWith(CSV_BOM)).toBe(true)
    expect(content).toContain('Data sprzedaży')
    expect(content?.trim().split('\r\n')).toHaveLength(count + 1)
    expect(await screen.findByText(/Wyeksportowano/)).toBeInTheDocument()
  })
})

describe('print', () => {
  it('renders the print view for the filtered register on beforeprint', async () => {
    const printRoot = document.createElement('div')
    printRoot.id = 'print-root'
    document.body.append(printRoot)
    const user = setup()
    window.print = vi.fn()

    await user.click(screen.getByRole('button', { name: 'Więcej akcji' }))
    await user.click(screen.getByRole('menuitem', { name: 'Drukuj wyniki' }))
    expect(window.print).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('beforeprint'))
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Rejestr VAT sprzedaży',
        hidden: true,
      }),
    ).toBeInTheDocument()

    window.dispatchEvent(new Event('afterprint'))
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          level: 1,
          name: 'Rejestr VAT sprzedaży',
          hidden: true,
        }),
      ).not.toBeInTheDocument(),
    )
  })
})

describe('demo states', () => {
  const choose = (user: ReturnType<typeof userEvent.setup>, label: string) =>
    user.click(screen.getByRole('button', { name: label }))

  it('shows the empty register with zero totals and disabled actions', async () => {
    const user = setup()
    await choose(user, 'Pusty')

    expect(screen.getByText('Brak dokumentów')).toBeInTheDocument()
    expectSummary({ net: 0, vat: 0, gross: 0 })
    expect(screen.getByRole('button', { name: 'Więcej akcji' })).toBeDisabled()
    expect(
      screen.getByRole('textbox', { name: 'Szukaj dokumentów' }),
    ).toBeDisabled()

    await choose(user, 'Wypełniony')
    expect(documentRows()).toHaveLength(10)
  })

  it('shows an error with a retry that restores the data', async () => {
    const user = setup()
    await choose(user, 'Błąd')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nie udało się załadować dokumentów',
    )
    expect(documentRows()).toHaveLength(0)

    await user.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }))
    expect(documentRows()).toHaveLength(10)
    expectSummary(expectedTotals('sales'))
  })

  it('shows loading without documents and recovers', async () => {
    const user = setup()
    await choose(user, 'Ładowanie')

    expect(documentRows()).toHaveLength(0)
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)

    await choose(user, 'Wypełniony')
    expect(documentRows()).toHaveLength(10)
  })

  it('shows no-results and restores the register when going back to filled', async () => {
    const user = setup()
    await choose(user, 'Brak wyników')

    expect(
      await screen.findByText('Nie znaleziono dokumentów'),
    ).toBeInTheDocument()

    await choose(user, 'Wypełniony')
    await waitFor(() => expect(documentRows()).toHaveLength(10), SEARCH_TIMEOUT)
  })
})
