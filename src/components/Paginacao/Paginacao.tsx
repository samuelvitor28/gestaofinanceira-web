import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface TransactionsPaginationProps {
  page: number // página atual (começa em 1)
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | "ellipsis-start" | "ellipsis-end"

// Monta a lista de páginas com reticências quando há muitas páginas
function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages]
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    "ellipsis-start",
    page - 1,
    page,
    page + 1,
    "ellipsis-end",
    totalPages,
  ]
}

export function Paginacao({
  page,
  totalPages,
  onPageChange,
}: TransactionsPaginationProps) {
  if (totalPages <= 1) return null

  const isFirstPage = page === 1
  const isLastPage = page === totalPages

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    targetPage: number
  ) {
    event.preventDefault()
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) return
    onPageChange(targetPage)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={cn(isFirstPage && "pointer-events-none opacity-50")}
            onClick={(event) => handleClick(event, page - 1)}
          />
        </PaginationItem>

        {getPageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(event) => handleClick(event, item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={cn(isLastPage && "pointer-events-none opacity-50")}
            onClick={(event) => handleClick(event, page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}