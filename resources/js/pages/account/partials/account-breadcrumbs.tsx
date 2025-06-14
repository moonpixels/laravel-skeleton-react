import {
  type BreadcrumbItemType,
  PageBreadcrumbs,
} from '@/components/page-breadcrumbs'
import { useTranslation } from 'react-i18next'

export function AccountBreadcrumbs() {
  const { t } = useTranslation()

  const items: BreadcrumbItemType[] = [
    {
      label: t('accountSettings'),
      href: route('account.edit'),
    },
  ]

  switch (true) {
    case route().current('edit'):
      items.push({
        label: t('general'),
      })
      break

    case route().current('security.edit'):
      items.push({
        label: t('security'),
      })
      break

    case route().current('preferences.edit'):
      items.push({
        label: t('preferences'),
      })
      break
  }

  return <PageBreadcrumbs items={items} />
}
