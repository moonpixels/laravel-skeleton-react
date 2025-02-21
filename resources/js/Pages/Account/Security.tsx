import { PageHeader } from '@/Components/PageHeader'
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout'
import { AccountBreadcrumbs } from '@/Pages/Account/Partials/AccountBreadcrumbs'
import { AccountNavigation } from '@/Pages/Account/Partials/AccountNavigation'
import { PasswordForm } from '@/Pages/Account/Partials/PasswordForm'
import { TwoFactorForm } from '@/Pages/Account/Partials/TwoFactorForm'
import { Head } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Security() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout breadcrumbs={AccountBreadcrumbs}>
      <Head title={t('account.account_security')} />

      <PageHeader>{t('account.account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <PasswordForm />
        <TwoFactorForm />
      </div>
    </AuthenticatedLayout>
  )
}
