import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { PreferencesForm } from '@/pages/account/partials/preferences-form'
import { useTranslation } from 'react-i18next'

export default function Preferences() {
  const { t } = useTranslation()

  return (
    <AuthenticatedLayout title={t('accountPreferences')}>
      <PageHeader>{t('accountSettings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <PreferencesForm />
      </div>
    </AuthenticatedLayout>
  )
}
