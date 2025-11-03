package cz.osu.opr3_final_project.dtos.tmdb;

import java.util.List;

public record TmdbSearchResultsDTO<T>(
        List<T> results,
        int totalResults
) {}