import { Text } from '@/Components/Text'
import { cn } from '@/Utils/utils'
import { Link } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { Home, UserCircleIcon } from 'lucide-react'

export function PrimaryNavigation() {
  const { t } = useLaravelReactI18n()

  const items = [
    {
      label: t('navigation.home'),
      href: route('home'),
      current: route().current('home*'),
      icon: Home,
    },
    {
      label: t('navigation.account_settings'),
      href: route('account.edit'),
      current: route().current('account*'),
      icon: UserCircleIcon,
    },
  ]

  return (
    <nav>
      <ul className="-mx-2 space-y-1 lg:mx-0" role="list">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              className={cn(
                'flex items-center gap-2 rounded-sm px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5',
                { 'bg-black/3 dark:bg-white/3': item.current }
              )}
              href={item.href}
            >
              <item.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />

              <Text
                weight={item.current ? 'semibold' : 'medium'}
                className="leading-none text-foreground"
                size="sm"
              >
                {item.label}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
