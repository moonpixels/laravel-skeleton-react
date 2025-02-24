import { type BreadcrumbItemType, PageBreadcrumbs } from '@/components/page-breadcrumbs'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export function AccountBreadcrumbs() {
  const { t } = useLaravelReactI18n()

  const items: BreadcrumbItemType[] = [
    {
      label: t('navigation.account_settings'),
      href: route('account.edit'),
    },
  ]

  switch (true) {
    case route().current('account.edit'):
      items.push({
        label: t('navigation.general'),
      })
      break

    case route().current('account.security.edit'):
      items.push({
        label: t('navigation.security'),
      })
      break

    case route().current('account.preferences.edit'):
      items.push({
        label: t('navigation.preferences'),
      })
      break
  }

  return <PageBreadcrumbs items={items} />
}
