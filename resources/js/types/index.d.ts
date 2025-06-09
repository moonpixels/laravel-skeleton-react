import type { SupportedLocales } from '@/contexts/locale-context'

export interface User {
  id: number
  name: string
  email: string
  emailVerifiedAt: string | null
  twoFactorConfirmedAt: string | null
  language: string
  avatarUrl: string | null
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  user: User | null
  supportedLocales: SupportedLocales
}
