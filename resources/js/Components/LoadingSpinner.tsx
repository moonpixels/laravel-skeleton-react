import { cn } from '@/Utils/utils'
import { cva, VariantProps } from 'class-variance-authority'

const loadingSpinnerVariants = cva('animate-spin text-inherit', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface LoadingSpinnerProps extends VariantProps<typeof loadingSpinnerVariants> {
  className?: string
}

export function LoadingSpinner({ size, className, ...props }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn(loadingSpinnerVariants({ size }), className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      ></circle>
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      ></path>
    </svg>
  )
}
