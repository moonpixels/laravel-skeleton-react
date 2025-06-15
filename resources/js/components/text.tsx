import { cn } from '@/utils/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { ElementType, PropsWithChildren } from 'react'

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
  },
})

interface TextProps
  extends PropsWithChildren<VariantProps<typeof textVariants>> {
  as?: ElementType
  asChild?: boolean
  className?: string
}

export function Text({
  as = 'p',
  asChild = false,
  variant,
  size,
  weight,
  className,
  ...props
}: TextProps) {
  const Component = asChild ? Slot : as

  return (
    <Component
      className={cn(textVariants({ variant, size, weight }), className)}
      {...props}
    />
  )
}
