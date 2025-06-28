import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
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
import { format, formatISO } from 'date-fns'
import { debounce, merge, union } from 'es-toolkit'
import {
  AmpersandIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  CornerDownRightIcon,
  DotIcon,
  EyeIcon,
  EyeOffIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ScanSearchIcon,
  SquareMenuIcon,
} from 'lucide-react'
import {
  ChangeEvent,
  MouseEvent,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {enableSearch && <DataTableSearchInput table={table} />}
        </div>
        <div className="flex items-center gap-2">
          {actionsDropdown?.(table)}
          <DataTableColumnVisibilityDropdown table={table} />
        </div>
      </div>
      {filterOptions.length > 0 && (
        <DataTableFilters filterOptions={filterOptions} table={table} />
      )}
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
  type: 'text' | 'number' | 'select' | 'date' | 'datetime' | 'boolean'
  clause: DataTableFilterClause[]
  options?: { label: string; value: string }[]
}

interface DataTableFiltersDropdownProps<TData> {
  table: ReactTable<TData>
  filterOptions?: DataTableFilterOption[]
}

export function DataTableFilters<TData>({
  table,
  filterOptions = [],
}: DataTableFiltersDropdownProps<TData>) {
  // Check if any filter option has a 'between' clause that is not compatible with its type
  filterOptions.forEach((option) => {
    if (
      option.clause.some(
        (clause) =>
          clause.type === 'between' &&
          option.type !== 'date' &&
          option.type !== 'datetime' &&
          option.type !== 'number'
      )
    ) {
      throw new Error(
        `The 'between' clause can only be used with 'date', 'datetime' or 'number' type filters.`
      )
    }
  })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterOptions.map((option) => (
        <DataTableFiltersOption<TData>
          key={option.id}
          table={table}
          option={option}
        />
      ))}
    </div>
  )
}

function DataTableFiltersOption<TData>({
  table,
  option,
}: {
  table: ReactTable<TData>
  option: DataTableFilterOption
}) {
  const { t, i18n } = useTranslation()

  const [open, setOpen] = useState(false)

  const [clause, setClause] = useState<DataTableFilterClause>(
    getAppliedClause() ?? option.clause[0]
  )

  const [value, setValue] = useState<string>(getAppliedValue())

  function handleClauseChange(clauseType: DataTableFilterClauseType) {
    const selectedClause = option.clause.find((c) => c.type === clauseType)

    if (!selectedClause) {
      return
    }

    setClause(selectedClause)
  }

  function getCurrentColumnFilters(): ColumnFiltersState {
    return table.getState().columnFilters.map((filter) => {
      // Remove filter for the current option so we can apply the new one
      if (findClauseFromColumnFilter(filter)) {
        return {
          id: filter.id,
          value: undefined,
        }
      }

      return filter
    })
  }

  function formatFilterValue(
    clause: DataTableFilterClause,
    value: string
  ): string {
    return value.trim()
      ? `${clause.valuePrefix ?? ''}${value}${clause.valueSuffix ?? ''}`
      : ''
  }

  function findClauseFromColumnFilter(
    columnFilter: ColumnFilter
  ): DataTableFilterClause | undefined {
    return option.clause.find((c) => {
      const keyMatchesId = c.filterKey === columnFilter.id

      if (columnFilter.value === undefined) {
        return keyMatchesId
      }

      const valueMatchesPrefix = c.valuePrefix
        ? String(columnFilter.value).startsWith(c.valuePrefix)
        : true

      const valueMatchesSuffix = c.valueSuffix
        ? String(columnFilter.value).endsWith(c.valueSuffix)
        : true

      return keyMatchesId && valueMatchesPrefix && valueMatchesSuffix
    })
  }

  function getAppliedColumnFilter(): ColumnFilter | undefined {
    return table
      .getState()
      .columnFilters.find((filter) =>
        option.clause.some((c) => c.filterKey === filter.id)
      )
  }

  function isApplied(): boolean {
    return !!getAppliedColumnFilter()
  }

  function getAppliedClause(): DataTableFilterClause | undefined {
    const appliedColumnFilter = getAppliedColumnFilter()

    if (!appliedColumnFilter) {
      return undefined
    }

    return findClauseFromColumnFilter(appliedColumnFilter)
  }

  function getAppliedValue(): string {
    const appliedClause = getAppliedClause()
    const appliedColumnFilter = getAppliedColumnFilter()

    if (!appliedClause || !appliedColumnFilter) {
      return ''
    }

    return String(appliedColumnFilter.value)
      .replace(new RegExp(`^${appliedClause.valuePrefix ?? ''}`), '')
      .replace(new RegExp(`${appliedClause.valueSuffix ?? ''}$`), '')
  }

  function getFormattedAppliedValue(): string {
    const appliedValue = getAppliedValue()

    if (!appliedValue) {
      return ''
    }

    if (option.type === 'boolean') {
      return appliedValue === '1' ? t('true') : t('false')
    }

    if (option.type === 'select') {
      const selectedOption = option.options?.find(
        (o) => o.value === appliedValue
      )
      return selectedOption ? t(selectedOption.label) : appliedValue
    }

    if (option.type === 'date') {
      const date = new Date(appliedValue)
      return date.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    }

    if (option.type === 'datetime') {
      console.log('Formatting datetime:', appliedValue)
      const date = new Date(appliedValue)
      return date.toLocaleString(i18n.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return appliedValue
  }

  function handleRemoveFilterClick(event: MouseEvent) {
    event.stopPropagation()

    if (!isApplied()) {
      return
    }

    setValue('')

    debouncedReloadData({
      pagination: undefined,
      sorting: table.getState().sorting,
      columnFilters: getCurrentColumnFilters(),
      globalFilter: table.getState().globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  function handleApplyFilterClick() {
    if (!value.trim()) {
      return
    }

    const filterValue = formatFilterValue(clause, value)

    debouncedReloadData({
      pagination: undefined,
      sorting: table.getState().sorting,
      columnFilters: [
        ...getCurrentColumnFilters(),
        {
          id: clause.filterKey,
          value: filterValue,
        },
      ],
      globalFilter: table.getState().globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })

    setOpen(false)
  }

  const appliedTriggerButton = (
    <button className="text-muted-foreground hover:bg-accent flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium shadow-xs transition-colors">
      <div className="flex items-center gap-1">
        <MinusCircleIcon className="size-3" onClick={handleRemoveFilterClick} />
        {t(option.label)}
      </div>
      <span className="bg-border h-3 w-px" />
      <span className="text-foreground max-w-[250px] overflow-hidden text-nowrap text-ellipsis">
        {getFormattedAppliedValue()}
      </span>
    </button>
  )

  const unappliedTriggerButton = (
    <button className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-full border border-dashed px-2 py-1 text-xs font-medium transition-colors">
      <PlusCircleIcon className="size-3" />
      {t(option.label)}
    </button>
  )

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isApplied() ? appliedTriggerButton : unappliedTriggerButton}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={6}
        className="w-full min-w-[250px] space-y-2 p-2"
      >
        <Text
          as="span"
          className="block"
          weight="medium"
          variant="muted"
          size="xs"
        >
          {t('filterBy', {
            column: t(option.label).toLowerCase(),
          })}
        </Text>

        <div className="space-y-2">
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
                onChange={(e) => setValue(e.target.value)}
              />
            )}

            {option.type === 'select' && (
              <Select onValueChange={setValue} defaultValue={value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {option.options?.map((opt) => (
                    <SelectItem
                      key={opt.value.toString()}
                      value={opt.value.toString()}
                    >
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {option.type === 'date' && (
              <DatePicker
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  setValue(date ? format(date, 'yyyy-MM-dd') : '')
                }}
                locale={i18n.language}
              />
            )}

            {option.type === 'datetime' && (
              <DatePicker
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  setValue(date ? formatISO(date) : '')
                }}
                locale={i18n.language}
                showTime
              />
            )}

            {option.type === 'boolean' && (
              <Select onValueChange={setValue} defaultValue={value}>
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

          {clause.type === 'between' && (
            <div className="flex items-center gap-2 pl-2">
              <AmpersandIcon className="text-muted-foreground pointer-events-none size-4 shrink-0" />
              {option.type === 'number' && (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}

              {option.type === 'date' && (
                <DatePicker
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => {
                    setValue(date ? format(date, 'yyyy-MM-dd') : '')
                  }}
                  locale={i18n.language}
                />
              )}

              {option.type === 'datetime' && (
                <DatePicker
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => {
                    setValue(date ? formatISO(date) : '')
                  }}
                  locale={i18n.language}
                  showTime
                />
              )}
            </div>
          )}
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={handleApplyFilterClick}
          disabled={
            !value.trim() || (clause.type === 'between' && !value.includes(','))
          }
        >
          {t('apply')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
