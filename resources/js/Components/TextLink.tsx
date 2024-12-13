import { cn } from '@/Utils/utils'
import { type InertiaLinkProps, Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export function TextLink({ className, ...props }: PropsWithChildren<InertiaLinkProps>) {
  return (
    <Link
      className={cn(
        'text-foreground underline decoration-foreground/30 hover:decoration-foreground',
        className
      )}
      {...props}
    />
  )
}
