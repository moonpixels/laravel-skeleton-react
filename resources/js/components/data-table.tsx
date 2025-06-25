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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  ColumnFilter,
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
  CornerDownRightIcon,
  DotIcon,
  EyeIcon,
  EyeOffIcon,
  ListFilterIcon,
  MinusIcon,
  PlusIcon,
  ScanSearchIcon,
  SquareMenuIcon,
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
      ? globalFilter.trim()
      : undefined

  const only = reloadProps?.length
    ? union(['sorts', 'filters'], reloadProps)
    : []

  const filters = columnFilters?.reduce(
    (acc, filter) => {
      if (filter.id !== 'search') {
        acc[filter.id] = filter.value
          ? filter.value.toString().trim()
          : undefined
      }

      return acc
    },
    {} as Record<string, string | undefined>
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

const debouncedReloadData = debounce(
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
)

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
  filterOptions?: DataTableFilterOption[]
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
  filterOptions = [],
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
          {filterOptions.length > 0 && (
            <DataTableFiltersDropdown
              filterOptions={filterOptions}
              table={table}
            />
          )}
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    setQuery(value)

    debouncedReloadData({
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

type DataTableFilterClauseType =
  | 'equal'
  | 'notEqual'
  | 'contains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'

export interface DataTableFilterClause {
  type: DataTableFilterClauseType
  filterKey: string
  valuePrefix?: string
  valueSuffix?: string
}

export interface DataTableFilterOption {
  id: string
  label: string
  type: 'text' | 'number' | 'select' | 'date' | 'boolean'
  clause: DataTableFilterClause[]
  options?: { label: string; value: string }[]
}

interface DataTableFiltersDropdownProps<TData> {
  table: ReactTable<TData>
  filterOptions?: DataTableFilterOption[]
  className?: string
}

export function DataTableFiltersDropdown<TData>({
  table,
  filterOptions = [],
  className,
}: DataTableFiltersDropdownProps<TData>) {
  const { t } = useTranslation()

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ListFilterIcon className="text-muted-foreground" />
          {t('filters')}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={6}
        className={cn('w-[225px] p-1', className)}
      >
        <DropdownMenuLabel>{t('addFilters')}</DropdownMenuLabel>
        <div className="space-y-1">
          {filterOptions.map((option) => {
            return (
              <DataTableFiltersDropdownOption
                table={table}
                key={option.id}
                option={option}
              />
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function DataTableFiltersDropdownOption<TData>({
  table,
  option,
}: {
  table: ReactTable<TData>
  option: DataTableFilterOption
}) {
  const { t } = useTranslation()

  const [clause, setClause] =
    useState<DataTableFilterClause>(getDefaultClause())

  const [value, setValue] = useState<string>(getDefaultValue())

  const [isOpen, setIsOpen] = useState(value !== '')

  const ItemIcon = isOpen ? MinusIcon : PlusIcon

  function handleClauseChange(clauseType: DataTableFilterClauseType) {
    const selectedClause = option.clause.find((c) => c.type === clauseType)

    if (!selectedClause) {
      return
    }

    setClause(selectedClause)

    if (!hasExistingColumnFilter()) {
      return
    }

    const filterValue = getFilterValue(selectedClause, value)

    debouncedReloadData({
      pagination: undefined,
      sorting: table.getState().sorting,
      columnFilters: [
        ...getExistingTableFilters(),
        {
          id: selectedClause.filterKey,
          value: filterValue,
        },
      ],
      globalFilter: table.getState().globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  function handleValueChange(value: string) {
    setValue(value)

    if (!hasExistingColumnFilter() && value.trim() === '') {
      return
    }

    const filterValue = getFilterValue(clause, value)

    debouncedReloadData({
      pagination: undefined,
      sorting: table.getState().sorting,
      columnFilters: [
        ...getExistingTableFilters(),
        {
          id: clause.filterKey,
          value: filterValue,
        },
      ],
      globalFilter: table.getState().globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  function getExistingTableFilters(): ColumnFiltersState {
    return table.getState().columnFilters.map((filter) => {
      const existingClause = option.clause.find(
        (c) => c.filterKey === filter.id
      )

      if (existingClause) {
        return {
          id: filter.id,
          value: undefined,
        }
      }

      return filter
    })
  }

  function getFilterValue(
    clause: DataTableFilterClause,
    value: string
  ): string {
    return value.trim()
      ? `${clause.valuePrefix ?? ''}${value}${clause.valueSuffix ?? ''}`
      : ''
  }

  function getExistingColumnFilter(): ColumnFilter | undefined {
    return table
      .getState()
      .columnFilters.find((filter) =>
        option.clause.some((c) => c.filterKey === filter.id)
      )
  }

  function hasExistingColumnFilter(): boolean {
    return !!getExistingColumnFilter()
  }

  function getDefaultClause(): DataTableFilterClause {
    const existingClause = option.clause.find(
      (c) => c.filterKey === getExistingColumnFilter()?.id
    )

    return existingClause ?? option.clause[0]
  }

  function getDefaultValue(): string {
    const defaultClause = getDefaultClause()
    const existingFilter = getExistingColumnFilter()

    if (existingFilter?.value) {
      return existingFilter.value
        .toString()
        .replace(new RegExp(`^${defaultClause.valuePrefix ?? ''}`), '')
        .replace(new RegExp(`${defaultClause.valueSuffix ?? ''}$`), '')
    }

    return ''
  }

  function handleFilterClick(open: boolean) {
    setIsOpen(open)

    if (!open) {
      handleValueChange('')
    }
  }

  return (
    <div
      data-open={isOpen}
      className="group rounded-sm data-[open=true]:border data-[open=true]:shadow-xs"
    >
      <div
        className="hover:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative m-1 mb-0 flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none group-data-[open=false]:m-0 [&_svg]:pointer-events-none [&_svg]:shrink-0"
        onClick={() => handleFilterClick(!isOpen)}
      >
        <ItemIcon className="size-3" />
        {t(option.label)}
      </div>

      {isOpen && (
        <div className="space-y-2 p-2">
          <Select onValueChange={handleClauseChange} defaultValue={clause.type}>
            <SelectTrigger>
              <div className="overflow-hidden text-nowrap text-ellipsis">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {option.clause.map((clauseOption) => (
                <SelectItem key={clauseOption.type} value={clauseOption.type}>
                  {t(`filterClause.${clauseOption.type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 pl-2">
            <CornerDownRightIcon className="text-muted-foreground pointer-events-none size-4 shrink-0" />
            {['text', 'number'].includes(option.type) && (
              <Input
                type={option.type}
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            )}

            {option.type === 'select' && (
              <Select
                onValueChange={(value) => handleValueChange(value)}
                defaultValue={value}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {option.options?.map((opt) => (
                    <SelectItem
                      key={opt.value.toString()}
                      value={opt.value.toString()}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {option.type === 'date' && (
              <Input
                type="date"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            )}

            {option.type === 'boolean' && (
              <Select onValueChange={handleValueChange} defaultValue={value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('true')}</SelectItem>
                  <SelectItem value="0">{t('false')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
