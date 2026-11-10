import { useCallback, useState } from 'react'

export type FeedbackSeverity = 'success' | 'error' | 'info'

export interface Feedback {
  message: string
  severity: FeedbackSeverity
}

interface FeedbackState extends Feedback {
  key: number
  open: boolean
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const notify = useCallback((next: Feedback) => {
    setFeedback({ ...next, key: Date.now(), open: true })
  }, [])

  const close = useCallback(() => {
    setFeedback((current) => (current ? { ...current, open: false } : null))
  }, [])

  return { feedback, notify, close }
}

export type FeedbackNotifier = ReturnType<typeof useFeedback>['notify']
