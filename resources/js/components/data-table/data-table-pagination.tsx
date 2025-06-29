import { Text } from '@/components/text'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { PaginationMeta } from '@/types'
import { Table as ReactTable } from '@tanstack/table-core'
import { DotIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DataTablePagination<TData>({
  table,
  paginationMeta,
}: {
  table: ReactTable<TData>
  paginationMeta: PaginationMeta
}) {
  const { t } = useTranslation()

  const links = paginationMeta.links

  // First item in links is always the previous page link
  const previousPageLink = links[0] ?? null

  // Last item in links is always the next page link
  const nextPageLink = links[links.length - 1] ?? null

  // The rest of the links are the page numbers
  const pageLinks = links.slice(1, -1)

  const reloadProps = table.options.meta?.reloadProps ?? []

  const selectedRowsCount = table.getSelectedRowModel().rows.length

  return (
    <div className="flex flex-col items-center justify-between gap-4 xl:flex-row">
      <div className="flex items-center gap-1">
        {selectedRowsCount > 0 && (
          <>
            <Text size="sm" variant="muted" className="shrink-0">
              {t('dataTableSelectedRows', {
                count: selectedRowsCount,
              })}
            </Text>
            <DotIcon className="text-muted-foreground size-4 shrink-0" />
          </>
        )}
        <Text as="span" size="sm" className="shrink-0" variant="muted">
          {t('dataTableResults', {
            from: paginationMeta.from,
            to: paginationMeta.to,
            total: paginationMeta.total,
          })}
        </Text>
      </div>

      <Pagination className="xl:justify-end">
        <PaginationContent className="flex w-full items-center justify-between sm:w-auto">
          <PaginationItem>
            <PaginationPrevious
              href={previousPageLink?.url ?? '#'}
              disabled={!previousPageLink?.url}
              only={reloadProps}
            />
          </PaginationItem>
          {pageLinks.map((link) =>
            link.url ? (
              <PaginationItem className="hidden sm:block" key={link.label}>
                <PaginationLink
                  isActive={link.active}
                  href={link.url}
                  only={reloadProps}
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationEllipsis className="hidden sm:flex" key={link.label} />
            )
          )}
          <PaginationItem>
            <PaginationNext
              href={nextPageLink?.url ?? '#'}
              disabled={!nextPageLink?.url}
              only={reloadProps}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
