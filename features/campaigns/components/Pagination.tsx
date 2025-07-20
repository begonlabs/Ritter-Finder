"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import styles from "../styles/Pagination.module.css"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageInfo: string
  className?: string
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  pageInfo,
  className 
}: PaginationProps) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5 // Show max 5 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, ..., last
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-2, last-1, last
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`${styles.pagination} ${className || ''}`}>
      {/* Page Info */}
      <div className={styles.pageInfo}>
        <span className={styles.pageInfoText}>{pageInfo}</span>
      </div>

      {/* Pagination Controls */}
      <div className={styles.controls}>
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className={styles.ellipsis}>...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 