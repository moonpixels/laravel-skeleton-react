import './bootstrap'
import '../css/app.css'

import { createApp, DefineComponent, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ZiggyVue } from '../../vendor/tightenco/ziggy'
import { useDark } from '@vueuse/core'
import { i18nVue } from 'laravel-vue-i18n'
import * as z from 'zod'
import { customErrorMap } from '@/Utils/zodValidation'
import { useLocale } from '@/Composables/useLocale'
import DefaultLayout from '@/Layouts/DefaultLayout.vue'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./Pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./Pages/**/*.vue')
    )

    page.default.layout = DefaultLayout

    return page
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(i18nVue, {
        fallbackLang: 'en',
        fallbackMissingTranslations: 'en',
        resolve: async (lang: string) => {
          const langs = import.meta.glob('../../lang/*.json')
          return await langs[`../../lang/php_${lang}.json`]()
        },
        onLoad: () => z.setErrorMap(customErrorMap),
      })
      .use(ZiggyVue)
      .provide(
        'useDarkTheme',
        useDark({
          initialValue: 'light',
        })
      )
      .mount(el)
  },
  progress: {
    color: '#09090b',
  },
}).then(() => {
  useLocale()
})
