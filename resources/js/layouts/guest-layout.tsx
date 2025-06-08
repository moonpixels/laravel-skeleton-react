import { Logo } from '@/components/logo'
import { Text } from '@/components/text'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { PropsWithChildren } from 'react'

export function GuestLayout({ children }: PropsWithChildren) {
  const { t } = useLaravelReactI18n()

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        <Link href={route('dashboard')}>
          <Logo className="h-6 w-auto" />
        </Link>
      </header>

      <main className="flex grow justify-center px-4 py-16 sm:items-center">{children}</main>

      <footer className="m-auto flex h-16 w-full max-w-lg shrink-0 items-center justify-center px-4">
        <Text className="opacity-75" size="xs" variant="muted">
          {t('general.copyright_notice', { year: format(new Date(), 'y') })}
        </Text>
      </footer>
    </div>
  )
}
