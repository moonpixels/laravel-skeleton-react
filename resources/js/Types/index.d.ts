import { SupportedLocales } from '@/Hooks/useLocale'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  two_factor_confirmed_at: string | null
  language: string
  avatar_url: string | null
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  user: User | null
  supportedLocales: SupportedLocales
}
