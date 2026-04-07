import tailwindcss from '@tailwindcss/vite'
import type { UserConfig } from 'vite'

export default {
  base: '/heliocentric/',
  plugins: [tailwindcss()],
} satisfies UserConfig
