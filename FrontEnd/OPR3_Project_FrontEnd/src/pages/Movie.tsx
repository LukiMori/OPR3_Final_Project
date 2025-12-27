import { useEffect, useState } from 'react'
import { Calendar, Heart, MessageSquare } from 'lucide-react'
import { api } from '../services/api.ts'
import { useParams } from 'react-router-dom'

import moviePlaceholderImage from '../assets/placeholder-movie.png'
import type { TmdbMovie } from '../types/movie.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { usePagination } from '../hooks/usePagination.ts'

const Movie = () => {
  const { user } = useAuth()
  const { movieId } = useParams<{ movieId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [movie, setMovie] = useState<TmdbMovie | null>(null)
  const [movieLiked, setMovieLiked] = useState<boolean>(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [newComment, setNewComment] = useState('')

  const commentsPagination = usePagination(movie?.comments || [], 10)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId || !user) {
        setError('Movie ID or user not available')
        setLoading(false)
        return
      }

      try {
        setError('')
        const [movieData, isLiked] = await Promise.all([
          api.getMovieDetails(parseInt(movieId)),
          api.isMovieLikedByUser(parseInt(movieId), user?.id)
        ])
        setMovie(movieData)
        setMovieLiked(isLiked)
      } catch (err) {
        setError('Failed to load movie details.')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchMovieDetails()
  }, [movieId, user])

  const handleMovieLike = async () => {
    setIsWaiting(true)
    if (!movieId || !user) return

    try {
      await api.changeMovieLikedByUserId(parseInt(movieId), user.id, !movieLiked)
      setMovieLiked(!movieLiked)
    } catch (err) {
      console.error('Failed to update favorite status:', err)
    }
    setIsWaiting(false)
  }

  const handleMovieComment = async (commentContent: string) => {
    if (!commentContent.trim()) return
    setIsWaiting(true)
    if (!movieId || !user) return

    try {
      const newCommentData = await api.addCommentToMovieByUser(parseInt(movieId), user.id, commentContent)

      setMovie((prev) => {
        if (!prev) return prev

        const currentComments = prev.comments || []

        return {
          ...prev,
          comments: [...currentComments, newCommentData],
          totalComments: currentComments.length + 1
        }
      })

      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment to movie:', err)
    }
    setIsWaiting(false)
  }

  const handleDeleteCommentClick = async (commentId: number) => {
    if (!commentId || !user) return

    try {
      await api.deleteCommentFromMovie(commentId, user.id)

      setMovie((prev) => {
        if (!prev) return prev

        const currentComments = prev.comments || []
        const updatedComments = currentComments.filter((comment) => comment.id !== commentId)

        return {
          ...prev,
          comments: updatedComments,
          totalComments: updatedComments.length
        }
      })
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center'>
        <div className='text-primary-dark dark:text-dark-text text-xl'>Loading Movie...</div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className='min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center'>
        <div className='text-red-600 dark:text-red-400 text-xl'>{error || 'Movie not found'}</div>
      </div>
    )
  }

  const posterUrl = movie.posterUrl ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}` : moviePlaceholderImage

  return (
    <div className='min-h-screen bg-light dark:bg-dark-bg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className='flex-shrink-0'>
            <img src={posterUrl} alt={movie.title} className='w-64 h-96 object-cover rounded-lg shadow-lg' />
          </div>

          <div className='flex-1'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h1 className='text-4xl font-bold text-primary-dark dark:text-dark-text mb-2'>{movie.title}</h1>
                {movie.releaseDate && (
                  <div className='flex items-center gap-2 text-primary-dark/70 dark:text-dark-text/70'>
                    <Calendar size={18} />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                )}
              </div>

              <div className='flex gap-2'>
                <button
                  className='p-3 bg-accent-orange hover:bg-accent-orange/90
             text-light rounded-lg transition-colors'
                  title='Add to favorites'
                  disabled={isWaiting}
                  onClick={handleMovieLike}
                >
                  <Heart size={25} className={movieLiked ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-primary-dark dark:text-dark-text mb-3'>Overview</h2>
              <p className='text-primary-dark/80 dark:text-dark-text/80 leading-relaxed'>{movie.description}</p>
            </div>
          </div>
        </div>
        <div className='mt-6 bg-white dark:bg-dark-card rounded-xl shadow-md p-6'>
          <h2 className='text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2'>
            <MessageSquare size={24} className='text-accent-orange' />
            Comments
          </h2>

          <div className='mb-6'>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              minLength={1}
              disabled={isWaiting}
              placeholder='Share your thoughts about this movie...'
              className='w-full px-4 py-3 border-2 border-secondary-green rounded-lg
                                     bg-white dark:bg-dark-bg
                                     text-primary-dark dark:text-dark-text
                                     placeholder:text-primary-dark/50 dark:placeholder:text-dark-text/50
                                     focus:border-accent-orange focus:outline-none
                                     resize-none'
            />
            <button
              onClick={async () => {
                await handleMovieComment(newComment)
              }}
              disabled={isWaiting || !newComment.trim()}
              className='mt-3 px-6 py-2 bg-accent-orange hover:bg-accent-orange/90
              text-light font-semibold rounded-lg transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Post Comment
            </button>
          </div>

          <div className='space-y-4'>
            {movie.comments != null && movie.comments.length > 0 ? (
              <>
                <div className='space-y-4'>
                  {commentsPagination.currentItems.map((comment) => (
                    <div
                      key={comment.id}
                      className='p-5 rounded-xl bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10
                       hover:shadow-lg transition-all duration-200'
                    >
                      {/* Header with user info and timestamp */}
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          {/* User Avatar (initials) */}
                          <div
                            className='w-10 h-10 rounded-full bg-gradient-to-br from-accent-orange to-secondary-green
                              flex items-center justify-center flex-shrink-0'
                          >
                            <span className='text-white font-semibold text-sm'>
                              {comment.username.substring(0, 2).toUpperCase()}
                            </span>
                          </div>

                          {/* User info */}
                          <div className='flex flex-col'>
                            <span className='font-semibold text-primary-dark dark:text-dark-text'>
                              {comment.username}
                            </span>
                            <span className='text-xs text-primary-dark/60 dark:text-dark-text/60'>
                              {new Date(comment.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Delete button */}
                        {user?.username === comment.username && (
                          <button
                            className='text-xs px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                           border border-red-200 dark:border-red-800'
                            onClick={() => handleDeleteCommentClick(comment.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Comment content */}
                      <div className='ml-13 pl-0'>
                        <p className='text-primary-dark dark:text-dark-text leading-relaxed whitespace-pre-wrap'>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {commentsPagination.totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 mt-6'>
                    {/* Previous Button */}
                    <button
                      onClick={commentsPagination.goToPreviousPage}
                      disabled={commentsPagination.currentPage === 1}
                      className='px-3 py-2 rounded-lg bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10
                     hover:bg-secondary-green/10 dark:hover:bg-secondary-green/10
                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>←</span>
                    </button>

                    {/* First page */}
                    <button
                      key={1}
                      onClick={() => commentsPagination.goToPage(1)}
                      className={`px-4 py-2 rounded-lg transition-all font-medium
                        ${
                          commentsPagination.currentPage === 1
                            ? 'bg-accent-orange text-white shadow-md'
                            : 'bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10 text-primary-dark dark:text-dark-text hover:bg-secondary-green/10'
                        }`}
                    >
                      {1}
                    </button>

                    {commentsPagination.currentPage > 3 && (
                      <button
                        className='px-4 py-2 rounded-lg bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10 text-primary-dark dark:text-dark-text'
                        disabled={true}
                      >
                        ...
                      </button>
                    )}

                    {/* Middle pages */}
                    {(() => {
                      const current = commentsPagination.currentPage
                      const total = commentsPagination.totalPages
                      const start = Math.max(2, current - 1)
                      const end = Math.min(total - 1, current + 1)
                      const pages = []
                      for (let i = start; i <= end; i++) {
                        pages.push(i)
                      }
                      return pages
                    })().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => commentsPagination.goToPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-all font-medium
                          ${
                            commentsPagination.currentPage === pageNumber
                              ? 'bg-accent-orange text-white shadow-md'
                              : 'bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10 text-primary-dark dark:text-dark-text hover:bg-secondary-green/10'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {commentsPagination.currentPage < commentsPagination.totalPages - 2 && (
                      <button
                        className='px-4 py-2 rounded-lg bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10 text-primary-dark dark:text-dark-text'
                        disabled={true}
                      >
                        ...
                      </button>
                    )}

                    {/* Last page */}
                    <button
                      key={commentsPagination.totalPages}
                      onClick={() => commentsPagination.goToPage(commentsPagination.totalPages)}
                      className={`px-4 py-2 rounded-lg transition-all font-medium
                        ${
                          commentsPagination.currentPage === commentsPagination.totalPages
                            ? 'bg-accent-orange text-white shadow-md'
                            : 'bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10 text-primary-dark dark:text-dark-text hover:bg-secondary-green/10'
                        }`}
                    >
                      {commentsPagination.totalPages}
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={commentsPagination.goToNextPage}
                      disabled={commentsPagination.currentPage === commentsPagination.totalPages}
                      className='px-3 py-2 rounded-lg bg-white dark:bg-dark-card border border-primary-dark/10 dark:border-dark-text/10
                     hover:bg-secondary-green/10 dark:hover:bg-secondary-green/10
                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>→</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className='text-primary-dark/70 dark:text-dark-text/70 text-center py-8'>
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Movie
