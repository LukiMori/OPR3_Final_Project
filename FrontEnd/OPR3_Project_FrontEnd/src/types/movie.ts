export interface TmdbMovie {
  id: number;
  title: string;
  releaseDate: string | null;
  description: string;
  directors: TmdbMovieDetailsDirectors[];
  actors: TmdbMovieDetailsActors[];
  genres: string[];
  voteTotal: number;
  voteCount: number;
  rating: number;
  posterUrl: string | null;
}

export interface TmdbMovieDetailsActors {
  id: number;
  name: string;
}

export interface TmdbMovieDetailsDirectors {
  id: number;
  name: string;
  character: string;
}

export interface MovieSummary {
  id: number;
  title: string;
  releaseYear: number;
  posterUrl: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  movieTitle: string;
  movieId: number;
}
