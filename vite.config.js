import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/memuquielTheFest/',
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['.ngrok-free.app']
  }
})
