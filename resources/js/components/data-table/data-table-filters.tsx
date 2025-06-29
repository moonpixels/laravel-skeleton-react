import { reloadData } from '@/components/data-table/data-table'
import {
  findClauseFromColumnFilter,
  formatValueForDisplay,
  formatValueForQueryParam,
  validateFilterOptions,
} from '@/components/data-table/data-table-filters-utils'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
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
import { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table'
import { Table as ReactTable } from '@tanstack/table-core'
import { format, formatISO } from 'date-fns'
import {
  AmpersandIcon,
  CornerDownRightIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from 'lucide-react'
import { MouseEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  labelTransKey: string
  type: 'text' | 'number' | 'select' | 'date' | 'datetime' | 'boolean'
  clause: DataTableFilterClause[]
  options?: { labelTransKey: string; value: string }[]
}

interface DataTableFiltersDropdownProps<TData> {
  table: ReactTable<TData>
  filterOptions?: DataTableFilterOption[]
}

export type FilterValue =
  | { type: 'single'; value: string }
  | { type: 'between'; value: [string, string] }

export function DataTableFilters<TData>({
  table,
  filterOptions = [],
}: DataTableFiltersDropdownProps<TData>) {
  useMemo(() => validateFilterOptions(filterOptions), [filterOptions])

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

  const tableState = table.getState()

  const [open, setOpen] = useState(false)

  const appliedColumnFilter = useMemo((): ColumnFilter | undefined => {
    return tableState.columnFilters.find((filter) =>
      option.clause.some((clause) => clause.filterKey === filter.id)
    )
  }, [tableState.columnFilters, option.clause])

  const appliedClause = useMemo((): DataTableFilterClause | undefined => {
    if (!appliedColumnFilter) {
      return undefined
    }

    return findClauseFromColumnFilter(option, appliedColumnFilter)
  }, [option, appliedColumnFilter])

  const [clause, setClause] = useState<DataTableFilterClause>(
    appliedClause ?? option.clause[0]
  )

  const isBetween =
    clause.type === 'between' &&
    ['number', 'date', 'datetime'].includes(option.type)

  const isActive = !!appliedColumnFilter

  const appliedValue = useMemo((): string => {
    if (!appliedClause || !appliedColumnFilter) {
      return ''
    }

    const rawValue = String(appliedColumnFilter.value)

    // We don't support prefix and suffix on `between` clauses, so we don't need to remove them
    if (appliedClause.type === 'between') {
      return rawValue
    }

    // Remove the prefix and suffix from the value if they exist
    return rawValue
      .replace(new RegExp(`^${appliedClause.valuePrefix ?? ''}`), '')
      .replace(new RegExp(`${appliedClause.valueSuffix ?? ''}$`), '')
  }, [appliedClause, appliedColumnFilter])

  const [value, setValue] = useState<FilterValue>(() => {
    if (isBetween) {
      const [from = '', to = ''] = appliedValue.split(',', 2)
      return { type: 'between', value: [from, to] }
    }

    return { type: 'single', value: appliedValue }
  })

  const currentColumnFilters = useMemo((): ColumnFiltersState => {
    return tableState.columnFilters.map((filter) => {
      // Remove filter for the current option so we can apply the new one
      if (findClauseFromColumnFilter(option, filter)) {
        return {
          id: filter.id,
          value: undefined,
        }
      }

      return filter
    })
  }, [tableState.columnFilters, option])

  const displayValue = useMemo(
    (): string =>
      formatValueForDisplay({
        appliedValue: appliedValue,
        appliedClause: appliedClause ?? clause,
        option,
        t,
        i18n,
      }),
    [appliedValue, appliedClause, clause, option, t, i18n]
  )

  const displaySymbol = useMemo((): string => {
    if (!appliedClause) {
      return ''
    }

    switch (appliedClause.type) {
      case 'equal':
        return '='
      case 'notEqual':
        return '≠'
      case 'contains':
        return '≈'
      case 'greaterThan':
        return '>'
      case 'lessThan':
        return '<'
      case 'greaterThanOrEqual':
        return '≥'
      case 'lessThanOrEqual':
        return '≤'
      case 'between':
        return '><'
      default:
        return ''
    }
  }, [appliedClause])

  function handleRemoveFilterClick(event: MouseEvent) {
    event.stopPropagation()

    if (!isActive) {
      return
    }

    setValue(
      isBetween
        ? { type: 'between', value: ['', ''] }
        : { type: 'single', value: '' }
    )

    reloadData({
      pagination: undefined,
      sorting: tableState.sorting,
      columnFilters: currentColumnFilters,
      globalFilter: tableState.globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  function handleClauseChange(clauseType: DataTableFilterClauseType) {
    const newClause = option.clause.find((c) => c.type === clauseType)

    if (!newClause) {
      return
    }

    const oldClause = clause

    setClause(newClause)

    // When changing the clause type from 'between' use the first value as the new value
    if (clauseType !== 'between' && oldClause.type === 'between') {
      setValue({
        type: 'single',
        value: value.type === 'between' ? value.value[0] : '',
      })
      return
    }

    // When changing the clause type to 'between' use the current value as the first value
    if (clauseType === 'between' && oldClause.type !== 'between') {
      setValue({
        type: 'between',
        value: [value.type === 'single' ? value.value : '', ''],
      })
      return
    }
  }

  function handleSingleValueChange(val: string) {
    setValue({ type: 'single', value: val })
  }

  function handleBetweenValueChange(index: 0 | 1, value: string) {
    setValue((prev) =>
      prev.type === 'between'
        ? {
            type: 'between',
            value:
              index === 0 ? [value, prev.value[1]] : [prev.value[0], value],
          }
        : prev
    )
  }

  function handleApplyFilterClick() {
    const filterValue = formatValueForQueryParam(clause, value)

    if (!filterValue) {
      return
    }

    reloadData({
      pagination: undefined,
      sorting: tableState.sorting,
      columnFilters: [
        ...currentColumnFilters,
        {
          id: clause.filterKey,
          value: filterValue,
        },
      ],
      globalFilter: tableState.globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })

    setOpen(false)
  }

  const activeTrigger = (
    <button className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium shadow-xs transition-colors">
      <div className="flex items-center gap-1">
        <MinusCircleIcon className="size-3" onClick={handleRemoveFilterClick} />
        {t(option.labelTransKey)}
      </div>
      <span>{displaySymbol}</span>
      <span className="text-foreground max-w-[250px] overflow-hidden text-nowrap text-ellipsis">
        {displayValue}
      </span>
    </button>
  )

  const inactiveTrigger = (
    <button className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-full border border-dashed px-2 py-1 text-xs font-medium transition-colors">
      <PlusCircleIcon className="size-3" />
      {t(option.labelTransKey)}
    </button>
  )

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isActive ? activeTrigger : inactiveTrigger}
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
            column: t(option.labelTransKey).toLowerCase(),
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
            {option.type === 'text' && (
              <Input
                type="text"
                value={value.type === 'single' ? value.value : ''}
                onChange={(e) => handleSingleValueChange(e.target.value)}
              />
            )}

            {option.type === 'number' && (
              <Input
                type="number"
                value={value.type === 'single' ? value.value : value.value[0]}
                onChange={(e) =>
                  isBetween
                    ? handleBetweenValueChange(0, e.target.value)
                    : handleSingleValueChange(e.target.value)
                }
              />
            )}

            {option.type === 'select' && (
              <Select
                onValueChange={handleSingleValueChange}
                defaultValue={value.type === 'single' ? value.value : ''}
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
                      {t(opt.labelTransKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {option.type === 'date' && (
              <DatePicker
                selected={
                  value.type === 'single' && value.value
                    ? new Date(value.value)
                    : value.value[0]
                      ? new Date(value.value[0])
                      : undefined
                }
                onSelect={(date) =>
                  isBetween
                    ? handleBetweenValueChange(
                        0,
                        date ? format(date, 'yyyy-MM-dd') : ''
                      )
                    : handleSingleValueChange(
                        date ? format(date, 'yyyy-MM-dd') : ''
                      )
                }
                locale={i18n.language}
              />
            )}

            {option.type === 'datetime' && (
              <DatePicker
                selected={
                  value.type === 'single' && value.value
                    ? new Date(value.value)
                    : value.value[0]
                      ? new Date(value.value[0])
                      : undefined
                }
                onSelect={(date) =>
                  isBetween
                    ? handleBetweenValueChange(0, date ? formatISO(date) : '')
                    : handleSingleValueChange(date ? formatISO(date) : '')
                }
                locale={i18n.language}
                showTime
              />
            )}

            {option.type === 'boolean' && (
              <Select
                onValueChange={handleSingleValueChange}
                defaultValue={value.type === 'single' ? value.value : ''}
              >
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
                  value={value.type === 'between' ? value.value[1] : ''}
                  onChange={(e) => handleBetweenValueChange(1, e.target.value)}
                />
              )}

              {option.type === 'date' && (
                <DatePicker
                  selected={
                    value.type === 'between' && value.value[1]
                      ? new Date(value.value[1])
                      : undefined
                  }
                  onSelect={(date) =>
                    handleBetweenValueChange(
                      1,
                      date ? format(date, 'yyyy-MM-dd') : ''
                    )
                  }
                  locale={i18n.language}
                />
              )}

              {option.type === 'datetime' && (
                <DatePicker
                  selected={
                    value.type === 'between' && value.value[1]
                      ? new Date(value.value[1])
                      : undefined
                  }
                  onSelect={(date) =>
                    handleBetweenValueChange(1, date ? formatISO(date) : '')
                  }
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
            isBetween
              ? !(
                  value.type === 'between' &&
                  value.value[0].trim() &&
                  value.value[1].trim()
                )
              : !(value.type === 'single' && value.value.trim())
          }
        >
          {t('apply')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
