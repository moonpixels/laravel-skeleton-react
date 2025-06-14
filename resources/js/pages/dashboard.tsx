import { PageHeader } from '@/components/page-header'
import { Text } from '@/components/text'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <AuthenticatedLayout title={t('common:dashboard')}>
      <PageHeader>{t('common:dashboard')}</PageHeader>

      <div className="py-10">
        <Text size="sm" variant="muted">
          Ipsum ipsa aliquam deserunt molestias incidunt optio. Labore aperiam
          consequuntur natus sit repudiandae accusantium illum doloribus omnis.
        </Text>
      </div>
    </AuthenticatedLayout>
  )
}
