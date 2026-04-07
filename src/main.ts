import './style.css'
import dayjs from 'dayjs'
import { renderPlanets } from './render.ts'

// Set the max date to today so future dates can't be picked
const input = document.querySelector<HTMLInputElement>('#birthday')
if (input) {
  input.max = dayjs().format('YYYY-MM-DD')
  input.addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value
    if (value) renderPlanets(dayjs(value))
  })
}
