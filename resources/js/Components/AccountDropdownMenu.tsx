import { Text } from '@/Components/Text'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/UI/Avatar'
import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { useUser } from '@/Hooks/useUser'
import { initials } from '@/Utils/strings'
import { Method } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { CircleUserIcon, LogOutIcon } from 'lucide-react'
import { ElementType } from 'react'

interface Item {
  label: string
  icon: ElementType
  href: string
  method: Method
  as?: string
}

export function AccountDropdownMenu() {
  const { user } = useUser()
  const { t } = useLaravelReactI18n()

  const items: Item[] = [
    {
      label: t('navigation.account_settings'),
      icon: CircleUserIcon,
      href: route('account.edit'),
      method: 'get',
    },
    {
      label: t('auth.log_out'),
      icon: LogOutIcon,
      href: route('logout'),
      method: 'post',
      as: 'button',
    },
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="hover:bg-inherit" size="icon" variant="ghost">
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
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <Text className="block truncate" size="sm" weight="medium">
              {user.name}
            </Text>
            <Text className="block truncate" size="sm" variant="muted">
              {user.email}
            </Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                as={item.as}
                href={item.href}
                method={item.method}
                className="flex w-full items-center gap-2"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
