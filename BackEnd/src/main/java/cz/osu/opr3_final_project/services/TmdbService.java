package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieSearchDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbPersonSearchDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbSearchResultsDTO;
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


    public TmdbSearchResultsDTO<TmdbMovieSearchDTO> searchMovies(String query, int page) {
        if (query == null || query.trim().isEmpty()) {
            return new TmdbSearchResultsDTO<>(List.of(), 0);
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("page", page)
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
                            movieNode.has("overview") ? movieNode.get("overview").asText() : "",
                            movieNode.has("poster_path") && !movieNode.get("poster_path").isNull()
                                    ? movieNode.get("poster_path").asText() : null,
                            movieNode.has("backdrop_path") && !movieNode.get("backdrop_path").isNull()
                                    ? movieNode.get("backdrop_path").asText() : null,
                            movieNode.has("release_date") ? movieNode.get("release_date").asText() : null
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


    public TmdbSearchResultsDTO<TmdbPersonSearchDTO> searchPeople(String query, int page) {
        if (query == null || query.trim().isEmpty()) {
            return new TmdbSearchResultsDTO<>(List.of(), 0);
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/person")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("page", page)
                .queryParam("language", "en-US")
                .toUriString();

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            List<TmdbPersonSearchDTO> people = new ArrayList<>();
            JsonNode results = root.get("results");

            if (results != null && results.isArray()) {
                for (JsonNode personNode : results) {
                    people.add(new TmdbPersonSearchDTO(
                            personNode.get("id").asLong(),
                            personNode.has("name") ? personNode.get("name").asText() : "",
                            personNode.has("profile_path") && !personNode.get("profile_path").isNull()
                                    ? personNode.get("profile_path").asText() : null,
                            personNode.has("known_for_department")
                                    ? personNode.get("known_for_department").asText() : ""
                    ));
                }
            }

            int totalResults = root.has("total_results") ? root.get("total_results").asInt() : 0;
            return new TmdbSearchResultsDTO<>(people, totalResults);

        } catch (Exception e) {
            e.printStackTrace();
            return new TmdbSearchResultsDTO<>(List.of(), 0);
        }
    }


    public String getImageUrl(String path, String size) {
        if (path == null) return null;
        return "https://image.tmdb.org/t/p/" + size + path;
    }
}