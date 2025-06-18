import { User } from '@/types/models'

export interface SupportedLocale {
  name: string
  native_name: string
  regional: string
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  user: User | null
  supportedLocales: Record<string, SupportedLocale>
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
}

export interface PaginatedData<TData> {
  data: TData[]
  meta: PaginationMeta
}
