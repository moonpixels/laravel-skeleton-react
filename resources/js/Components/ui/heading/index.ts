import { cva, type VariantProps } from 'class-variance-authority'

export { default as Heading } from './Heading.vue'

export const headingVariants = cva('leading-none tracking-tight', {
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
    size: '2xl',
    weight: 'semibold',
  },
})

export type HeadingVariants = VariantProps<typeof headingVariants>
