export interface SupportedLocale {
  name: string
  nativeName: string
  regional: string
}

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
  supportedLocales: Record<string, SupportedLocale>
}
