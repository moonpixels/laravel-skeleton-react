import { DefaultLayout } from '@/layouts/default-layout'
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
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    )

    // @ts-expect-error: Inertia page component type is not defined, but we know it has a `default` export
    page.default.layout = (page) => (
      <DefaultLayout>
        {page.default?.layout ? (
          <page.default.layout>{page}</page.default.layout>
        ) : (
          page
        )}
      </DefaultLayout>
    )

    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },

  progress: {
    color: '#09090b',
  },
}).then()
