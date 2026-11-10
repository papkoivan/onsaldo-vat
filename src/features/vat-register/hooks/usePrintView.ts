import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

/**
 * The print view is rendered only while printing. `beforeprint` fires for both
 * `window.print()` and the browser's own Ctrl/Cmd+P, so both print the register.
 */
export function usePrintView() {
  const [printedAt, setPrintedAt] = useState<Date | null>(null)

  useEffect(() => {
    // flushSync: the print view must be in the DOM before the browser snapshots the page
    const handleBeforePrint = () => flushSync(() => setPrintedAt(new Date()))
    const handleAfterPrint = () => setPrintedAt(null)

    window.addEventListener('beforeprint', handleBeforePrint)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [])

  const print = useCallback(() => window.print(), [])

  return { printedAt, print }
}
