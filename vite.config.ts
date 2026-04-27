import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SportReact/', // <-- ОБОВ'ЯЗКОВО ДОДАЙ ЦЕЙ РЯДОК (зверни увагу на слеші на початку і в кінці)
})