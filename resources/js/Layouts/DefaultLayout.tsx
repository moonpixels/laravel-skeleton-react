import { Toaster } from '@/Components/UI/Toaster'
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
