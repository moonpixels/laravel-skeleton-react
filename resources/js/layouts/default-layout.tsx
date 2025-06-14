import { AppHead } from '@/components/app-head'
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
      <UserProvider>
        <AppHead title={title} />
        {children}
        <Toaster />
      </UserProvider>
    </DarkModeProvider>
  )
}
