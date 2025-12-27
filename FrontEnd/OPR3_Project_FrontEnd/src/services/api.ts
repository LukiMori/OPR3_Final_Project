import type { AuthResponse, LoginRequest, SignupRequest, UserProfile } from '../types/types.ts'
import type { TmdbSearchResults } from '../types/tmdb'
import type { MovieSummary, TmdbMovie, Comment } from '../types/movie.ts'

const API_BASE_URL = 'http://localhost:8080'
const REQUEST_TIMEOUT = 10000

const getToken = (): string | null => {
  return localStorage.getItem('token')
}

const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = REQUEST_TIMEOUT): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

export const api = {
  signup: async (signupRequest: SignupRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signupRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Signup failed')
    }

    return response.json()
  },

  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Login failed')
    }

    return response.json()
  },

  verifyToken: async (): Promise<AuthResponse> => {
    const token = getToken()
    if (!token) {
      throw new Error('No token found')
    }

    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Token verification failed')
    }

    return response.json()
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to fetch profile')
    }

    return response.json()
  },

  updateUsername: async (newUsername: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/profile/username`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newUsername })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to update username')
    }

    return response.json()
  },

  searchMovies: async (query: string): Promise<TmdbSearchResults<MovieSummary>> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/search/movies?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to search movies')
    }

    return response.json()
  },

  getTmdbImageUrl: (path: string | null, size: 'w92' | 'w185' | 'w500' | 'original' = 'w185'): string | null => {
    if (!path) return null
    return `https://image.tmdb.org/t/p/${size}${path}`
  },

  getMovieDetails: async (movieId: number): Promise<TmdbMovie> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/movie/${movieId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to fetch movie details')
    }

    return response.json()
  },

  isMovieLikedByUser: async (movieId: number, userId: number): Promise<boolean> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/movie/${movieId}/isLiked?userId=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to check if movie is liked')
    }

    return response.json()
  },

  changeMovieLikedByUserId: async (movieId: number, userId: number, newMovieLikedStatus: boolean): Promise<void> => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/movie/${movieId}/changeLikedStatus?userId=${userId}&currentMovieLikedStatus=${newMovieLikedStatus}`,
      {
        method: 'PUT',
        headers: getAuthHeaders()
      }
    )
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to change liked status')
    }
  },

  addCommentToMovieByUser: async (movieId: number, userId: number, commentContent: string): Promise<Comment> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/comment/${movieId}/comments`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId: userId,
        content: commentContent
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to add comment:', errorText)
      throw new Error(errorText || 'Failed to add comment')
    }

    return response.json()
  },

  deleteCommentFromMovie: async (commentId: number, userId: number): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/comment/${commentId}/deleteComment`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(userId)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to remove comment:', errorText)
      throw new Error(errorText || 'Failed to remove comment')
    }
  }
}
