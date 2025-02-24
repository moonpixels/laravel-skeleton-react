import { Heading } from '@/components/heading'
import { PropsWithChildren } from 'react'

export function PageHeader({ children }: PropsWithChildren) {
  return <Heading>{children}</Heading>
}
