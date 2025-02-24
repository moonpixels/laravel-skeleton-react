import { SidebarProvider } from '@/components/ui/sidebar'
import { DarkModeProvider } from '@/contexts/dark-mode-context'
import { defaultLocale } from '@/contexts/locale-context'
import { DefaultLayout } from '@/layouts/default-layout'
import { createInertiaApp } from '@inertiajs/react'
import { LaravelReactI18nProvider } from 'laravel-react-i18n'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import './bootstrap'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

type Page = ReactElement & {
  default: { layout: (page: ReactElement) => ReactElement }
}

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<Page>('./pages/**/*.tsx')
    )
    page.default.layout = page.default.layout || ((page) => <DefaultLayout>{page}</DefaultLayout>)
    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <LaravelReactI18nProvider
        fallbackLocale={defaultLocale}
        files={import.meta.glob('/lang/*.json')}
      >
        <DarkModeProvider>
          <SidebarProvider>
            <App {...props} />
          </SidebarProvider>
        </DarkModeProvider>
      </LaravelReactI18nProvider>
    )
  },

  progress: {
    color: '#09090b',
  },
}).then()
