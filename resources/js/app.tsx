import { createInertiaApp } from '@inertiajs/react'
import { configureEcho } from '@laravel/echo-react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import './bootstrap'
import './i18n'

configureEcho({
  broadcaster: 'reverb',
})

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    ),

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },

  progress: {
    color: '#09090b',
  },
}).then()
