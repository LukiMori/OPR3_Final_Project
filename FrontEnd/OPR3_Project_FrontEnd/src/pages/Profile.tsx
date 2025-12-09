import { useState, useEffect } from 'react'
import { User, Film, MessageSquare, Edit2, Check, X, Trash2 } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { UserProfile } from '../types/types.ts'

import moviePlaceholderImage from '../assets/placeholder-movie.png'
import { useNavigate } from 'react-router-dom'
import { useUsernameEdit } from '../hooks/useUsernameEdit.ts'
import { usePagination } from '../hooks/usePagination.ts'

const Profile = () => {
  const { login, user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const usernameEdit = useUsernameEdit(profile, (authResponse, newUsername) => {
    login(authResponse)
    setProfile((prev) => (prev ? { ...prev, username: newUsername } : null))
  })

  const moviesPagination = usePagination(profile?.favoriteMovies || [], 5)

  const commentsPagination = usePagination(profile?.comments || [], 5)

  useEffect(() => {
    void fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await api.getUserProfile()
      setProfile(data)
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movie: string) => {
    navigate(`/movie/${movie}`)
  }

  const handleDeleteMovieClick = async (movieId: string) => {
    if (!movieId || !user) return

    try {
      await api.changeMovieLikedByUserId(parseInt(movieId), user.id, false)

      setProfile((prev) => {
        if (!prev) return prev

        const updatedFavorites = prev.favoriteMovies.filter((movie) => movie.id !== parseInt(movieId))

        return {
          ...prev,
          favoriteMovies: updatedFavorites,
          totalFavorites: updatedFavorites.length
        }
      })

      moviesPagination.resetToValidPage(profile!.favoriteMovies.length - 1)
    } catch (err) {
      console.error('Failed to delete movie:', err)
    }
  }

  const handleDeleteCommentClick = async (commentId: number) => {
    if (!commentId || !user) return

    try {
      await api.deleteCommentFromMovie(commentId, user.id)

      setProfile((prev) => {
        if (!prev) return prev

        const updatedComments = prev.comments.filter((comment) => comment.id !== commentId)

        return {
          ...prev,
          comments: updatedComments,
          totalComments: updatedComments.length
        }
      })

      commentsPagination.resetToValidPage(profile!.comments.length - 1)
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center'>
        <div className='text-primary-dark dark:text-dark-text text-xl'>Loading profile...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className='min-h-screen bg-light dark:bg-dark-bg flex items-center justify-center'>
        <div className='text-red-600 dark:text-red-400 text-xl'>{error || 'Profile not found'}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-light dark:bg-dark-bg py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Profile Header Card */}
        <div className='bg-white dark:bg-dark-card rounded-xl shadow-md p-8 mb-6'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-6'>
              <div className='bg-accent-orange p-4 rounded-full'>
                <User size={48} className='text-light' />
              </div>

              <div>
                <div className='flex items-center gap-3 mb-2'>
                  {usernameEdit.isEditing ? (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={usernameEdit.newUsername}
                        onChange={(e) => usernameEdit.setNewUsername(e.target.value)}
                        className='px-3 py-2 border-2 border-secondary-green rounded-lg
                                 bg-white dark:bg-dark-bg
                                 text-primary-dark dark:text-dark-text
                                 focus:border-accent-orange focus:outline-none'
                        minLength={3}
                        disabled={usernameEdit.isUpdating}
                      />
                      <button
                        onClick={usernameEdit.saveUsername}
                        disabled={usernameEdit.isUpdating}
                        className='p-2 bg-secondary-green hover:bg-secondary-green/80
                                 rounded-lg transition-colors disabled:opacity-50'
                        title='Save'
                      >
                        <Check size={20} className='text-primary-dark' />
                      </button>
                      <button
                        onClick={usernameEdit.cancelEdit}
                        disabled={usernameEdit.isUpdating}
                        className='p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20
                                 dark:hover:bg-red-900/30 rounded-lg transition-colors'
                        title='Cancel'
                      >
                        <X size={20} className='text-red-600 dark:text-red-400' />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className='text-4xl font-bold text-primary-dark dark:text-dark-text'>{profile.username}</h1>
                      <button
                        onClick={usernameEdit.startEdit}
                        className='p-2 hover:bg-light dark:hover:bg-dark-bg rounded-lg transition-colors'
                        title='Edit username'
                      >
                        <Edit2 size={20} className='text-accent-orange' />
                      </button>
                    </>
                  )}
                </div>

                {usernameEdit.error && (
                  <p className='text-red-600 dark:text-red-400 text-sm mb-2'>{usernameEdit.error}</p>
                )}

                <div className='flex gap-6 text-primary-dark/70 dark:text-dark-text/70'>
                  <div className='flex items-center gap-2'>
                    <Film size={18} />
                    <span>{profile.totalFavorites} Favorites</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MessageSquare size={18} />
                    <span>{profile.totalComments} Comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Favorite Movies */}
          <div className='bg-white dark:bg-dark-card rounded-xl shadow-md p-6'>
            <h2 className='text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2'>
              <Film size={24} className='text-accent-orange' />
              Favorite Movies
            </h2>
            {profile.favoriteMovies.length === 0 ? (
              <p className='text-primary-dark/70 dark:text-dark-text/70 text-center py-8'>
                No favorite movies yet. Start adding some!
              </p>
            ) : (
              <>
                {/* ✅ Movie List - NO Material-UI components */}
                <div className='space-y-4'>
                  {moviesPagination.currentItems.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id.toString())}
                      className='flex items-center gap-4 p-2 rounded-lg bg-light dark:bg-dark-bg
                               hover:shadow-md transition-shadow cursor-pointer'
                    >
                      <img
                        src={api.getTmdbImageUrl(movie.posterUrl, 'w92') || moviePlaceholderImage}
                        alt={movie.title}
                        className='w-12 h-16 object-cover rounded'
                      />
                      <div className='flex-1'>
                        <h3 className='font-semibold text-xl pb-1 text-primary-dark dark:text-dark-text'>
                          {movie.title}
                        </h3>
                        <p className='text-sm text-primary-dark/70 dark:text-dark-text/70'>{movie.releaseYear}</p>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          await handleDeleteMovieClick(movie.id.toString())
                        }}
                        className='p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                        title='Remove from favorites'
                      >
                        <Trash2 size={18} className='text-red-600 dark:text-red-400' />
                      </button>
                    </div>
                  ))}
                </div>

                {/* ✅ Pagination Controls */}
                {moviesPagination.totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 mt-6'>
                    {/* Previous Button */}
                    <button
                      onClick={moviesPagination.goToPreviousPage}
                      disabled={moviesPagination.currentPage === 1}
                      className='px-3 py-2 rounded-lg bg-light dark:bg-dark-bg
                               hover:bg-secondary-green/20 dark:hover:bg-secondary-green/20
                               transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>←</span>
                    </button>

                    {/* Page Numbers */}

                    <button
                      key={1}
                      onClick={() => moviesPagination.goToPage(1)}
                      className={`px-4 py-2 rounded-lg transition-colors
                                  ${
                                    moviesPagination.currentPage === 1
                                      ? 'bg-accent-orange text-light'
                                      : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
                                  }`}
                    >
                      {1}
                    </button>

                    {moviesPagination.currentPage > 3 ? (
                      <button
                        className={`px-4 py-2 rounded-lg transition-colors bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20`}
                        disabled={true}
                      >
                        ...
                      </button>
                    ) : null}

                    {(() => {
                      const current = moviesPagination.currentPage
                      const total = moviesPagination.totalPages

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
                        onClick={() => moviesPagination.goToPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-colors
              ${
                moviesPagination.currentPage === pageNumber
                  ? 'bg-accent-orange text-light'
                  : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
              }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {moviesPagination.currentPage < moviesPagination.totalPages - 2 ? (
                      <button
                        className={`px-4 py-2 rounded-lg transition-colors bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20`}
                        disabled={true}
                      >
                        ...
                      </button>
                    ) : null}

                    <button
                      key={moviesPagination.totalPages}
                      onClick={() => moviesPagination.goToPage(moviesPagination.totalPages)}
                      className={`px-4 py-2 rounded-lg transition-colors
                                  ${
                                    moviesPagination.currentPage === moviesPagination.totalPages
                                      ? 'bg-accent-orange text-light'
                                      : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
                                  }`}
                    >
                      {moviesPagination.totalPages}
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={moviesPagination.goToNextPage}
                      disabled={moviesPagination.currentPage === moviesPagination.totalPages}
                      className='px-3 py-2 rounded-lg bg-light dark:bg-dark-bg
                               hover:bg-secondary-green/20 dark:hover:bg-secondary-green/20
                               transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>→</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recent Comments */}
          <div className='bg-white dark:bg-dark-card rounded-xl shadow-md p-6'>
            <h2 className='text-2xl font-bold text-primary-dark dark:text-dark-text mb-4 flex items-center gap-2'>
              <MessageSquare size={24} className='text-accent-orange' />
              Recent Comments
            </h2>
            {profile.comments.length === 0 ? (
              <p className='text-primary-dark/70 dark:text-dark-text/70 text-center py-8'>
                No comments yet. Share your thoughts on movies!
              </p>
            ) : (
              <>
                <div className='space-y-4'>
                  {commentsPagination.currentItems.map((comment) => (
                    <div
                      key={comment.id}
                      className='p-4 rounded-lg bg-light dark:bg-dark-bg
                             hover:shadow-md transition-shadow'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <h3 className='font-semibold text-primary-dark dark:text-dark-text'>{comment.movieTitle}</h3>
                        <span className='text-xs text-primary-dark/70 dark:text-dark-text/70'>
                          {new Date(comment.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </span>
                      </div>
                      <p className='text-primary-dark/80 dark:text-dark-text/80'>{comment.content}</p>
                      <div className='flex gap-2 mt-3'>
                        {/*<button className='text-sm text-accent-orange hover:text-accent-orange/80 transition-colors'>*/}
                        {/*  Edit*/}
                        {/*</button>*/}
                        <button
                          className='text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors'
                          onClick={() => handleDeleteCommentClick(comment.id)}
                        >
                          Delete
                        </button>
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
                      className='px-3 py-2 rounded-lg bg-light dark:bg-dark-bg
                               hover:bg-secondary-green/20 dark:hover:bg-secondary-green/20
                               transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>←</span>
                    </button>

                    {/* Page Numbers */}

                    <button
                      key={1}
                      onClick={() => commentsPagination.goToPage(1)}
                      className={`px-4 py-2 rounded-lg transition-colors
                                  ${
                                    commentsPagination.currentPage === 1
                                      ? 'bg-accent-orange text-light'
                                      : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
                                  }`}
                    >
                      {1}
                    </button>

                    {commentsPagination.currentPage > 3 ? (
                      <button
                        className={`px-4 py-2 rounded-lg transition-colors bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20`}
                        disabled={true}
                      >
                        ...
                      </button>
                    ) : null}

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
                        className={`px-4 py-2 rounded-lg transition-colors
              ${
                commentsPagination.currentPage === pageNumber
                  ? 'bg-accent-orange text-light'
                  : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
              }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    {commentsPagination.currentPage < commentsPagination.totalPages - 2 ? (
                      <button
                        className={`px-4 py-2 rounded-lg transition-colors bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20`}
                        disabled={true}
                      >
                        ...
                      </button>
                    ) : null}

                    <button
                      key={commentsPagination.totalPages}
                      onClick={() => commentsPagination.goToPage(commentsPagination.totalPages)}
                      className={`px-4 py-2 rounded-lg transition-colors
                                  ${
                                    commentsPagination.currentPage === commentsPagination.totalPages
                                      ? 'bg-accent-orange text-light'
                                      : 'bg-light dark:bg-dark-bg text-primary-dark dark:text-dark-text hover:bg-secondary-green/20'
                                  }`}
                    >
                      {commentsPagination.totalPages}
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={commentsPagination.goToNextPage}
                      disabled={commentsPagination.currentPage === commentsPagination.totalPages}
                      className='px-3 py-2 rounded-lg bg-light dark:bg-dark-bg
                               hover:bg-secondary-green/20 dark:hover:bg-secondary-green/20
                               transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                      <span className='text-primary-dark dark:text-dark-text'>→</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
