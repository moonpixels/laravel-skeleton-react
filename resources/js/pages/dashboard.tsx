import { PageHeader } from '@/components/page-header'
import { Text } from '@/components/text'
import { useUser } from '@/contexts/user-context'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()

  const { user } = useUser()

  return (
    <AuthenticatedLayout title={t('common:dashboard')}>
      <PageHeader>{t('welcomeMessage', { name: user.first_name })}</PageHeader>

      <div className="py-10">
        <Text size="sm" variant="muted">
          Mollitia necessitatibus vel iure esse ut ipsum accusantium odit
          voluptatum. Numquam explicabo doloribus vel possimus facere dolor et.
          Vitae dolore impedit cumque iure at molestias rerum.
        </Text>
      </div>
    </AuthenticatedLayout>
  )
}
