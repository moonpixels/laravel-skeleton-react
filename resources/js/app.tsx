import { defaultLocale } from '@/contexts/locale-context'
import { createInertiaApp } from '@inertiajs/react'
import { configureEcho } from '@laravel/echo-react'
import { LaravelReactI18nProvider } from 'laravel-react-i18n'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import './bootstrap'

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
    createRoot(el).render(
      <LaravelReactI18nProvider
        fallbackLocale={defaultLocale}
        files={import.meta.glob('/lang/*.json')}
      >
        <App {...props} />
      </LaravelReactI18nProvider>
    )
  },

  progress: {
    color: '#09090b',
  },
}).then()
