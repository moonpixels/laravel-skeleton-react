import { PageNavigation } from '@/components/page-navigation'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export function AccountNavigation() {
  const { t } = useLaravelReactI18n()

  const navItems = [
    {
      label: t('navigation.general'),
      href: route('account.edit'),
      current: route().current('account.edit'),
    },
    {
      label: t('navigation.security'),
      href: route('account.security.edit'),
      current: route().current('account.security.edit'),
    },
    {
      label: t('navigation.preferences'),
      href: route('account.preferences.edit'),
      current: route().current('account.preferences.edit'),
    },
  ]

  return <PageNavigation items={navItems} />
}
