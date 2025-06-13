import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enGBCommon from './locales/en-GB/common.json'
import enGBTranslation from './locales/en-GB/translation.json'
import enGBValidation from './locales/en-GB/validation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ['common', 'translation', 'validation'],
    defaultNS: 'translation',
    resources: {
      'en-GB': {
        common: enGBCommon,
        translation: enGBTranslation,
        validation: enGBValidation,
      },
    },
    fallbackLng: 'en-GB',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  })

export default i18n
