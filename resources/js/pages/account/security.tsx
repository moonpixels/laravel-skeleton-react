import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountBreadcrumbs } from '@/pages/account/partials/account-breadcrumbs'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { PasswordForm } from '@/pages/account/partials/password-form'
import { TwoFactorForm } from '@/pages/account/partials/two-factor-form'
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
