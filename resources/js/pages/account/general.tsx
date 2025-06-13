import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountBreadcrumbs } from '@/pages/account/partials/account-breadcrumbs'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { BasicInformationForm } from '@/pages/account/partials/basic-information-form'
import { DeleteAccountForm } from '@/pages/account/partials/delete-account-form'
import { useTranslation } from 'react-i18next'

export default function General() {
  const { t } = useTranslation()

  return (
    <AuthenticatedLayout
      breadcrumbs={AccountBreadcrumbs}
      title={t('account_settings')}
    >
      <PageHeader>{t('account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <BasicInformationForm />
        <DeleteAccountForm />
      </div>
    </AuthenticatedLayout>
  )
}
