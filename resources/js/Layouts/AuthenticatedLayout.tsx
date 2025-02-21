import { AppFooter } from '@/Components/AppFooter'
import { AppSidebar } from '@/Components/AppSidebar'
import { MobileHeader } from '@/Components/MobileHeader'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { Separator } from '@/Components/UI/Separator'
import { SidebarTrigger } from '@/Components/UI/Sidebar'
import { PropsWithChildren } from 'react'

export function AuthenticatedLayout({
  breadcrumbs,
  children,
}: PropsWithChildren<{
  breadcrumbs?: typeof PageBreadcrumbs
}>) {
  const Breadcrumbs = breadcrumbs ?? PageBreadcrumbs

  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      <MobileHeader />

      <AppSidebar />

      <div className="flex min-h-dvh grow flex-col justify-between overflow-hidden border-t lg:border-t-0">
        <main className="lg:pt-14">
          <header className="bg-muted lg:bg-background/80 top-0 z-10 flex h-14 w-full items-center gap-2 border-b px-4 backdrop-blur-xs sm:px-6 lg:fixed lg:px-8">
            <SidebarTrigger className="-ml-6 hidden lg:flex" />
            <Separator orientation="vertical" className="mr-3 hidden h-4 lg:block" />
            <Breadcrumbs />
          </header>

          <div className="overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">{children}</div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
