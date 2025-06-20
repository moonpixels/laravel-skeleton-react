import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { router } from '@inertiajs/react'
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Table as ReactTable,
  Row,
  RowData,
  SortingState,
  TableOptions,
  Updater,
  useReactTable,
} from '@tanstack/react-table'
import { merge } from 'es-toolkit'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeIcon,
  EyeOffIcon,
  ScanSearchIcon,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

declare module '@tanstack/react-table' {
  /**
   * We include a `translationKey` in the column meta to allow for
   * translating column headers.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    translationKey?: string
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: PaginationMeta
  dataProps?: string[]
  tableOptions?: Omit<
    TableOptions<TData>,
    'data' | 'columns' | 'getCoreRowModel'
  >
  initialSortingState?: SortingState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  dataProps = [],
  tableOptions = {},
  initialSortingState = [],
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: meta ? meta.current_page - 1 : 0,
    pageSize: meta ? meta.per_page : 15,
  })

  const [sorting, setSorting] = useState<SortingState>(initialSortingState)

  const handleSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const newValue =
        typeof updater === 'function' ? updater(sorting) : updater

      setSorting(newValue)

      const sort = newValue.map((s) => (s.desc ? `-${s.id}` : s.id)).join(',')

      router.reload({
        data: {
          sort,
        },
        only: dataProps,
      })
    },
    [sorting, dataProps]
  )

  const reactTableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: meta ? meta.total : data.length,
    onPaginationChange: setPagination,
    manualSorting: true,
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
    },
  }

  const table = useReactTable(merge(reactTableOptions, tableOptions))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div></div>
        <DataTableViewOptions columns={table.getAllColumns()} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : typeof header.column
                        .columnDef.header === 'string' ? (
                      <DataTableColumnHeader
                        column={header.column}
                        title={header.column.columnDef.header}
                      />
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
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

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  const { t } = useTranslation()

  const canSort = column.getCanSort()
  const sorting = column.getIsSorted()

  const canHide = column.getCanHide()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-2.5 h-8"
          >
            <span>{t(title)}</span>
            {sorting === 'desc' ? (
              <ArrowDownIcon />
            ) : sorting === 'asc' ? (
              <ArrowUpIcon />
            ) : (
              <ChevronsUpDownIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            disabled={!canSort}
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUpIcon />
            {t('sortAsc')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canSort}
            onClick={() => column.toggleSorting(true)}
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

function DataTableEmptyState({ columnsLength }: { columnsLength: number }) {
  const { t } = useTranslation()

  return (
    <TableRow>
      <TableCell colSpan={columnsLength}>
        <div className="mx-auto flex max-w-xs flex-col items-center py-4 text-center text-wrap">
          <ScanSearchIcon className="text-muted-foreground size-8" />
          <p className="text-foreground mt-4 font-medium">
            {t('emptyTableTitle')}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('emptyTableDescription')}
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
    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      <Text as="span" size="sm" className="shrink-0" variant="muted">
        {t('dataTableResults', {
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

export function DataTableViewOptions<TData>({
  columns,
}: {
  columns: Column<TData>[]
}) {
  const { t } = useTranslation()

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
            (column) =>
              (typeof column.columnDef.header === 'string' ||
                typeof column.columnDef.meta?.translationKey === 'string') &&
              column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.columnDef.meta?.translationKey
                  ? t(column.columnDef.meta.translationKey)
                  : t(column.columnDef.header as string)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableCheckboxHeader<TData>({
  table,
}: {
  table: ReactTable<TData>
}) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t('selectAllRows')}
      />
    </div>
  )
}

export function DataTableCheckboxCell<TData>({ row }: { row: Row<TData> }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t('selectRow', { row: row.index + 1 })}
      />
    </div>
  )
}
