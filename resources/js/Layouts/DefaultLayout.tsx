import { Toaster } from '@/Components/UI/Toaster'
import { useLocale } from '@/Hooks/useLocale'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  useLocale()

  return (
    <>
      {children}

      <Toaster />
    </>
  )
}
