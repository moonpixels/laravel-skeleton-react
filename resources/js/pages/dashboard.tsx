import { DataTable } from '@/components/data-table'
import { Heading } from '@/components/heading'
import { PageHeader } from '@/components/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from '@tanstack/react-table'
import {
  CircleCheckIcon,
  ClipboardIcon,
  MoreHorizontalIcon,
  XCircleIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'common:name',
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
    header: 'common:email',
  },
  {
    accessorKey: 'language',
    header: 'common:language',
  },
  {
    accessorKey: 'two_factor_confirmed_at',
    header: 'translation:2fa',
    cell: ({ cell }) => {
      return cell.getValue() ? (
        <CircleCheckIcon
          className="text-successful size-5"
          aria-label="2FA enabled"
        />
      ) : (
        <XCircleIcon
          className="text-destructive size-5"
          aria-label="2FA disabled"
        />
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
  },
]

export default function Dashboard({
  users,
  uuid,
  sorts,
  filters,
}: {
  users: PaginatedData<User>
  uuid: string
  sorts: SortingState | null
  filters: ColumnFiltersState | null
}) {
  const { t } = useTranslation()

  const { user } = useUser()

  return (
    <AuthenticatedLayout title={t('common:dashboard')}>
      <PageHeader>{t('welcomeMessage', { name: user.first_name })}</PageHeader>

      <div className="py-10">
        <Heading as="h2" size="base" className="mb-4">
          {t('common:users')}
        </Heading>

        {uuid && (
          <pre className="text-muted-foreground text-xs">
            {JSON.stringify({ uuid }, null, 2)}
          </pre>
        )}

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
          dataProps={['users']}
          initialSortingState={sorts ?? []}
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
            <span className="sr-only">{t('common:openMenu')}</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyClick}>
            <ClipboardIcon className="size-4" />
            {t('translation:copyId')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
