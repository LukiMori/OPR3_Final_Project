export interface TmdbMovie {
  id: number
  title: string
  releaseDate: string | null
  description: string
  directors: TmdbMovieDetailsDirectors[]
  actors: TmdbMovieDetailsActors[]
  genres: string[]
  voteTotal: number
  voteCount: number
  rating: number
  posterUrl: string | null
  comments: Comment[]
}

export interface TmdbMovieDetailsActors {
  id: number
  name: string
}

export interface TmdbMovieDetailsDirectors {
  id: number
  name: string
  character: string
}

export interface MovieSummary {
  id: number
  title: string
  releaseYear: number
  posterUrl: string
}

export interface Comment {
  id: number
  username: string
  content: string
  timestamp: string
  movieTitle: string
  movieId: number
}
