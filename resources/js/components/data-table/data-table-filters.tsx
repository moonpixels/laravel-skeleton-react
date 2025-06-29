import { reloadData } from '@/components/data-table/data-table'
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
import { MouseEvent, useState } from 'react'
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

function validateFilterOptions(filterOptions: DataTableFilterOption[]): void {
  filterOptions.forEach((option) => {
    // Check `between` clause is only used with compatible types
    option.clause.forEach((clause) => {
      if (
        clause.type === 'between' &&
        !['date', 'datetime', 'number'].includes(option.type)
      ) {
        throw new Error(
          `The 'between' clause can only be used with 'date', 'datetime' or 'number' type filters.`
        )
      }
    })

    // Check `between` clause is not used with prefix or suffix
    if (
      option.clause.some(
        (clause) =>
          clause.type === 'between' &&
          (clause.valuePrefix ?? clause.valueSuffix)
      )
    ) {
      throw new Error(
        `The 'between' clause cannot have a value prefix or suffix.`
      )
    }

    // Check `select` options are provided for select type filters
    if (option.type === 'select' && !option.options?.length) {
      throw new Error(
        `The 'select' type filter '${option.labelTransKey}' must have options defined.`
      )
    }
  })
}

export function DataTableFilters<TData>({
  table,
  filterOptions = [],
}: DataTableFiltersDropdownProps<TData>) {
  validateFilterOptions(filterOptions)

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

const dateStringOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}

const dateTimeStringOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

type FilterValue =
  | { type: 'single'; value: string }
  | { type: 'between'; value: [string, string] }

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

  const [clause, setClause] = useState<DataTableFilterClause>(
    getAppliedClause() ?? option.clause[0]
  )
  const isBetween =
    clause.type === 'between' &&
    ['number', 'date', 'datetime'].includes(option.type)

  const [value, setValue] = useState<FilterValue>(() => {
    const appliedValue = getAppliedValue()

    if (isBetween) {
      const [from = '', to = ''] = appliedValue.split(',', 2)
      return { type: 'between', value: [from, to] }
    }

    return { type: 'single', value: appliedValue }
  })

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

  function formatFilterValue(
    clause: DataTableFilterClause,
    value: FilterValue
  ): string {
    // Separate between values with a comma
    if (clause.type === 'between' && value.type === 'between') {
      const [from, to] = value.value
      return from && to ? `${from},${to}` : ''
    }

    // Add prefix and suffix to the value if they exist
    if (value.type === 'single') {
      return value.value.trim()
        ? `${clause.valuePrefix ?? ''}${value.value}${clause.valueSuffix ?? ''}`
        : ''
    }

    return ''
  }

  function getAppliedColumnFilter(): ColumnFilter | undefined {
    return tableState.columnFilters.find((filter) =>
      option.clause.some((c) => c.filterKey === filter.id)
    )
  }

  function findClauseFromColumnFilter(
    columnFilter: ColumnFilter
  ): DataTableFilterClause | undefined {
    return option.clause.find((c) => {
      const keyMatchesId = c.filterKey === columnFilter.id

      // If the value is undefined, we don't check the value against the prefix or suffix
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

    const rawValue = String(appliedColumnFilter.value)

    // We don't support prefix and suffix on `between` clauses, so we don't need to remove them
    if (appliedClause.type === 'between') {
      return rawValue
    }

    // Remove the prefix and suffix from the value if they exist
    return rawValue
      .replace(new RegExp(`^${appliedClause.valuePrefix ?? ''}`), '')
      .replace(new RegExp(`${appliedClause.valueSuffix ?? ''}$`), '')
  }

  function getCurrentColumnFilters(): ColumnFiltersState {
    return tableState.columnFilters.map((filter) => {
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

  function isApplied(): boolean {
    return !!getAppliedColumnFilter()
  }

  function getFormattedAppliedValue(): string {
    const appliedValue = getAppliedValue()
    const appliedClause = getAppliedClause()

    if (!appliedValue || !appliedClause) {
      return ''
    }

    if (option.type === 'boolean') {
      return appliedValue === '1' ? t('true') : t('false')
    }

    if (option.type === 'select') {
      const selectedOption = option.options?.find(
        (o) => o.value === appliedValue
      )
      return selectedOption ? t(selectedOption.labelTransKey) : appliedValue
    }

    if (option.type === 'date') {
      if (appliedClause.type === 'between') {
        const [from, to] = appliedValue.split(',', 2)

        return `${
          from
            ? new Date(from).toLocaleDateString(
                i18n.language,
                dateStringOptions
              )
            : ''
        } – ${
          to
            ? new Date(to).toLocaleDateString(i18n.language, dateStringOptions)
            : ''
        }`
      }

      return new Date(appliedValue).toLocaleDateString(
        i18n.language,
        dateStringOptions
      )
    }

    if (option.type === 'datetime') {
      if (appliedClause.type === 'between') {
        const [from, to] = appliedValue.split(',', 2)

        return `${
          from
            ? new Date(from).toLocaleString(
                i18n.language,
                dateTimeStringOptions
              )
            : ''
        } – ${
          to
            ? new Date(to).toLocaleString(i18n.language, dateTimeStringOptions)
            : ''
        }`
      }

      return new Date(appliedValue).toLocaleString(
        i18n.language,
        dateTimeStringOptions
      )
    }

    return appliedValue
  }

  function handleRemoveFilterClick(event: MouseEvent) {
    event.stopPropagation()

    if (!isApplied()) {
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
      columnFilters: getCurrentColumnFilters(),
      globalFilter: tableState.globalFilter,
      reloadProps: table.options.meta?.reloadProps,
    })
  }

  function handleApplyFilterClick() {
    const filterValue = formatFilterValue(clause, value)

    if (!filterValue) {
      return
    }

    reloadData({
      pagination: undefined,
      sorting: tableState.sorting,
      columnFilters: [
        ...getCurrentColumnFilters(),
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

  const appliedTriggerButton = (
    <button className="text-muted-foreground hover:bg-accent flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium shadow-xs transition-colors">
      <div className="flex items-center gap-1">
        <MinusCircleIcon className="size-3" onClick={handleRemoveFilterClick} />
        {t(option.labelTransKey)}
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
      {t(option.labelTransKey)}
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
