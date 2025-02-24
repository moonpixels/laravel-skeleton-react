import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { cn } from '@/utils/utils'
import { cva, VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'inline-flex items-center justify-center font-normal text-primary-foreground select-none shrink-0 bg-primary overflow-hidden',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-11 text-sm',
        lg: 'size-16 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'sm',
      shape: 'square',
    },
  }
)

function Avatar({
  size,
  shape,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
