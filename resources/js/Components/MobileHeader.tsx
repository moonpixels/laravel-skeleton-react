import { Logo } from '@/Components/Logo'
import { Button } from '@/Components/UI/Button'
import { SidebarTrigger, useSidebar } from '@/Components/UI/Sidebar'
import { UserAvatar, UserDropdown } from '@/Components/UserDropdown'
import { Link } from '@inertiajs/react'

export function MobileHeader() {
  const { isMobile } = useSidebar()

  return isMobile ? (
    <header>
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <SidebarTrigger />

        <Link href={route('home')}>
          <Logo className="h-6 w-auto" />
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
