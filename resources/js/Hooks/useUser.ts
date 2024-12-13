import { usePage } from '@inertiajs/react'

export function useUser() {
  const page = usePage()

  const user = page.props.user

  const twoFactorEnabled = !!user?.two_factor_confirmed_at

  return {
    user,
    twoFactorEnabled,
  }
}
