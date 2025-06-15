import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { PasswordForm } from '@/pages/account/partials/password-form'
import { TwoFactorForm } from '@/pages/account/partials/two-factor-form'
import { useTranslation } from 'react-i18next'

export default function Security() {
  const { t } = useTranslation()

  return (
    <AuthenticatedLayout title={t('accountSecurity')}>
      <PageHeader>{t('accountSettings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <PasswordForm />
        <TwoFactorForm />
      </div>
    </AuthenticatedLayout>
  )
}
