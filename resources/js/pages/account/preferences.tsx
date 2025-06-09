import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountBreadcrumbs } from '@/pages/account/partials/account-breadcrumbs'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { PreferencesForm } from '@/pages/account/partials/preferences-form'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Preferences() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout
      breadcrumbs={AccountBreadcrumbs}
      title={t('account.account_preferences')}
    >
      <PageHeader>{t('account.account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <PreferencesForm />
      </div>
    </AuthenticatedLayout>
  )
}
