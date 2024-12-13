import { Heading } from '@/Components/Heading'
import { PropsWithChildren } from 'react'

export function PageHeader({ children }: PropsWithChildren) {
  return <Heading>{children}</Heading>
}
