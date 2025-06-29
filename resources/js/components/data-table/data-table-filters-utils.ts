import {
  DataTableFilterClause,
  DataTableFilterOption,
  FilterValue,
} from '@/components/data-table/data-table-filters'
import { ColumnFilter } from '@tanstack/react-table'
import { i18n, TFunction } from 'i18next'

export function validateFilterOptions(
  filterOptions: DataTableFilterOption[]
): void {
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

export function formatValueForQueryParam(
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

export function findClauseFromColumnFilter(
  option: DataTableFilterOption,
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

export function formatValueForDisplay({
  appliedValue,
  appliedClause,
  option,
  t,
  i18n,
}: {
  appliedValue: string
  appliedClause: DataTableFilterClause
  option: DataTableFilterOption
  t: TFunction
  i18n: i18n
}): string {
  if (option.type === 'boolean') {
    return appliedValue === '1' ? t('true') : t('false')
  }

  if (option.type === 'select') {
    const selectedOption = option.options?.find((o) => o.value === appliedValue)
    return selectedOption ? t(selectedOption.labelTransKey) : appliedValue
  }

  if (option.type === 'date') {
    if (appliedClause.type === 'between') {
      const [from, to] = appliedValue.split(',', 2)

      return `${
        from
          ? new Date(from).toLocaleDateString(i18n.language, dateStringOptions)
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
          ? new Date(from).toLocaleString(i18n.language, dateTimeStringOptions)
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
