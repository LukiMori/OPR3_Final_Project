export interface TmdbMovie {
    id: number;
    title: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string | null;
    voteAverage: number;
    voteCount: number;
}

export interface TmdbPerson {
    id: number;
    name: string;
    profilePath: string | null;
    knownForDepartment: string;
    popularity: number;
}

export interface TmdbSearchResults<T> {
    results: T[];
    totalResults: number;
}