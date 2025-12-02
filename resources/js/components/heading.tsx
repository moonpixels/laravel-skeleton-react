import { cn } from '@/utils/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { ElementType, PropsWithChildren } from 'react'

const headingVariants = cva('leading-none tracking-tight', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
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
    size: 'xl',
    weight: 'semibold',
  },
})

interface HeadingProps extends PropsWithChildren<
  VariantProps<typeof headingVariants>
> {
  as?: ElementType
  asChild?: boolean
  className?: string
}

export function Heading({
  as = 'h1',
  asChild = false,
  size,
  weight,
  className,
  ...props
}: HeadingProps) {
  const Component = asChild ? Slot : as

  return (
    <Component
      className={cn(headingVariants({ size, weight }), className)}
      {...props}
    />
  )
}
