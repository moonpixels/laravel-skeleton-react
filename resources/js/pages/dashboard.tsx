import { DataTable } from '@/components/data-table'
import { Heading } from '@/components/heading'
import { PageHeader } from '@/components/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/contexts/user-context'
import { AuthenticatedLayout } from '@/layouts/authenticated-layout'
import { PaginatedData } from '@/types'
import { User } from '@/types/models'
import { initials } from '@/utils/strings'
import { ColumnDef } from '@tanstack/react-table'
import { CircleCheckIcon, XCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'common:name',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="inline-flex items-center gap-4">
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
]

export default function Dashboard({ users }: { users: PaginatedData<User> }) {
  const { t } = useTranslation()

  const { user } = useUser()

  return (
    <AuthenticatedLayout title={t('common:dashboard')}>
      <PageHeader>{t('welcomeMessage', { name: user.first_name })}</PageHeader>

      <div className="py-10">
        <Heading as="h2" size="base" className="mb-4">
          {t('common:users')}
        </Heading>

        <DataTable
          columns={userTableColumns}
          data={users.data}
          meta={users.meta}
          dataProps={['users']}
        />
      </div>
    </AuthenticatedLayout>
  )
}
