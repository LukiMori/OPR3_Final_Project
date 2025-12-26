import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'
import type { MovieSummary } from '../types/movie.ts'

interface SearchBarProps<T extends MovieSummary> {
  placeholder: string
  onSearch: (query: string) => void
  results: T[]
  renderResult: (result: T, onClick: (result: string) => void) => ReactNode
  onResultClick: (result: string) => void
  loading?: boolean
}

const SearchBar = <T extends MovieSummary>({
  placeholder,
  onSearch,
  results,
  renderResult,
  onResultClick,
  loading
}: SearchBarProps<T>) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  const handleResultClick = (result: string) => {
    onResultClick(result)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='relative'>
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-dark/50 dark:text-dark-text/50'
          size={18}
        />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className='w-full pl-10 pr-10 py-2 rounded-lg border-2 border-secondary-green
                   bg-white dark:bg-dark-bg
                   text-primary-dark dark:text-dark-text
                   placeholder:text-primary-dark/50 dark:placeholder:text-dark-text/50
                   focus:border-accent-orange focus:outline-none transition-colors'
        />
        {query && (
          <button
            onClick={handleClear}
            className='absolute right-3 top-1/2 transform -translate-y-1/2
                     text-primary-dark/50 dark:text-dark-text/50 hover:text-accent-orange transition-colors'
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className='absolute z-50 w-full mt-2 bg-white dark:bg-dark-card rounded-lg shadow-2xl
                      border border-secondary-green dark:border-primary-dark max-h-96 overflow-y-auto'
        >
          {loading ? (
            <div className='p-4 text-center text-primary-dark/70 dark:text-dark-text/70'>Searching...</div>
          ) : results.length > 0 ? (
            <div className='py-2'>
              {results.map((result, index) => (
                <div key={index}>{renderResult(result, handleResultClick)}</div>
              ))}
            </div>
          ) : query ? (
            <div className='p-4 text-center text-primary-dark/70 dark:text-dark-text/70'>No results found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
