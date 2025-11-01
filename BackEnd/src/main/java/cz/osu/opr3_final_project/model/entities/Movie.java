package cz.osu.opr3_final_project.model.entities;

import cz.osu.opr3_final_project.Enumerations.MovieGenre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Movie {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column
    private String title;

    @Column
    private int releaseYear;

    @Column
    @ManyToMany
    @JoinTable(
            name = "movies_directors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> director;

    @Column
    @ManyToMany
    @JoinTable(
            name = "movies_actors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> actors;

    @Enumerated(EnumType.STRING)
    @Column
    private MovieGenre genre;

    @Column
    private double rating;

    @Column
    private String description;

    @Column
    private String posterUrl;
}
