import { Logo } from '@/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  UserAvatar,
  UserDetails,
  UserDropdown,
} from '@/components/user-dropdown'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import { Link } from '@inertiajs/react'
import { ChevronsUpDown, LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AppSidebar() {
  const { t } = useTranslation()

  const cleanup = useMobileNavigation()

  const { state } = useSidebar()

  const primaryNavItems = [
    {
      label: t('dashboard'),
      href: route('dashboard.index'),
      isActive: route().current('dashboard*'),
      icon: LayoutDashboard,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={route('dashboard.index')}
              className="flex p-2 group-data-[collapsible=icon]:px-1"
              onClick={cleanup}
              prefetch
            >
              <Logo
                iconOnly={state === 'collapsed'}
                className="h-6 w-auto shrink-0"
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link
                      href={item.href}
                      onClick={cleanup}
                      className="group"
                      prefetch
                    >
                      <item.icon className="text-muted-foreground group-hover/menu-item:text-sidebar-foreground group-data-[active=true]:text-sidebar-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown
              trigger={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatar />
                  <UserDetails />
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
