import type { AuthResponse, LoginRequest, SignupRequest, UserProfile } from '../types/types.ts'
import type { TmdbSearchResults } from '../types/tmdb'
import type { MovieSummary, TmdbMovie, Comment } from '../types/movie.ts'

const API_BASE_URL = 'http://localhost:8080'

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
      if (response.status === 409) {
        throw new Error('Username already exists')
      }
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
      if (response.status === 401) {
        throw new Error('Invalid username or password')
      }
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
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error('Failed to fetch profile')
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
      if (response.status === 409) {
        throw new Error('Username already exists')
      }
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error('Failed to update username')
    }

    return response.json()
  },

  searchMovies: async (query: string): Promise<TmdbSearchResults<MovieSummary>> => {
    const response = await fetch(`${API_BASE_URL}/api/search/movies?query=${encodeURIComponent(query)}`, {
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
    const response = await fetch(`${API_BASE_URL}/api/movie/${movieId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch movie details')
    }
    return response.json()
  },

  isMovieLikedByUser: async (movieId: number, userId: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/api/movie/${movieId}/isLiked?userId=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to check if movie is liked')
    }
    return response.json()
  },

  changeMovieLikedByUserId: async (movieId: number, userId: number, newMovieLikedStatus: boolean): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/movie/${movieId}/changeLikedStatus?userId=${userId}&currentMovieLikedStatus=${newMovieLikedStatus}`,
      {
        method: 'PUT',
        headers: getAuthHeaders()
      }
    )
    if (!response.ok) {
      throw new Error('Failed to change likedStatus')
    }
    return response.json()
  },

  addCommentToMovieByUser: async (movieId: number, userId: number, commentContent: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/api/comment/${movieId}/comments`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId: userId,
        content: commentContent
      })
    })
    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to add comment')
    }
    return response.json()
  },

  deleteCommentFromMovie: async (commentId: number, userId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/comment/${commentId}/deleteComment`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(userId)
    })
    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to remove comment')
    }
    return response.json()
  }
}
