import { PageHeader } from '@/Components/PageHeader'
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout'
import { AccountBreadcrumbs } from '@/Pages/Account/Partials/AccountBreadcrumbs'
import { AccountNavigation } from '@/Pages/Account/Partials/AccountNavigation'
import { BasicInformationForm } from '@/Pages/Account/Partials/BasicInformationForm'
import { DeleteAccountForm } from '@/Pages/Account/Partials/DeleteAccountForm'
import { Head } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function General() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout breadcrumbs={AccountBreadcrumbs}>
      <Head title={t('account.account_settings')} />

      <PageHeader>{t('account.account_settings')}</PageHeader>

      <AccountNavigation />

      <div className="divide-border divide-y">
        <BasicInformationForm />
        <DeleteAccountForm />
      </div>
    </AuthenticatedLayout>
  )
}
