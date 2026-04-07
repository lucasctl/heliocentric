import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import gsap from 'gsap'
import type { Planet } from './planets.ts'
import { PLANETS } from './planets.ts'
import { getOrbitalAge, getNextBirthday, formatCountdown } from './calculations.ts'

function planetCard(planet: Planet, birthday: Dayjs): string {
  const today = dayjs()
  const age = getOrbitalAge(birthday, planet.orbitalPeriod)
  const ageWhole = Math.floor(age)
  const ageFrac = (age - ageWhole).toFixed(2).slice(1) // ".47"

  const next = getNextBirthday(birthday, planet.orbitalPeriod)
  const daysUntil = next.diff(today, 'day')
  const nextFormatted = next.format('MMM D, YYYY')
  const countdown = formatCountdown(daysUntil)
  const countdownClass = daysUntil === 0 ? 'is-today' : daysUntil <= 30 ? 'is-soon' : ''

  const isFirstOrbit = ageWhole === 0
  const c = planet.color

  const ageHtml = isFirstOrbit
    ? `<div class="age-number" style="color:${c}">${age.toFixed(3)}</div>
       <div class="age-label">orbits — first in progress</div>`
    : `<div>
         <span class="age-number" style="color:${c}">${ageWhole}</span><span class="age-frac">${ageFrac}</span>
       </div>
       <div class="age-label">orbits around the Sun</div>`

  return `
    <div class="planet-card">
      <div class="card-accent" style="background:linear-gradient(90deg,transparent,${c}55,transparent)"></div>
      <div class="card-header">
        <div>
          <span class="planet-symbol" style="color:${c}">${planet.symbol}</span>
          <h2 class="planet-name">${planet.name}</h2>
        </div>
        <span class="planet-distance" style="background:${c}22;color:${c}">${planet.distance} AU</span>
      </div>
      <div class="card-age">${ageHtml}</div>
      <div class="card-footer">
        <div class="next-label">Next birthday</div>
        <div class="next-date">
          <i class="ph ph-calendar-blank" style="color:${c};font-size:13px"></i>
          ${nextFormatted}
        </div>
        <div class="next-countdown ${countdownClass}">${countdown}</div>
      </div>
    </div>
  `
}

export function renderPlanets(birthday: Dayjs): void {
  const resultsEl = document.querySelector<HTMLElement>('#results')
  if (!resultsEl) return

  resultsEl.innerHTML = PLANETS.map((p) => planetCard(p, birthday)).join('')

  // Animate cards in with a stagger — fromTo so no CSS opacity needed
  gsap.fromTo(
    '#results .planet-card',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: 'power3.out' },
  )
}
