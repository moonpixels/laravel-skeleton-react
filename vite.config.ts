import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import i18n from 'laravel-react-i18n/vite'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true,
    }),

    react(),

    i18n(),

    tailwindcss(),
  ],
})
