import type { Comment, MovieSummary } from './movie.ts'

export interface Types {
  id: number
  username: string
}

export interface AuthResponse {
  id: number
  username: string
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  username: string
  password: string
}

export interface UserProfile {
  id: number
  username: string
  totalFavorites: number
  totalComments: number
  favoriteMovies: MovieSummary[]
  comments: Comment[]
}
