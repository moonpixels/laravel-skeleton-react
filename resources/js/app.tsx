import { DarkModeProvider } from '@/Components/Providers/DarkModeProvider'
import { DefaultLayout } from '@/Layouts/DefaultLayout'
import { createInertiaApp } from '@inertiajs/react'
import { LaravelReactI18nProvider } from 'laravel-react-i18n'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ReactElement, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import './bootstrap'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

type Page = ReactNode & { default: { layout: (page: ReactElement) => ReactElement } }

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob<Page>('./Pages/**/*.tsx')
    )
    page.default.layout = page.default.layout || ((page) => <DefaultLayout>{page}</DefaultLayout>)
    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <LaravelReactI18nProvider files={import.meta.glob('/lang/*.json')}>
        <DarkModeProvider>
          <App {...props} />
        </DarkModeProvider>
      </LaravelReactI18nProvider>
    )
  },

  progress: {
    color: '#09090b',
  },
}).then()
