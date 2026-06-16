import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [react()],
    // When VITE_API_URL is set, proxy /api/* to the backend so the browser
    // makes same-origin requests (avoids CORS in dev). The JS client always
    // uses relative paths; VITE_API_URL is only read here and as a presence flag.
    server: apiUrl
      ? { proxy: { '/api': { target: apiUrl, changeOrigin: true } } }
      : {},
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.js'],
    },
  }
})
