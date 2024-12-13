import { PageHeader } from '@/Components/PageHeader'
import { Text } from '@/Components/Text'
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export default function Home() {
  const { t } = useLaravelReactI18n()

  return (
    <AuthenticatedLayout>
      <Head title={t('general.home')} />

      <PageHeader>{t('general.home')}</PageHeader>

      <div className="py-10">
        <Text size="sm" variant="muted">
          Ipsum ipsa aliquam deserunt molestias incidunt optio. Labore aperiam consequuntur natus
          sit repudiandae accusantium illum doloribus omnis.
        </Text>
      </div>
    </AuthenticatedLayout>
  )
}
