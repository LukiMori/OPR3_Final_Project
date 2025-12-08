import { useState } from 'react'

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages))
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const resetToValidPage = (newTotalItems: number) => {
    const newTotalPages = Math.ceil(newTotalItems / itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetToValidPage
  }
}
