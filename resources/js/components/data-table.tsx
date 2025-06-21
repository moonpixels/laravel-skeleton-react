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
import { Input } from '@/components/ui/input'
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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  Table as ReactTable,
  Row,
  RowData,
  SortingState,
  TableOptions,
  Updater,
  useReactTable,
} from '@tanstack/react-table'
import { debounce, merge } from 'es-toolkit'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  DotIcon,
  EyeIcon,
  EyeOffIcon,
  ListIcon,
  ScanSearchIcon,
} from 'lucide-react'
import {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
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
  reloadProps?: string[]
  tableOptions?: Omit<
    TableOptions<TData>,
    'data' | 'columns' | 'getCoreRowModel'
  >
  initialSortingState?: SortingState
  actionsDropdown?: (table: ReactTable<TData>) => ReactElement
  initialFiltersState?: ColumnFiltersState
  enableSearch?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  reloadProps = [],
  tableOptions = {},
  initialSortingState = [],
  actionsDropdown = undefined,
  initialFiltersState = [],
  enableSearch = true,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()

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
          page: undefined,
        },
        only: reloadProps,
      })
    },
    [sorting, reloadProps]
  )

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFiltersState)

  const initialSearchFilter = initialFiltersState.find(
    (filter) => filter.id === 'search'
  )?.value

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    typeof initialSearchFilter === 'string' ? initialSearchFilter : undefined
  )

  const reloadSearchData = useMemo(
    () =>
      debounce((query?: string) => {
        router.reload({
          data: {
            filter: {
              search: query ? encodeURIComponent(query.trim()) : undefined,
            },
            page: undefined,
          },
          only: reloadProps,
        })
      }, 500),
    [reloadProps]
  )

  const handleGlobalFilterChange = useCallback(
    (updater: Updater<unknown>) => {
      const newValue =
        typeof updater === 'function' ? updater(globalFilter) : updater

      const query = typeof newValue === 'string' ? newValue : ''

      setGlobalFilter(query)
      reloadSearchData(query)
    },
    [globalFilter, reloadSearchData]
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
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    enableGlobalFilter: enableSearch,
    onGlobalFilterChange: handleGlobalFilterChange,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
  }

  const table = useReactTable(merge(reactTableOptions, tableOptions))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {enableSearch && (
            <Input
              value={globalFilter ?? ''}
              role="searchbox"
              autoComplete="off"
              aria-label={t('search')}
              type="search"
              inputMode="search"
              placeholder={t('search') + '...'}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {actionsDropdown?.(table)}
          <DataTableColumnVisibilityDropdown columns={table.getAllColumns()} />
        </div>
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
      {meta && (
        <DataTablePagination
          meta={meta}
          reloadProps={reloadProps}
          selectedRowsCount={table.getFilteredSelectedRowModel().rows.length}
        />
      )}
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
  selectedRowsCount = 0,
  reloadProps,
}: {
  meta: PaginationMeta
  selectedRowsCount?: number
  reloadProps?: string[]
}) {
  const { t } = useTranslation()

  const previousPageLink = meta.links[0] ?? null
  const nextPageLink = meta.links[meta.links.length - 1] ?? null
  const pageLinks = meta.links.slice(1, -1)

  return (
    <div className="flex flex-col items-center justify-between gap-4 xl:flex-row">
      <div className="flex items-center gap-1">
        {selectedRowsCount > 0 && (
          <>
            <Text size="sm" variant="muted" className="shrink-0">
              {t('dataTableSelectedRows', {
                count: selectedRowsCount,
              })}
            </Text>
            <DotIcon className="text-muted-foreground size-4 shrink-0" />
          </>
        )}
        <Text as="span" size="sm" className="shrink-0" variant="muted">
          {t('dataTableResults', {
            from: meta.from,
            to: meta.to,
            total: meta.total,
          })}
        </Text>
      </div>

      <Pagination className="xl:justify-end">
        <PaginationContent className="flex w-full items-center justify-between sm:w-auto">
          <PaginationItem>
            <PaginationPrevious
              href={previousPageLink?.url ?? '#'}
              disabled={!previousPageLink?.url}
              only={reloadProps}
            />
          </PaginationItem>
          {pageLinks.map((link) =>
            link.url ? (
              <PaginationItem className="hidden sm:block" key={link.label}>
                <PaginationLink
                  isActive={link.active}
                  href={link.url}
                  only={reloadProps}
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
              only={reloadProps}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export function DataTableColumnVisibilityDropdown<TData>({
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
          <ListIcon className="text-muted-foreground" />
          {t('actions')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn('min-w-[150px]', className)}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
