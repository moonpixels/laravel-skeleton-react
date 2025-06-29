import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { UserAvatar, UserDropdown } from '@/components/user-dropdown'
import { Link } from '@inertiajs/react'

export function MobileHeader() {
  const { isMobile } = useSidebar()

  return isMobile ? (
    <header>
      <div className="flex h-14 w-full items-center justify-between border-b px-4 sm:px-6">
        <SidebarTrigger />

        <Link href={route('dashboard.index')}>
          <Logo iconOnly className="h-6 w-auto" />
        </Link>

        <UserDropdown
          trigger={
            <Button className="hover:bg-inherit" size="icon" variant="ghost">
              <UserAvatar />
            </Button>
          }
        />
      </div>
    </header>
  ) : null
}
