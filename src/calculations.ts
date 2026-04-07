import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

/**
 * Returns the age in planetary orbits as a floating-point number.
 * e.g. 36.47 means 36 full orbits completed, 47% through the next.
 */
export function getOrbitalAge(birthday: Dayjs, orbitalPeriod: number): number {
  const daysLived = dayjs().diff(birthday, 'day')
  return daysLived / orbitalPeriod
}

/**
 * Returns the date of the next planetary birthday (next completed orbit).
 * Guaranteed to be today or in the future — the loop handles rounding edge
 * cases where Math.round can place the date in the past.
 */
export function getNextBirthday(birthday: Dayjs, orbitalPeriod: number): Dayjs {
  const today = dayjs()
  const daysLived = today.diff(birthday, 'day')
  let orbit = Math.floor(daysLived / orbitalPeriod)

  let next: Dayjs
  do {
    orbit++
    next = birthday.add(Math.round(orbit * orbitalPeriod), 'day')
  } while (next.isBefore(today, 'day'))

  return next
}

/** Human-readable countdown to a future date. */
export function formatCountdown(daysUntil: number): string {
  if (daysUntil === 0) return 'today!'
  if (daysUntil === 1) return 'tomorrow'
  if (daysUntil < 365) return `in ${daysUntil} days`
  const years = Math.floor(daysUntil / 365)
  const rem = daysUntil % 365
  return rem === 0 ? `in ${years} yr` : `in ${years} yr, ${rem} d`
}
