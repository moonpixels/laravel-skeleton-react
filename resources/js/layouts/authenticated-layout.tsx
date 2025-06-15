import { AppFooter } from '@/components/app-footer'
import { AppHead } from '@/components/app-head'
import { AppSidebar } from '@/components/app-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PropsWithChildren } from 'react'
import { useCookie } from 'react-use'

export function AuthenticatedLayout({
  title,
  children,
}: PropsWithChildren<{
  title?: string
}>) {
  const [value] = useCookie('sidebar_state')
  const defaultOpen = value === null || value === 'true'

  return (
    <>
      <AppHead title={title} />

      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-full w-full flex-col lg:flex-row">
          <MobileHeader />

          <AppSidebar />

          <SidebarInset className="flex flex-col justify-between">
            <main className="px-4 py-6 lg:p-10">{children}</main>
            <AppFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  )
}
