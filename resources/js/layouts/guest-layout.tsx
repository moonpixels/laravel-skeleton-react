import { AppHead } from '@/components/app-head'
import { Logo } from '@/components/logo'
import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export function GuestLayout({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <>
      <AppHead title={title} />

      <div className="flex min-h-dvh flex-col p-2">
        <main className="lg:ring-foreground/5 dark:lg:ring-foreground/10 bg-background flex grow flex-col items-center justify-center px-4 py-6 lg:rounded-lg lg:p-10 lg:shadow-xs lg:ring-1">
          <div className="flex w-full max-w-sm flex-col gap-10">
            <Link href={route('dashboard.index')}>
              <Logo className="h-6 w-auto" />
            </Link>

            {children}
          </div>
        </main>
      </div>
    </>
  )
}
