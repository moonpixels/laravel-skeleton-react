import { reloadData } from '@/components/data-table/data-table'
import { Input } from '@/components/ui/input'
import type { Table as ReactTable } from '@tanstack/table-core'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function DataTableSearchInput<TData>({
  table,
}: {
  table: ReactTable<TData>
}) {
  const { t } = useTranslation()

  const tableState = table.getState()

  const [query, setQuery] = useState<string>(tableState.globalFilter ?? '')

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    setQuery(value)

    reloadData({
      pagination: undefined,
      sorting: tableState.sorting,
      columnFilters: tableState.columnFilters,
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
