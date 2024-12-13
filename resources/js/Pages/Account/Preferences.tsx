import { PageHeader } from '@/Components/PageHeader'
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout'
import { AccountBreadcrumbs } from '@/Pages/Account/Partials/AccountBreadcrumbs'
import { AccountNavigation } from '@/Pages/Account/Partials/AccountNavigation'
import { PreferencesForm } from '@/Pages/Account/Partials/PreferencesForm'
import { Head } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Preferences() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout breadcrumbs={AccountBreadcrumbs}>
      <Head title={t('account.account_preferences')} />

      <PageHeader>{t('account.account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-y divide-border">
        <PreferencesForm />
      </div>
    </AuthenticatedLayout>
  )
}
