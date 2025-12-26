package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class TmdbService {

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
            JsonNode root = objectMapper.readTree(response);

            List<TmdbMovieSearchDTO> movies = new ArrayList<>();
            JsonNode results = root.get("results");

            if (results != null && results.isArray()) {
                for (JsonNode movieNode : results) {
                    movies.add(new TmdbMovieSearchDTO(
                            movieNode.get("id").asLong(),
                            movieNode.has("title") ? movieNode.get("title").asText() : "",

                            movieNode.has("release_date") ? movieNode.get("release_date").asText() : null,
                            movieNode.has("poster_path") && !movieNode.get("poster_path").isNull()
                                    ? movieNode.get("poster_path").asText() : null
                    ));
                }
            }

            int totalResults = root.has("total_results") ? root.get("total_results").asInt() : 0;
            return new TmdbSearchResultsDTO<>(movies, totalResults);

        } catch (Exception e) {
            e.printStackTrace();
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

        String directorActorUrl = UriComponentsBuilder.fromHttpUrl(baseUrl + "/movie/" + movieId + "/credits")
                .queryParam("api_key", apiKey)
                .queryParam("language", "en-US")
                .toUriString();

        try {
            String movieResponse = restTemplate.getForObject(movieUrl, String.class);
            JsonNode movieRoot = objectMapper.readTree(movieResponse);

            String directorActorResponse = restTemplate.getForObject(directorActorUrl, String.class);
            JsonNode directorActorRoot = objectMapper.readTree(directorActorResponse);

            List<TmdbMovieDetailsDirectorDTO> directors = new ArrayList<>();
            List<TmdbMovieDetailsActorDTO> actors = new ArrayList<>();

            if (directorActorRoot != null) {
                JsonNode crewNode = directorActorRoot.get("crew");
                if (crewNode != null && crewNode.isArray()) {
                    for (JsonNode crewMember : crewNode) {
                        if (crewMember.has("job") && "Director".equals(crewMember.get("job").asText())) {
                            directors.add(new TmdbMovieDetailsDirectorDTO(
                                    crewMember.get("id").asLong(),
                                    crewMember.has("name") ? crewMember.get("name").asText() : ""
                            ));
                        }
                    }
                }

                JsonNode castNode = directorActorRoot.get("cast");
                if (castNode != null && castNode.isArray()) {
                    for (JsonNode castMember : castNode) {
                        actors.add(new TmdbMovieDetailsActorDTO(
                                castMember.get("id").asLong(),
                                castMember.has("name") ? castMember.get("name").asText() : "",
                                castMember.has("character") ? castMember.get("character").asText() : ""
                        ));
                    }
                }
            }

            if (movieRoot != null) {
                List<String> genres = new ArrayList<>();
                if (movieRoot.has("genres") && movieRoot.get("genres").isArray()) {
                    for (JsonNode genreNode : movieRoot.get("genres")) {
                        genres.add(genreNode.get("name").asText());
                    }
                }
                return new TmdbMovieDetailsDTO(
                        movieRoot.get("id").asLong(),
                        movieRoot.has("title") ? movieRoot.get("title").asText() : "",
                        movieRoot.has("release_date") ? movieRoot.get("release_date").asText() : null,
                        movieRoot.has("overview") ? movieRoot.get("overview").asText() : "",
                        genres,
                        null,
                        movieRoot.has("poster_path") && !movieRoot.get("poster_path").isNull()
                                ? movieRoot.get("poster_path").asText() : null
                );
            } else {
                return null;
            }


        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}