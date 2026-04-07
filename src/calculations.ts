import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

/**
 * Returns the age in planetary orbits (or calendar years for Earth).
 */
export function getOrbitalAge(birthday: Dayjs, orbitalPeriod: number): number {
  const daysLived = dayjs().diff(birthday, 'day')
  return daysLived / orbitalPeriod
}

/**
 * Returns the next planetary birthday.
 *
 * - Earth (calendarBirthday=true): uses the calendar anniversary (same month/day)
 *   so the date is always exact — no drift from the 365.25 approximation.
 * - Other planets: orbit-based. The loop ensures the result is today or future,
 *   guarding against off-by-one from Math.round edge cases.
 */
export function getNextBirthday(birthday: Dayjs, orbitalPeriod: number, calendarBirthday: boolean): Dayjs {
  const today = dayjs()

  if (calendarBirthday) {
    const thisYear = today.year()
    const candidate = birthday.year(thisYear)
    // If this year's anniversary already passed, return next year's
    return candidate.isBefore(today, 'day') ? birthday.year(thisYear + 1) : candidate
  }

  const daysLived = today.diff(birthday, 'day')
  let orbit = Math.floor(daysLived / orbitalPeriod)

  let next: Dayjs
  do {
    orbit++
    next = birthday.add(Math.round(orbit * orbitalPeriod), 'day')
  } while (next.isBefore(today, 'day'))

  return next
}

/**
 * Returns the next `limit` future birthdays, capped at `maxFutureYears` from today.
 */
export function getFutureBirthdays(
  birthday: Dayjs,
  orbitalPeriod: number,
  calendarBirthday: boolean,
  limit: number,
  maxFutureYears = 120,
): Dayjs[] {
  const today = dayjs()

  if (calendarBirthday) {
    const results: Dayjs[] = []
    let year = today.year()
    while (results.length < limit && year <= today.year() + maxFutureYears) {
      const candidate = birthday.year(year)
      if (!candidate.isBefore(today, 'day')) results.push(candidate)
      year++
    }
    return results
  }

  const cutoff = today.add(maxFutureYears * 365, 'day')
  const daysLived = today.diff(birthday, 'day')
  let orbit = Math.floor(daysLived / orbitalPeriod)

  const results: Dayjs[] = []
  while (results.length < limit) {
    orbit++
    const next = birthday.add(Math.round(orbit * orbitalPeriod), 'day')
    if (next.isAfter(cutoff)) break
    if (!next.isBefore(today, 'day')) results.push(next)
  }
  return results
}

/** Human-readable countdown from today to a future date. */
export function formatCountdown(daysUntil: number): string {
  if (daysUntil === 0) return 'today!'
  if (daysUntil === 1) return 'tomorrow'
  if (daysUntil < 365) return `in ${daysUntil} days`
  const years = Math.floor(daysUntil / 365)
  const rem = daysUntil % 365
  return rem === 0 ? `in ${years} yr` : `in ${years} yr, ${rem} d`
}
