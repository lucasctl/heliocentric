import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import gsap from 'gsap'
import type { Planet } from './planets.ts'
import { PLANETS } from './planets.ts'
import { getOrbitalAge, getNextBirthday, getFutureBirthdays, formatCountdown } from './calculations.ts'

// ── Planet card ────────────────────────────────────────────────────────────────

function planetCard(planet: Planet, birthday: Dayjs): string {
  const today = dayjs()
  const age = getOrbitalAge(birthday, planet.orbitalPeriod)
  const ageWhole = Math.floor(age)
  const ageFrac = (age - ageWhole).toFixed(2).slice(1) // ".47"
  const isFirstYear = ageWhole === 0

  const next = getNextBirthday(birthday, planet.orbitalPeriod, planet.calendarBirthday)
  const daysUntil = next.diff(today, 'day')
  const countdownClass =
    daysUntil === 0 ? 'text-amber-400 font-semibold' : daysUntil <= 30 ? 'text-emerald-400' : 'text-white/30'
  const c = planet.color

  const AU_TITLE = 'Astronomical Unit — average Earth–Sun distance (~150 million km / 93 million mi)'

  return `
    <button
      class="card relative overflow-hidden rounded-2xl p-5 flex flex-col text-left w-full cursor-pointer"
      data-planet="${planet.name}"
      aria-label="View upcoming birthdays on ${planet.name}"
    >
      <div class="absolute inset-x-0 top-0 h-px" style="background:linear-gradient(90deg,transparent,${c}55,transparent)"></div>

      <div class="flex items-start justify-between mb-4">
        <div>
          <span class="planet-symbol block text-4xl font-bold leading-none mb-1" style="color:${c}">${planet.symbol}</span>
          <h2 class="text-base font-semibold text-white/90 m-0">${planet.name}</h2>
        </div>
        <abbr
          title="${AU_TITLE}"
          class="rounded-full px-2 py-0.5 text-xs font-medium no-underline cursor-help"
          style="background:${c}22;color:${c}"
        >${planet.distance}&nbsp;AU</abbr>
      </div>

      <div class="mb-4">
        ${
          isFirstYear
            ? `<span class="text-3xl font-bold leading-none tracking-tight" data-target-age="${age.toFixed(3)}" style="color:${c}">0.000</span>
               <div class="text-xs text-white/30 mt-1">first year in progress</div>`
            : `<div class="flex items-baseline">
                 <span class="text-4xl font-bold leading-none tracking-tight" data-target-age="${ageWhole}" style="color:${c}">0</span><span class="text-xl font-semibold text-white/35">${ageFrac}</span>
               </div>
               <div class="text-xs text-white/30 mt-1">years old</div>`
        }
      </div>

      <div class="mt-auto pt-3 border-t border-white/10">
        <div class="mb-1.5" style="font-size:0.6rem;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.25)">Next birthday</div>
        <div class="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-0.5">
          <i class="ph ph-calendar-blank text-xs" style="color:${c}"></i>
          ${next.format('MMM D, YYYY')}
        </div>
        <div class="text-xs ${countdownClass}">${formatCountdown(daysUntil)}</div>
      </div>
    </button>
  `
}

// ── Planet detail panel ────────────────────────────────────────────────────────

function birthdayRow(date: Dayjs, orbit: number, birthday: Dayjs, today: Dayjs): string {
  const daysUntil = date.diff(today, 'day')
  const earthAgeYears = (date.diff(birthday, 'day') / 365.25).toFixed(1)
  return `
    <tr>
      <td class="text-white/40 tabular-nums">#${orbit}</td>
      <td class="font-medium text-white/80">${date.format('MMM D, YYYY')}</td>
      <td class="text-white/50">${earthAgeYears} Earth yrs</td>
      <td class="text-white/40 tabular-nums">${formatCountdown(daysUntil)}</td>
    </tr>
  `
}

function renderDetail(planet: Planet, birthday: Dayjs): void {
  const panel = document.querySelector<HTMLElement>('#planet-detail')
  if (!panel) return

  const today = dayjs()
  const completedOrbits = Math.floor(today.diff(birthday, 'day') / planet.orbitalPeriod)
  const dates = getFutureBirthdays(birthday, planet.orbitalPeriod, planet.calendarBirthday, 15)
  const c = planet.color

  const rows =
    dates.length === 0
      ? `<tr><td colspan="4" class="text-center py-6 text-white/30 italic">No more birthdays within the next 120 years.</td></tr>`
      : dates.map((date, i) => birthdayRow(date, completedOrbits + 1 + i, birthday, today)).join('')

  panel.innerHTML = `
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <span class="planet-symbol text-4xl font-bold leading-none" style="color:${c}">${planet.symbol}</span>
        <div>
          <h3 class="text-lg font-semibold text-white/90 m-0">${planet.name}</h3>
          <p class="text-xs text-white/35 m-0">Upcoming planetary birthdays</p>
        </div>
      </div>
      <button id="close-detail" class="detail-close" aria-label="Close">
        <i class="ph ph-x text-base"></i>
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="birthday-table w-full">
        <thead>
          <tr><th>Year</th><th>Date</th><th>Your Earth age</th><th>Time away</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${dates.length > 0 ? `<p class="text-xs text-white/25 mt-4 m-0">Orbital calculations use a fixed period (no precession or leap-second corrections).</p>` : ''}
  `

  panel.classList.remove('hidden')
  gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' })

  document.querySelector('#close-detail')?.addEventListener('click', () => {
    gsap.to(panel, {
      opacity: 0,
      y: 8,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => panel.classList.add('hidden'),
    })
  })
}

// ── Main render ────────────────────────────────────────────────────────────────

// Stored so the click handler (set up once) can always see the latest birthday
let currentBirthday: Dayjs | null = null
let clickHandlerAttached = false

export function renderPlanets(birthday: Dayjs): void {
  currentBirthday = birthday

  const resultsEl = document.querySelector<HTMLElement>('#results')
  const detailEl = document.querySelector<HTMLElement>('#planet-detail')
  if (!resultsEl) return

  // Close any open detail panel when the birthday changes
  if (detailEl && !detailEl.classList.contains('hidden')) {
    detailEl.classList.add('hidden')
    detailEl.innerHTML = ''
  }

  resultsEl.innerHTML = PLANETS.map((p) => planetCard(p, birthday)).join('')

  // 1. Stagger cards in
  gsap.fromTo(
    '#results .card',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: 'power3.out' },
  )

  // 2. Count-up animation on age numbers
  document.querySelectorAll<HTMLElement>('[data-target-age]').forEach((el, i) => {
    const raw = el.dataset.targetAge ?? '0'
    const isDecimal = raw.includes('.')
    const target = parseFloat(raw)
    const obj = { n: 0 }
    gsap.to(obj, {
      n: target,
      duration: 1.1,
      delay: i * 0.055 + 0.05,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = isDecimal ? obj.n.toFixed(3) : Math.round(obj.n).toLocaleString()
      },
    })
  })

  // 3. Card click → show future birthdays.
  //    Listener is attached only once so changing the birthday date doesn't
  //    stack up duplicate handlers on the same element.
  if (!clickHandlerAttached) {
    clickHandlerAttached = true
    resultsEl.addEventListener('click', (e) => {
      if (!currentBirthday) return
      const btn = (e.target as Element).closest<HTMLElement>('[data-planet]')
      if (!btn) return
      const planet = PLANETS.find((p) => p.name === btn.dataset.planet)
      if (!planet) return

      renderDetail(planet, currentBirthday)
      document.querySelector('#planet-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
}
