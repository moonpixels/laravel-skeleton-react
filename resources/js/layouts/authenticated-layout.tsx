import { AppFooter } from '@/components/app-footer'
import { AppSidebar } from '@/components/app-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { PageBreadcrumbs } from '@/components/page-breadcrumbs'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DefaultLayout } from '@/layouts/default-layout'
import { PropsWithChildren } from 'react'

export function AuthenticatedLayout({
  title,
  breadcrumbs,
  children,
}: PropsWithChildren<{
  title?: string
  breadcrumbs?: typeof PageBreadcrumbs
}>) {
  const Breadcrumbs = breadcrumbs ?? PageBreadcrumbs

  return (
    <DefaultLayout title={title}>
      <div className="flex h-full w-full flex-col lg:flex-row">
        <MobileHeader />

        <AppSidebar />

        <div className="flex min-h-dvh grow flex-col justify-between overflow-hidden border-t lg:border-t-0">
          <main className="lg:pt-14">
            <header className="bg-muted lg:bg-background/80 top-0 z-10 flex h-14 w-full items-center gap-2 border-b px-4 backdrop-blur-xs sm:px-6 lg:fixed lg:px-8">
              <SidebarTrigger className="-ml-6 hidden lg:flex" />
              <Separator
                orientation="vertical"
                className="mr-3 hidden data-[orientation=vertical]:h-4 lg:block"
              />
              <Breadcrumbs />
            </header>

            <div className="overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          <AppFooter />
        </div>
      </div>
    </DefaultLayout>
  )
}
