import type { KsefStatus } from '@/domain/vat'

export const KSEF_STATUS_LABELS: Record<KsefStatus, string> = {
  confirmed: 'Potwierdzony',
  pending: 'Brak potwierdzenia',
  rejected: 'Odrzucony',
}
