import { PageHeader } from '@/components/page-header'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { AccountBreadcrumbs } from '@/pages/account/partials/account-breadcrumbs'
import { AccountNavigation } from '@/pages/account/partials/account-navigation'
import { BasicInformationForm } from '@/pages/account/partials/basic-information-form'
import { DeleteAccountForm } from '@/pages/account/partials/delete-account-form'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function General() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout
      breadcrumbs={AccountBreadcrumbs}
      title={t('account.account_settings')}
    >
      <PageHeader>{t('account.account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <BasicInformationForm />
        <DeleteAccountForm />
      </div>
    </AuthenticatedLayout>
  )
}
