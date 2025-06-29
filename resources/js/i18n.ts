import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enGBTranslation from './locales/en-GB/translation.json'
import enGBValidation from './locales/en-GB/validation.json'

const resources = {
  'en-GB': {
    translation: enGBTranslation,
    validation: enGBValidation,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['translation', 'validation'],
    defaultNS: 'translation',
    resources,
    fallbackLng: 'en-GB',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  })

export default i18n
