import { usePage } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect } from 'react'
import { useLocalStorage } from 'react-use'

export interface SupportedLocale {
  name: string
  nativeName: string
  regional: string
}

export type SupportedLocales = Record<string, SupportedLocale>

interface LocaleState {
  currentLocale: string
  supportedLocales: SupportedLocales
  setLocale: (locale: string) => void
}

export const defaultLocale = 'en'

export function getBrowserLocale(): string {
  const { language } = navigator

  return language
}

export function getCountryFromLocale(locale: string): string | null {
  return locale.split('-')[1] || null
}

const LocaleContext = createContext<LocaleState | undefined>(undefined)

export function LocaleProvider({ children, ...props }: PropsWithChildren) {
  const { setLocale: setI18nLocale, currentLocale } = useLaravelReactI18n()

  const page = usePage()

  const supportedLocales = page.props.supportedLocales

  const userLocale = page.props.user?.language

  const [storedLocale, setStoredLocale] = useLocalStorage<string>('locale')

  const preferredLocale = userLocale ?? storedLocale ?? getBrowserLocale() ?? defaultLocale

  const setLocale = useCallback(
    function setLocale(locale: string) {
      const subtag = locale.split('-')[0]
      const languageTag = supportedLocales[locale]
        ? locale
        : supportedLocales[subtag]
          ? subtag
          : null

      if (!languageTag) {
        return
      }

      setI18nLocale(languageTag)
      setStoredLocale(languageTag)
      window.axios.defaults.headers.common['Accept-Language'] = languageTag
      window.document.documentElement.setAttribute('lang', languageTag)
    },
    [setI18nLocale, supportedLocales, setStoredLocale]
  )

  useEffect(() => {
    if (!preferredLocale.startsWith(currentLocale())) {
      setLocale(preferredLocale)
    }
  }, [preferredLocale, currentLocale, setLocale])

  return (
    <LocaleContext.Provider
      {...props}
      value={{
        currentLocale: currentLocale(),
        supportedLocales,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }

  return context
}
