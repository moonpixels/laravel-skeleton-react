import {
  DataTable,
  DataTableActionsDropdown,
  DataTableCheckboxCell,
  DataTableCheckboxHeader,
} from '@/components/data-table'
import { Heading } from '@/components/heading'
import { PageHeader } from '@/components/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/user-context'
import { useCopy } from '@/hooks/use-copy'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { PaginatedData } from '@/types'
import { User } from '@/types/models'
import { initials } from '@/utils/strings'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
} from '@tanstack/react-table'
import {
  CheckIcon,
  ClipboardIcon,
  FileSpreadsheetIcon,
  MoreHorizontalIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const userTableColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => <DataTableCheckboxHeader table={table} />,
    cell: ({ row }) => <DataTableCheckboxCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'name',
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="inline-flex items-center gap-4 align-middle">
          <Avatar>
            <AvatarImage alt={user.name} src={user.avatar_url ?? undefined} />
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium">{user.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'email',
  },
  {
    accessorKey: 'language',
    header: 'language',
  },
  {
    accessorKey: 'two_factor_confirmed_at',
    header: '2fa',
    cell: ({ cell }) => {
      return cell.getValue() ? (
        <CheckIcon
          className="text-successful size-4"
          aria-label="2FA enabled"
        />
      ) : (
        <XIcon className="text-destructive size-4" aria-label="2FA disabled" />
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      return <UserActionsMenu user={user} />
    },
    enableSorting: false,
    enableHiding: false,
  },
]

export default function Dashboard({
  users,
  sorts,
  filters,
}: {
  users: PaginatedData<User>
  sorts: SortingState | null
  filters: ColumnFiltersState | null
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

        {sorts && (
          <pre className="text-muted-foreground text-xs">
            {JSON.stringify(sorts, null, 2)}
          </pre>
        )}

        {filters && (
          <pre className="text-muted-foreground text-xs">
            {JSON.stringify(filters, null, 2)}
          </pre>
        )}

        <DataTable
          columns={userTableColumns}
          data={users.data}
          meta={users.meta}
          reloadProps={['users']}
          initialSortingState={sorts ?? []}
          initialFiltersState={filters ?? []}
          actionsDropdown={(table) => <UserActionsDropdown table={table} />}
        />
      </div>
    </AuthenticatedLayout>
  )
}

function UserActionsMenu({ user }: { user: User }) {
  const { t } = useTranslation()

  const { copyText } = useCopy()

  function handleCopyClick() {
    copyText(user.id.toString())
  }

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t('openMenu')}</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyClick}>
            <ClipboardIcon className="size-4" />
            {t('copyId')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function UserActionsDropdown({ table }: { table: Table<User> }) {
  const { t } = useTranslation()

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <DataTableActionsDropdown>
      <DropdownMenuGroup>
        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            console.log('Downloading CSV')
          }}
        >
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
          onClick={() => {
            console.log(
              'Delete selected users:',
              selectedRows.map((row) => row.original.id)
            )
          }}
        >
          <TrashIcon className="size-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DataTableActionsDropdown>
  )
}
