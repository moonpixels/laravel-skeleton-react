import { WritableComputedRef } from 'vue'
import { SupportedLocales } from '@/Utils/locale'

export type UseDarkMode = WritableComputedRef<boolean>

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  two_factor_confirmed_at: string | null
  language: string
  avatar_url: string | null
}

export type SharedData = {
  user: User
  supportedLocales: SupportedLocales
}
