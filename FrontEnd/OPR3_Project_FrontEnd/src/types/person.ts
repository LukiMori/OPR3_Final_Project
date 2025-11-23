export interface TmdbPerson {
  id: number;
  name: string;
  profilePath: string | null;
  knownForDepartment: string;
  popularity: number;
}

export interface PersonSummary {
  id: number;
  name: string;
  profilePath: string;
}
