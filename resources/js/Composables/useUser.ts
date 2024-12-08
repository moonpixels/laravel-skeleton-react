import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

export function useUser() {
  const page = usePage()

  const user = computed(() => page.props.user)

  const twoFactorEnabled = computed(() => !!user.value.two_factor_confirmed_at)

  return {
    user,
    twoFactorEnabled,
  }
}
