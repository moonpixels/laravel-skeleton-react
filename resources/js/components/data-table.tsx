import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaginationMeta } from '@/types'
import { cn } from '@/utils/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { merge } from 'es-toolkit'
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWide,
  ScanSearchIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: PaginationMeta
  dataProps?: string[]
  tableOptions?: Omit<
    TableOptions<TData>,
    'data' | 'columns' | 'getCoreRowModel'
  >
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  dataProps = undefined,
  tableOptions = {},
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: meta ? meta.current_page - 1 : 0,
    pageSize: meta ? meta.per_page : 15,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const reactTableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: meta ? meta.total : data.length,
    onPaginationChange: setPagination,
    manualSorting: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
    },
  }

  const table = useReactTable(merge(reactTableOptions, tableOptions))

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <DataTableColumnHeader header={header} />
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <DataTableEmptyState columnsLength={columns.length} />
          )}
        </TableBody>
      </Table>
      {meta && <DataTablePagination meta={meta} dataProps={dataProps} />}
    </div>
  )
}

function DataTableColumnHeader<TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>
}) {
  const { t } = useTranslation()

  if (header.isPlaceholder) {
    return null
  }

  const column = header.column

  // If the header is not a translation key, render it directly
  if (typeof column.columnDef.header !== 'string') {
    return flexRender(column.columnDef.header, header.getContext())
  }

  const canSort = column.getCanSort()
  const sorting = column.getIsSorted()

  if (!canSort) {
    return t(column.columnDef.header)
  }

  return (
    <div className={cn('flex items-center gap-2')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-2.5 h-8"
          >
            <span>{t(column.columnDef.header)}</span>
            {sorting === 'desc' ? (
              <ArrowDownWideNarrowIcon />
            ) : sorting === 'asc' ? (
              <ArrowUpNarrowWide />
            ) : (
              <ArrowUpDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpNarrowWide />
            {t('translation:sortAsc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownWideNarrowIcon />
            {t('translation:sortDesc')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function DataTableEmptyState({ columnsLength }: { columnsLength: number }) {
  const { t } = useTranslation()

  return (
    <TableRow>
      <TableCell colSpan={columnsLength}>
        <div className="mx-auto flex max-w-xs flex-col items-center py-4 text-center text-wrap">
          <ScanSearchIcon className="text-muted-foreground size-8" />
          <p className="text-foreground mt-4 font-medium">
            {t('translation:emptyTableTitle')}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('translation:emptyTableDescription')}
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}

function DataTablePagination({
  meta,
  dataProps,
}: {
  meta: PaginationMeta
  dataProps?: string[]
}) {
  const { t } = useTranslation()

  const previousPageLink = meta.links[0] ?? null
  const nextPageLink = meta.links[meta.links.length - 1] ?? null
  const pageLinks = meta.links.slice(1, -1)

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
      <Text as="span" size="sm" className="shrink-0" variant="muted">
        {t('translation:dataTableResults', {
          from: meta.from,
          to: meta.to,
          total: meta.total,
        })}
      </Text>

      <Pagination className="sm:justify-end">
        <PaginationContent className="flex w-full items-center justify-between sm:w-auto">
          <PaginationItem>
            <PaginationPrevious
              href={previousPageLink?.url ?? '#'}
              disabled={!previousPageLink?.url}
              only={dataProps}
            />
          </PaginationItem>
          {pageLinks.map((link) =>
            link.url ? (
              <PaginationItem className="hidden sm:block" key={link.label}>
                <PaginationLink
                  isActive={link.active}
                  href={link.url}
                  only={dataProps}
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationEllipsis className="hidden sm:flex" key={link.label} />
            )
          )}
          <PaginationItem>
            <PaginationNext
              href={nextPageLink?.url ?? '#'}
              disabled={!nextPageLink?.url}
              only={dataProps}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
