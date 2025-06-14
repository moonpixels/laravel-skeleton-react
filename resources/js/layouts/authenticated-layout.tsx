import { AppFooter } from '@/components/app-footer'
import { AppSidebar } from '@/components/app-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DefaultLayout } from '@/layouts/default-layout'
import { PropsWithChildren } from 'react'
import { useCookie } from 'react-use'

export function AuthenticatedLayout({
  title,
  children,
}: PropsWithChildren<{
  title?: string
}>) {
  const [value] = useCookie('sidebar_state')
  const defaultOpen = value === 'true'

  return (
    <DefaultLayout title={title}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-full w-full flex-col lg:flex-row">
          <MobileHeader />

          <AppSidebar />

          <SidebarInset className="flex flex-col justify-between">
            <main className="p-6 lg:p-10">{children}</main>
            <AppFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DefaultLayout>
  )
}
