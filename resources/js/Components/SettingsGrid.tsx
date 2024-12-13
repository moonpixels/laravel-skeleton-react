import { Heading } from '@/Components/Heading'
import { Text } from '@/Components/Text'
import { PropsWithChildren } from 'react'

export function SettingsGrid({
  title,
  description,
  children,
}: PropsWithChildren<{
  title: string
  description?: string
}>) {
  return (
    <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
      <div className="space-y-2">
        <Heading as="h2" size="lg">
          {title}
        </Heading>

        {description && (
          <Text as="p" size="sm" variant="muted">
            {description}
          </Text>
        )}
      </div>

      <div className="max-w-xl md:col-span-2">{children}</div>
    </div>
  )
}
