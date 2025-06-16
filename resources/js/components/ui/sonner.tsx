import { useTheme } from '@/contexts/theme-context'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

function Toaster({ ...props }: ToasterProps) {
  const { isDarkMode } = useTheme()

  const icons = {
    success: (
      <CheckCircle
        className="text-successful size-4 shrink-0"
        strokeWidth={2.5}
      />
    ),
    info: <Info className="text-info size-4 shrink-0" strokeWidth={2.5} />,
    warning: (
      <AlertCircle className="text-warning size-4 shrink-0" strokeWidth={2.5} />
    ),
    error: (
      <XCircle className="text-destructive size-4 shrink-0" strokeWidth={2.5} />
    ),
  }

  return (
    <Sonner
      theme={isDarkMode ? 'dark' : 'light'}
      className="toaster group"
      icons={icons}
      toastOptions={{
        classNames: {
          toast:
            'group toast font-sans group-[.toaster]:bg-background! group-[.toaster]:text-foreground! group-[.toaster]:border-border! group-[.toaster]:shadow-lg!',
          title: 'group-[.toast]:font-semibold!',
          description: 'group-[.toast]:text-muted-foreground!',
          actionButton:
            'group-[.toast]:bg-primary! group-[.toast]:text-primary-foreground! font-medium!',
          cancelButton:
            'group-[.toast]:bg-muted! group-[.toast]:text-muted-foreground! font-medium!',
          icon: 'group-[.toast]:self-start! mt-px',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
