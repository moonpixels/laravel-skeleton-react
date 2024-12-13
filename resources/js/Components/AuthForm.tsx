import { Heading } from '@/Components/Heading'
import { Text } from '@/Components/Text'
import { PropsWithChildren } from 'react'

export function AuthFormFooter({ children }: PropsWithChildren) {
  return <div>{children}</div>
}

export function AuthForm({
  title,
  description,
  children,
}: PropsWithChildren<{
  title: string
  description: string
}>) {
  return (
    <div className="w-full space-y-10 sm:max-w-sm">
      <div className="space-y-2">
        <Heading>{title}</Heading>
        <Text size="sm" variant="muted">
          {description}
        </Text>
      </div>

      {children}
    </div>
  )
}
