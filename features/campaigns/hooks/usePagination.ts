"use client"

import { useState, useMemo } from 'react'

interface UsePaginationProps<T> {
  items: T[]
  itemsPerPage: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  // Current page data
  currentItems: T[]
  currentPage: number
  
  // Pagination info
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
  
  // Actions
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  
  // Page info
  startIndex: number
  endIndex: number
  pageInfo: string
}

export function usePagination<T>({
  items,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages))
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex)
  }, [items, startIndex, endIndex])
  
  const hasNextPage = validCurrentPage < totalPages
  const hasPrevPage = validCurrentPage > 1
  
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }
  
  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(validCurrentPage + 1)
    }
  }
  
  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(validCurrentPage - 1)
    }
  }
  
  const goToFirstPage = () => {
    setCurrentPage(1)
  }
  
  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }
  
  const pageInfo = `${startIndex + 1}-${endIndex} de ${totalItems}`
  
  return {
    currentItems,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    startIndex,
    endIndex,
    pageInfo
  }
} 