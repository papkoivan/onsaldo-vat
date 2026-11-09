import type { Contractor } from './buildDocument'

export const contractors = {
  c01: { name: 'Demo Alfa 01', nip: '5250000011' },
  c02: { name: 'Demo Alfa 02', nip: '5260000022' },
  c03: { name: 'Demo Alfa 03', nip: '7740000033' },
  c04: { name: 'Demo Alfa 04', nip: '6760000044' },
  c05: { name: 'Demo Alfa 05', nip: '9560000055' },
  c06: { name: 'Demo Alfa 06', nip: '5270000066' },
  c07: { name: 'Demo Alfa 07', nip: '8980000077' },
  c08: { name: 'Demo Alfa 08', nip: '1130000088' },
  c09: { name: 'Demo Alfa 09', nip: '9510000099' },
  c10: { name: 'Demo Alfa 10', nip: '5170000101' },
  c11: { name: 'Demo Alfa 11', nip: 'DE811000001' },
  c12: { name: 'Demo Alfa 12', nip: 'SE556000000101' },
  c13: { name: 'Demo Alfa 13', nip: 'US12-3456789' },
} as const satisfies Record<string, Contractor>
