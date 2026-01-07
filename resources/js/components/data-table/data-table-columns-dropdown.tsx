import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Table as ReactTable } from '@tanstack/table-core'
import { EyeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DataTableColumnsDropdown<TData>({
  table,
}: {
  table: ReactTable<TData>
}) {
  const { t } = useTranslation()

  const columns = table.getAllColumns()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <EyeIcon className="text-muted-foreground" />
          {t('columns')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>{t('toggleColumns')}</DropdownMenuLabel>
        {columns
          .filter(
            (column) => column.columnDef.meta?.transKey && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                onSelect={(e) => e.preventDefault()}
              >
                {t(String(column.columnDef.meta?.transKey))}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
