import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import {
  DataTableSelectCell,
  DataTableSelectHeader,
} from '@/components/data-table/data-table-select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCopy } from '@/hooks/use-copy'
import { User } from '@/types/models'
import { initials } from '@/utils/strings'
import { ColumnDef } from '@tanstack/react-table'
import {
  CheckIcon,
  ClipboardIcon,
  MoreHorizontalIcon,
  XIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => <DataTableSelectHeader table={table} />,
    cell: ({ row }) => <DataTableSelectCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ table, column }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        titleTransKey="name"
      />
    ),
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
    meta: {
      transKey: 'name',
    },
  },
  {
    accessorKey: 'email',
    header: ({ table, column }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        titleTransKey="email"
      />
    ),
    meta: {
      transKey: 'email',
    },
  },
  {
    accessorKey: 'language',
    header: ({ table, column }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        titleTransKey="language"
      />
    ),
    meta: {
      transKey: 'language',
    },
  },
  {
    accessorKey: 'email_verified_at',
    header: ({ table, column }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        titleTransKey="emailVerified"
      />
    ),
    cell: ({ cell }) => {
      return cell.getValue() ? (
        <CheckIcon
          className="text-successful size-4"
          aria-label="Email verified"
        />
      ) : (
        <XIcon
          className="text-destructive size-4"
          aria-label="Email not verified"
        />
      )
    },
    enableSorting: false,
    meta: {
      transKey: 'emailVerified',
    },
  },
  {
    accessorKey: 'two_factor_confirmed_at',
    header: ({ table, column }) => (
      <DataTableColumnHeader
        table={table}
        column={column}
        titleTransKey="2fa"
      />
    ),
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
    meta: {
      transKey: '2fa',
    },
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
