import { reloadData } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/utils'
import { Column } from '@tanstack/react-table'
import { Table as ReactTable } from '@tanstack/table-core'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DataTableColumnHeader<TData, TValue>({
  table,
  column,
  titleTransKey,
  className,
}: {
  table: ReactTable<TData>
  column: Column<TData, TValue>
  titleTransKey: string
  reloadProps?: string[]
  className?: string
}) {
  const { t } = useTranslation()

  const canSort = column.getCanSort()
  const isSorted = column.getIsSorted()

  const canHide = column.getCanHide()

  function handleSortingClick(desc: boolean) {
    if (canSort) {
      reloadData({
        pagination: undefined,
        sorting: [{ id: column.id, desc }],
        columnFilters: table.getState().columnFilters,
        globalFilter: table.getState().globalFilter,
        reloadProps: table.options.meta?.reloadProps,
      })
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-2.5 h-8"
          >
            <span>{t(titleTransKey)}</span>
            {isSorted === 'desc' ? (
              <ArrowDownIcon />
            ) : isSorted === 'asc' ? (
              <ArrowUpIcon />
            ) : (
              <ChevronsUpDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            disabled={!canSort}
            onClick={() => handleSortingClick(false)}
          >
            <ArrowUpIcon />
            {t('sortAsc')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canSort}
            onClick={() => handleSortingClick(true)}
          >
            <ArrowDownIcon />
            {t('sortDesc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!canHide}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOffIcon />
            {t('hideColumn')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
