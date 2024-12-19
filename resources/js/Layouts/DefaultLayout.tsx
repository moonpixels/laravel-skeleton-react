import { Toaster } from '@/Components/UI/Toaster'
import { LocaleProvider } from '@/Contexts/LocaleContext'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <LocaleProvider>
      {children}
      <Toaster />
    </LocaleProvider>
  )
}
