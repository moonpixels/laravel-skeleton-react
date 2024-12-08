import { computed, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useLocalStorage } from '@vueuse/core'
import { useUser } from '@/Composables/useUser'
import { defaultLocale, setI18nLanguage } from '@/Utils/locale'

export function useLocale() {
  const page = usePage()

  const { user } = useUser()

  const supportedLocales = computed(() => page.props.supportedLocales)

  const storedLocale = useLocalStorage('locale', defaultLocale)

  const currentLocale = computed(
    () => user.value?.language || storedLocale.value
  )

  watch(
    currentLocale,
    async (locale, oldLocale) => {
      if (locale !== oldLocale) {
        await setLocale(locale)
      }
    },
    { immediate: true }
  )

  async function setLocale(locale: string): Promise<void> {
    await setI18nLanguage(locale)
    storedLocale.value = locale
  }

  return {
    currentLocale,
    supportedLocales,
  }
}
