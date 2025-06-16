import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/contexts/theme-context'
import { UserProvider } from '@/contexts/user-context'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <UserProvider>
        {children}
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  )
}
