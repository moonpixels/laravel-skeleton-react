import { Text } from '@/components/text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/components/ui/sidebar'
import { useUser } from '@/contexts/user-context'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import { initials } from '@/utils/strings'
import { Link } from '@inertiajs/react'
import { CircleUserIcon, LogOut } from 'lucide-react'
import { ElementType, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface UserDropdownItem {
  label: string
  icon: ElementType
  href: string
}

export function UserAvatar() {
  const { user } = useUser()

  console.log('user', user)

  console.log('UserAvatar', user.name, user.avatar_url)

  return (
    <Avatar>
      <AvatarImage alt={user.name} src={user.avatar_url ?? undefined} />
      <AvatarFallback delayMs={500}>{initials(user.name)}</AvatarFallback>
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

  const { t } = useTranslation()

  const cleanup = useMobileNavigation()

  const items: UserDropdownItem[] = [
    {
      label: t('accountSettings'),
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
              <Link
                href={item.href}
                className="flex w-full items-center gap-2"
                onClick={cleanup}
                prefetch
              >
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
            {t('logOut')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
