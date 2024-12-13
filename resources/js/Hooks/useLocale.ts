import { useUser } from '@/Hooks/useUser'
import { usePage } from '@inertiajs/react'
import { useLocalStorage } from '@reactuses/core'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useEffect } from 'react'

export type SupportedLocale = {
  name: string
  nativeName: string
  regional: string
}

export type SupportedLocales = {
  [locale: string]: SupportedLocale
}

export const defaultLocale = 'en'

export function useLocale() {
  const { setLocale: setI18nLocale } = useLaravelReactI18n()

  const page = usePage()

  const { user } = useUser()

  const [storedLocale, setStoredLocale] = useLocalStorage('locale', defaultLocale)

  const supportedLocales = page.props.supportedLocales

  const currentLocale = user?.language || storedLocale || defaultLocale

  useEffect(() => {
    async function updateLocale() {
      if (currentLocale && getBrowserLocale() !== currentLocale) {
        await setLocale(currentLocale)
      }
    }

    updateLocale()
  }, [currentLocale])

  async function setLocale(locale: string) {
    setI18nLocale(locale)

    window.axios.defaults.headers.common['Accept-Language'] = locale

    document.querySelector('html')?.setAttribute('lang', locale)

    setStoredLocale(locale)
  }

  function getBrowserLocale(): string {
    const { language } = navigator

    return language
  }

  function getCountryFromLocale(locale: string): string | null {
    return locale.split('-')[1] || null
  }

  return {
    currentLocale,
    supportedLocales,
    getBrowserLocale,
    getCountryFromLocale,
  }
}
