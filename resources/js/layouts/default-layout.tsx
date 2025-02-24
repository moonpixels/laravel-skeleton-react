import { Toaster } from '@/components/ui/sonner'
import { LocaleProvider } from '@/contexts/locale-context'
import { UserProvider } from '@/contexts/user-context'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <LocaleProvider>
      <UserProvider>
        {children}
        <Toaster />
      </UserProvider>
    </LocaleProvider>
  )
}
