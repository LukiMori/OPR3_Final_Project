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
  posterPath: string | null;
}

export interface TmdbPerson {
  id: number;
  name: string;
  profilePath: string | null;
  knownForDepartment: string;
  popularity: number;
}

export interface TmdbMovieDetailsDirectors {
  id: number;
  name: string;
  character: string;
}

export interface TmdbMovieDetailsActors {
  id: number;
  name: string;
}

export interface TmdbSearchResults<T> {
  results: T[];
  totalResults: number;
}
