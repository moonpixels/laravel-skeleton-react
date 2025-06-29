import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/utils'
import { SquareMenuIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export function DataTableActionsDropdown({
  className,
  children,
}: PropsWithChildren<{
  className?: string
}>) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SquareMenuIcon className="text-muted-foreground" />
          {t('actions')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn('min-w-[150px]', className)}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
