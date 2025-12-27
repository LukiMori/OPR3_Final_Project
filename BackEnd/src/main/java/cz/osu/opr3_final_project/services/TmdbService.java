package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class TmdbService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbService.class);

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public TmdbService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public TmdbSearchResultsDTO<TmdbMovieSearchDTO> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new TmdbSearchResultsDTO<>(List.of(), 0);
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("language", "en-US")
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);

            if (response == null) {
                logger.error("TMDB search returned null response");
                return new TmdbSearchResultsDTO<>(List.of(), 0);
            }

            JsonNode root = objectMapper.readTree(response);

            List<TmdbMovieSearchDTO> movies = new ArrayList<>();
            JsonNode results = root.get("results");

            if (results != null && results.isArray()) {
                for (JsonNode movieNode : results) {
                    if (movieNode.has("id") && !movieNode.get("id").isNull()) {
                        movies.add(new TmdbMovieSearchDTO(
                                movieNode.get("id").asLong(),
                                movieNode.has("title") ? movieNode.get("title").asText() : "",
                                movieNode.has("release_date") ? movieNode.get("release_date").asText() : null,
                                movieNode.has("poster_path") && !movieNode.get("poster_path").isNull()
                                        ? movieNode.get("poster_path").asText() : null
                        ));
                    }
                }
            }

            int totalResults = root.has("total_results") ? root.get("total_results").asInt() : 0;
            return new TmdbSearchResultsDTO<>(movies, totalResults);

        } catch (Exception e) {
            logger.error("Error searching movies: {}", e.getMessage(), e);
            return new TmdbSearchResultsDTO<>(List.of(), 0);
        }
    }

    public TmdbMovieDetailsDTO getMovieDetails(Long movieId) {
        if (movieId == null) {
            return null;
        }

        String movieUrl = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + movieId)
                .queryParam("api_key", apiKey)
                .queryParam("language", "en-US")
                .toUriString();

        try {
            String movieResponse = restTemplate.getForObject(movieUrl, String.class);

            if (movieResponse == null) {
                logger.error("TMDB movie details returned null response for movieId: {}", movieId);
                return null;
            }

            JsonNode movieRoot = objectMapper.readTree(movieResponse);

            if (movieRoot != null && movieRoot.has("id")) {
                List<String> genres = new ArrayList<>();
                if (movieRoot.has("genres") && movieRoot.get("genres").isArray()) {
                    for (JsonNode genreNode : movieRoot.get("genres")) {
                        if (genreNode.has("name")) {
                            genres.add(genreNode.get("name").asText());
                        }
                    }
                }

                return new TmdbMovieDetailsDTO(
                        movieRoot.get("id").asLong(),
                        movieRoot.has("title") ? movieRoot.get("title").asText() : "",
                        movieRoot.has("release_date") ? movieRoot.get("release_date").asText() : null,
                        movieRoot.has("overview") ? movieRoot.get("overview").asText() : "",
                        genres,
                        null,  // comments
                        movieRoot.has("poster_path") && !movieRoot.get("poster_path").isNull()
                                ? movieRoot.get("poster_path").asText() : null
                );
            }

            return null;

        } catch (Exception e) {
            logger.error("Error getting movie details for movieId {}: {}", movieId, e.getMessage(), e);
            return null;
        }
    }
}