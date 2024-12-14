import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/Components/UI/Breadcrumb'
import { Link } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { Fragment } from 'react'

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface PageBreadcrumbsProps {
  items?: BreadcrumbItemType[]
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const { t } = useLaravelReactI18n()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {route().current('home') ? (
            <BreadcrumbPage>{t('navigation.home')}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={route('home')}>{t('navigation.home')}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {items && items.length > 0 && <BreadcrumbSeparator />}

        {items?.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem key={item.label}>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link prefetch href={item.href}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                item.label
              )}
            </BreadcrumbItem>

            {index !== items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
