import { Toaster } from '@/Components/UI/Sonner'
import { LocaleProvider } from '@/Contexts/LocaleContext'
import { UserProvider } from '@/Contexts/UserContext'
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
