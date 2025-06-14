import { AppHead } from '@/components/app-head'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { DarkModeProvider } from '@/contexts/dark-mode-context'
import { UserProvider } from '@/contexts/user-context'
import { PropsWithChildren } from 'react'

export function DefaultLayout({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <DarkModeProvider>
      <SidebarProvider>
        <UserProvider>
          <AppHead title={title} />
          {children}
          <Toaster />
        </UserProvider>
      </SidebarProvider>
    </DarkModeProvider>
  )
}
