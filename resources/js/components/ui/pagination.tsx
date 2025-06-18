import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/utils'
import { Link } from '@inertiajs/react'
import { MoreHorizontalIcon, MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<typeof Link>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      data-disabled={props.disabled}
      {...props}
      className={cn(
        buttonVariants({
          variant: isActive ? 'secondary' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('group gap-2 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <MoveLeftIcon className="text-muted-foreground group-hover:text-foreground size-4" />
      <span>{t('common:previous')}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('group gap-2 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span>{t('common:next')}</span>
      <MoveRightIcon className="text-muted-foreground group-hover:text-foreground size-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  const { t } = useTranslation()

  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{t('translation:morePages')}</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
