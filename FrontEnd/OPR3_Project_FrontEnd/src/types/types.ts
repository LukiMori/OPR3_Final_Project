export interface Types {
  id: number;
  username: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface MovieSummary {
  id: number;
  title: string;
  releaseYear: number;
  posterPath: string;
}

export interface PersonSummary {
  id: number;
  name: string;
  profilePath: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  movieTitle: string;
  movieId: number;
}

export interface UserProfile {
  id: number;
  username: string;
  totalFavorites: number;
  totalComments: number;
  favoriteMovies: MovieSummary[];
  recentComments: Comment[];
}
