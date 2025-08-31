import { DataTable } from '@/components/data-table/data-table'
import { DataTableActionsDropdown } from '@/components/data-table/data-table-actions-dropdown'
import { Heading } from '@/components/heading'
import { PageHeader } from '@/components/page-header'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/user-context'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { columns } from '@/pages/dashboard/partials/user-table-columns'
import { filterOptions } from '@/pages/dashboard/partials/user-table-filters'
import { PaginatedData } from '@/types'
import { User } from '@/types/models'
import { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table'
import { FileSpreadsheetIcon, TrashIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Index({
  users,
  sorts,
  filters,
}: {
  users: PaginatedData<User>
  sorts: SortingState
  filters: ColumnFiltersState
}) {
  const { t } = useTranslation()

  const { user } = useUser()

  return (
    <AuthenticatedLayout title={t('dashboard')}>
      <PageHeader>{t('welcomeMessage', { name: user.first_name })}</PageHeader>

      <div className="py-10">
        <Heading as="h2" size="base" className="mb-4">
          {t('users')}
        </Heading>

        <DataTable
          columns={columns}
          data={users.data}
          paginationMeta={users.meta}
          reloadProps={['users']}
          initialSortingState={sorts}
          initialFiltersState={filters}
          actionsDropdown={(table) => <UserActionsDropdown table={table} />}
          filterOptions={filterOptions}
        />
      </div>
    </AuthenticatedLayout>
  )
}

function UserActionsDropdown({ table }: { table: Table<User> }) {
  const { t } = useTranslation()

  const selectedRows = table.getSelectedRowModel().rows

  function handleDownloadCsv() {
    // TODO)) Implement CSV download logic here
  }

  function handleDeleteSelected() {
    // TODO)) Implement delete logic here
  }

  return (
    <DataTableActionsDropdown>
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleDownloadCsv}>
          <FileSpreadsheetIcon className="size-4" />
          {t('downloadCsv')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('bulkActions')}</DropdownMenuLabel>
        <DropdownMenuItem
          variant="destructive"
          disabled={selectedRows.length === 0}
          onClick={handleDeleteSelected}
        >
          <TrashIcon className="size-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DataTableActionsDropdown>
  )
}
