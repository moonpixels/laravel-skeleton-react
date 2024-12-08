import { useNavigatorLanguage } from '@vueuse/core'
import { loadLanguageAsync } from 'laravel-vue-i18n'

export type SupportedLocale = {
  name: string
  nativeName: string
  regional: string
}

export type SupportedLocales = {
  [locale: string]: SupportedLocale
}

export const defaultLocale = 'en'

export async function setI18nLanguage(locale: string): Promise<void> {
  await loadLanguageAsync(locale)

  window.axios.defaults.headers.common['Accept-Language'] = locale

  document.querySelector('html')?.setAttribute('lang', locale)
}

export function getBrowserLocale(): string | undefined {
  const { language } = useNavigatorLanguage()

  return language.value
}

export function getLanguageFromLocale(locale: string): string {
  return locale.split('-')[0]
}

export function getCountryFromLocale(locale: string): string | null {
  return locale.split('-')[1] || null
}

export function isSupportedLocale(
  locale: string,
  supportedLocales: SupportedLocales
) {
  return Object.keys(supportedLocales).includes(locale)
}
