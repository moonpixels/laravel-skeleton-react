import { AccountDropdownMenu } from '@/Components/AccountDropdownMenu'
import { AppLogo } from '@/Components/AppLogo'
import { MobileNavigation } from '@/Components/MobileNavigation'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { PrimaryFooter } from '@/Components/PrimaryFooter'
import { PrimaryNavigation } from '@/Components/PrimaryNavigation'
import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export function AuthenticatedLayout({
  breadcrumbs,
  children,
}: PropsWithChildren<{
  breadcrumbs?: typeof PageBreadcrumbs
}>) {
  const Breadcrumbs = breadcrumbs ?? PageBreadcrumbs

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <header className="shrink-0 lg:fixed lg:h-dvh lg:w-72 lg:border-r lg:bg-secondary/50">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <Link href={route('home')}>
            <AppLogo className="h-6 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            <AccountDropdownMenu />
            <MobileNavigation />
          </div>
        </div>

        <div className="mt-4 hidden px-3 lg:flex lg:flex-col lg:space-y-px">
          <PrimaryNavigation />
        </div>
      </header>

      <div className="flex min-h-dvh grow flex-col justify-between overflow-hidden border-t lg:ml-72 lg:border-t-0">
        <main className="lg:pt-14">
          <header className="top-0 z-10 flex h-14 w-full items-center gap-2 border-b bg-muted px-4 backdrop-blur-sm sm:px-6 lg:fixed lg:bg-background/80 lg:px-8">
            <Breadcrumbs />
          </header>

          <div className="overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">{children}</div>
        </main>

        <PrimaryFooter />
      </div>
    </div>
  )
}
