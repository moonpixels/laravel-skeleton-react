import { PageNavigation } from '@/components/page-navigation'
import { useTranslation } from 'react-i18next'

export function AccountNavigation() {
  const { t } = useTranslation()

  const navItems = [
    {
      label: t('general'),
      href: route('account.edit'),
      current: route().current('account.edit'),
    },
    {
      label: t('security'),
      href: route('account.security.edit'),
      current: route().current('account.security.edit'),
    },
    {
      label: t('preferences'),
      href: route('account.preferences.edit'),
      current: route().current('account.preferences.edit'),
    },
  ]

  return <PageNavigation items={navItems} />
}
