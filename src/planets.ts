export interface Planet {
  readonly name: string
  readonly orbitalPeriod: number // Earth days
  readonly symbol: string // Astronomical symbol (Unicode)
  readonly color: string // Hex accent color
  readonly distance: string // AU from Sun
  /** Use calendar anniversary instead of orbital math (accurate for Earth) */
  readonly calendarBirthday: boolean
}

export const PLANETS: readonly Planet[] = [
  { name: 'Mercury', orbitalPeriod: 87.97, symbol: '☿', color: '#94a3b8', distance: '0.39', calendarBirthday: false },
  { name: 'Venus', orbitalPeriod: 224.7, symbol: '♀', color: '#f0c070', distance: '0.72', calendarBirthday: false },
  { name: 'Earth', orbitalPeriod: 365.25, symbol: '♁', color: '#60a5fa', distance: '1.00', calendarBirthday: true },
  { name: 'Mars', orbitalPeriod: 686.97, symbol: '♂', color: '#f87171', distance: '1.52', calendarBirthday: false },
  { name: 'Jupiter', orbitalPeriod: 4332.59, symbol: '♃', color: '#fb923c', distance: '5.20', calendarBirthday: false },
  { name: 'Saturn', orbitalPeriod: 10759.22, symbol: '♄', color: '#fbbf24', distance: '9.58', calendarBirthday: false },
  { name: 'Uranus', orbitalPeriod: 30688.5, symbol: '♅', color: '#34d399', distance: '19.2', calendarBirthday: false },
  { name: 'Neptune', orbitalPeriod: 60182.0, symbol: '♆', color: '#818cf8', distance: '30.1', calendarBirthday: false },
] as const
