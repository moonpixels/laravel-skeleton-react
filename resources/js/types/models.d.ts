export interface User {
  id: number
  name: string
  first_name: string
  email: string
  email_verified_at: string | null
  two_factor_confirmed_at: string | null
  language: string
  avatar_url: string | null
}
