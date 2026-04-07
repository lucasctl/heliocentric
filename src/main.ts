import './style.css'
import dayjs from 'dayjs'
import { renderPlanets } from './render.ts'

const input = document.querySelector<HTMLInputElement>('#birthday')
if (input) {
  input.max = dayjs().format('YYYY-MM-DD')
  input.addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value
    if (value) renderPlanets(dayjs(value))
  })
}
