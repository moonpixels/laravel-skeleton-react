import { Text } from '@/Components/Text'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/UI/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { useSidebar } from '@/Components/UI/Sidebar'
import { useUser } from '@/Contexts/UserContext'
import { initials } from '@/Utils/strings'
import { Link } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { CircleUserIcon, LogOut } from 'lucide-react'
import { ElementType, ReactNode } from 'react'

type UserDropdownItem = {
  label: string
  icon: ElementType
  href: string
}

export function UserAvatar() {
  const { user } = useUser()

  return (
    <Avatar>
      {user.avatar_url ? (
        <>
          <AvatarImage alt={user.name} src={user.avatar_url} />
          <AvatarFallback delayMs={500}>{initials(user.name)}</AvatarFallback>
        </>
      ) : (
        <span>{initials(user.name)}</span>
      )}
    </Avatar>
  )
}

export function UserDetails() {
  const { user } = useUser()

  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <Text className="truncate" size="sm" weight="medium">
        {user.name}
      </Text>
      <Text className="truncate" size="xs" variant="muted">
        {user.email}
      </Text>
    </div>
  )
}

export function UserDropdown({ trigger }: { trigger: ReactNode }) {
  const { isMobile } = useSidebar()

  const { t } = useLaravelReactI18n()

  const items: UserDropdownItem[] = [
    {
      label: t('navigation.account_settings'),
      icon: CircleUserIcon,
      href: route('account.edit'),
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar />
            <UserDetails />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link prefetch href={item.href} className="flex w-full items-center gap-2">
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            as="button"
            href={route('logout')}
            method="post"
            className="flex w-full items-center gap-2"
          >
            <LogOut className="size-4 shrink-0" />
            {t('auth.log_out')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
