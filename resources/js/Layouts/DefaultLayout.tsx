import { Toaster } from '@/Components/UI/Toaster'
import { useLocale } from '@/Hooks/useLocale'
import { useTheme } from '@/Hooks/useTheme'
import { PropsWithChildren } from 'react'

export function DefaultLayout({ children }: PropsWithChildren) {
  useLocale()
  useTheme()

  return (
    <>
      {children}

      <Toaster />
    </>
  )
}
