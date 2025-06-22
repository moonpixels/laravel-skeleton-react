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
  PaginationState,
  Table as ReactTable,
  Row,
  RowData,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { debounce, merge, union } from 'es-toolkit'
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
  ChangeEvent,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

declare module '@tanstack/table-core' {
  /**
   * We include a `reloadProps` in the table meta to allow for
   * reloading the table data with specific props.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    reloadProps: string[]
  }
}

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
  paginationMeta?: PaginationMeta
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

interface ReloadDataProps {
  pagination?: PaginationState
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  globalFilter?: unknown
  reloadProps?: string[]
}

function reloadData({
  pagination = undefined,
  sorting = undefined,
  columnFilters = undefined,
  globalFilter = undefined,
  reloadProps = [],
}: ReloadDataProps) {
  const sort = sorting?.length
    ? sorting.map((s) => (s.desc ? `-${s.id}` : s.id)).join(',')
    : undefined

  const page = pagination ? pagination.pageIndex + 1 : undefined

  const search =
    typeof globalFilter === 'string' && globalFilter !== ''
      ? encodeURIComponent(globalFilter.trim())
      : undefined

  const only = reloadProps?.length
    ? union(['sorts', 'filters'], reloadProps)
    : []

  const filters = columnFilters?.reduce(
    (acc, filter) => {
      if (filter.id !== 'search' && filter.value) {
        acc[filter.id] = String(filter.value)
      }

      return acc
    },
    {} as Record<string, string>
  )

  router.reload({
    data: {
      sort,
      page,
      filter: {
        search,
        ...filters,
      },
    },
    only,
  })
}

export function DataTable<TData, TValue>({
  columns,
  data,
  paginationMeta,
  reloadProps = [],
  tableOptions = {},
  initialSortingState = [],
  actionsDropdown = undefined,
  initialFiltersState = [],
  enableSearch = true,
}: DataTableProps<TData, TValue>) {
  const pagination = useMemo(() => {
    return {
      pageIndex: paginationMeta ? paginationMeta.current_page - 1 : 0,
      pageSize: paginationMeta ? paginationMeta.per_page : 15,
    }
  }, [paginationMeta])

  const columnFilters = useMemo(() => {
    return initialFiltersState.filter((filter) => filter.id !== 'search')
  }, [initialFiltersState])

  const globalFilter = useMemo(() => {
    const searchFilter = initialFiltersState.find(
      (filter) => filter.id === 'search'
    )

    return typeof searchFilter?.value === 'string'
      ? searchFilter.value
      : undefined
  }, [initialFiltersState])

  const sorting = useMemo(() => initialSortingState, [initialSortingState])

  const rowCount = useMemo(() => {
    return paginationMeta ? paginationMeta.total : data.length
  }, [paginationMeta, data.length])

  const reactTableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    manualSorting: true,
    manualFiltering: true,
    enableGlobalFilter: enableSearch,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      reloadProps,
    },
  }

  const table = useReactTable(merge(reactTableOptions, tableOptions))

  console.log('DataTable information:', {
    ...table.getState(),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {enableSearch && <DataTableSearchInput table={table} />}
        </div>
        <div className="flex items-center gap-2">
          {actionsDropdown?.(table)}
          <DataTableColumnVisibilityDropdown table={table} />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
      {paginationMeta && (
        <DataTablePagination table={table} paginationMeta={paginationMeta} />
      )}
    </div>
  )
}

function DataTableSearchInput<TData>({ table }: { table: ReactTable<TData> }) {
  const { t } = useTranslation()

  const [query, setQuery] = useState<string>(
    table.getState().globalFilter ?? ''
  )

  const debouncedReload = useMemo(
    () =>
      debounce(
        ({
          pagination,
          sorting,
          columnFilters,
          globalFilter,
          reloadProps,
        }: ReloadDataProps) => {
          reloadData({
            pagination,
            sorting,
            columnFilters,
            globalFilter,
            reloadProps,
          })
        },
        500
      ),
    []
  )

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    setQuery(value)

    debouncedReload({
      pagination: undefined,
      sorting: table.getState().sorting,
      columnFilters: table.getState().columnFilters,
      globalFilter: value,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  return (
    <Input
      value={query}
      role="searchbox"
      autoComplete="off"
      aria-label={t('search')}
      type="search"
      inputMode="search"
      placeholder={t('search') + '...'}
      onChange={handleChange}
    />
  )
}

export function DataTableColumnHeader<TData, TValue>({
  table,
  column,
  title,
  className,
}: {
  table: ReactTable<TData>
  column: Column<TData, TValue>
  title: string
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
            <span>{t(title)}</span>
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

function DataTablePagination<TData>({
  table,
  paginationMeta,
}: {
  table: ReactTable<TData>
  paginationMeta: PaginationMeta
}) {
  const { t } = useTranslation()

  const previousPageLink = paginationMeta.links[0] ?? null
  const nextPageLink =
    paginationMeta.links[paginationMeta.links.length - 1] ?? null
  const pageLinks = paginationMeta.links.slice(1, -1)

  const reloadProps = table.options.meta?.reloadProps ?? []

  const selectedRowsCount = table.getSelectedRowModel().rows.length

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
            from: paginationMeta.from,
            to: paginationMeta.to,
            total: paginationMeta.total,
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
            (column) =>
              column.columnDef.meta?.translationKey && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                onSelect={(e) => e.preventDefault()}
              >
                {t(String(column.columnDef.meta?.translationKey))}
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
