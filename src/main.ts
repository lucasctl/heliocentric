import './style.css'
import dayjs from 'dayjs'

const PLANETS = [
  { name: 'Mercury', orbitalPeriod: 87.97 },
  { name: 'Venus', orbitalPeriod: 224.7 },
  { name: 'Earth', orbitalPeriod: 365.25 },
  { name: 'Mars', orbitalPeriod: 686.97 },
  { name: 'Jupiter', orbitalPeriod: 4332.59 },
  { name: 'Saturn', orbitalPeriod: 10759.22 },
  { name: 'Uranus', orbitalPeriod: 30688.5 },
  { name: 'Neptune', orbitalPeriod: 60182.0 },
]

function getNextBirthday(
  birthday: dayjs.Dayjs,
  orbitalPeriod: number,
): dayjs.Dayjs {
  const today = dayjs()
  const daysLived = today.diff(birthday, 'day')
  const completedOrbits = Math.floor(daysLived / orbitalPeriod)
  const nextOrbitDay = (completedOrbits + 1) * orbitalPeriod
  return birthday.add(Math.round(nextOrbitDay), 'day')
}

function render(birthday: dayjs.Dayjs) {
  const today = dayjs()
  const daysLived = today.diff(birthday, 'day')

  const rows = PLANETS.map((planet) => {
    const age = (daysLived / planet.orbitalPeriod).toFixed(2)
    const next = getNextBirthday(birthday, planet.orbitalPeriod).format(
      'MMM D, YYYY',
    )
    return `
      <tr>
        <td>${planet.name}</td>
        <td>${age}</td>
        <td>${next}</td>
      </tr>`
  }).join('')

  document.querySelector<HTMLElement>('#results')!.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Planet</th>
          <th>Your age</th>
          <th>Next birthday</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <h1>Heliocentric</h1>
    <p>Enter your birthday to see how old you are on every planet.</p>
    <label for="birthday">Birthday</label>
    <input type="date" id="birthday" max="${dayjs().format('YYYY-MM-DD')}" />
    <div id="results"></div>
  </main>
`

document
  .querySelector<HTMLInputElement>('#birthday')!
  .addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value
    if (value) render(dayjs(value))
  })
