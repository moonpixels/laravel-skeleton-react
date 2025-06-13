import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from '@inertiajs/react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface PageBreadcrumbsProps {
  items?: BreadcrumbItemType[]
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const { t } = useTranslation()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {route().current('dashboard') ? (
            <BreadcrumbPage>{t('dashboard')}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={route('dashboard')}>{t('dashboard')}</Link>
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
