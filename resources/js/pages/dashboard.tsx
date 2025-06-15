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
      <PageHeader>{t('common:dashboard')}</PageHeader>

      <div className="py-10">
        <Text size="sm" variant="muted">
          Welcome back, {user.name}!
        </Text>
      </div>
    </AuthenticatedLayout>
  )
}
