import { Text } from '@/components/text'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/utils/utils'
import { Link } from '@inertiajs/react'

interface PageNavigationProps {
  items: {
    label: string
    href: string
    current: boolean
  }[]
}

export function PageNavigation({ items }: PageNavigationProps) {
  return (
    <ScrollArea className="-mx-4 mt-6 sm:-mx-6 lg:-mx-8">
      <nav className="h-10 w-full px-4 sm:px-6 lg:px-8">
        <ul className="flex h-full gap-4 border-b">
          {items.map((item) => (
            <li key={item.href} className="-mb-px">
              <Link
                prefetch
                className={cn(
                  'group flex h-full items-center border-b-2',
                  item.current ? 'border-primary' : 'border-transparent'
                )}
                href={item.href}
              >
                <Text
                  variant={item.current ? undefined : 'muted'}
                  className="group-hover:text-foreground leading-none"
                  size="sm"
                  weight="medium"
                >
                  {item.label}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
