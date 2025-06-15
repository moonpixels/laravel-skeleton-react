import { Toaster } from '@/components/ui/sonner'
import { DarkModeProvider } from '@/contexts/dark-mode-context'
import { UserProvider } from '@/contexts/user-context'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <DarkModeProvider>
      <UserProvider>
        {children}
        <Toaster />
      </UserProvider>
    </DarkModeProvider>
  )
}
