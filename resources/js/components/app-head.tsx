import { Head } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export type AppHeadProps = PropsWithChildren<{ title?: string }>

export function AppHead({ title, children }: AppHeadProps) {
  const appName = import.meta.env.VITE_APP_NAME ?? 'Moon Pixels'
  const titleSuffix =
    title?.endsWith(appName) || title?.startsWith(appName)
      ? ''
      : ` - ${appName}`

  return (
    <Head>
      <title>{title ? `${title}${titleSuffix}` : appName}</title>
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.ico?v=1" sizes="32x32" />
      <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=1" />
      {children}
    </Head>
  )
}
