import { DataTableColumnsDropdown } from '@/components/data-table/data-table-columns-dropdown'
import {
  DataTableFilterOption,
  DataTableFilters,
} from '@/components/data-table/data-table-filters'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableSearchInput } from '@/components/data-table/data-table-search-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaginationMeta } from '@/types'
import { router } from '@inertiajs/react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  Table as ReactTable,
  RowData,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { debounce, merge, union } from 'es-toolkit'
import { ScanSearchIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo } from 'react'
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
   * We include a `transKey` in the column meta to allow for
   * translating column headers.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    transKey?: string
  }
}

interface ReloadDataProps {
  pagination?: PaginationState
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  globalFilter?: unknown
  reloadProps?: string[]
}

export const reloadData = debounce(
  ({
    pagination = undefined,
    sorting = undefined,
    columnFilters = undefined,
    globalFilter = undefined,
    reloadProps = [],
  }: ReloadDataProps) => {
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

  useEffect(() => {
    if (table.getSelectedRowModel().rows.length) {
      table.toggleAllRowsSelected(false)
    }
  }, [data, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {enableSearch && <DataTableSearchInput table={table} />}
        </div>
        <div className="flex items-center gap-2">
          {actionsDropdown?.(table)}
          <DataTableColumnsDropdown table={table} />
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
