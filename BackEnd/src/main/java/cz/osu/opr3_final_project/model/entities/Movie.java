package cz.osu.opr3_final_project.model.entities;

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
@Table(name = "movies")
public class Movie {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column
    private String title;

    @Column
    private String releaseDate;

    @Column
    private String description;

    @ManyToMany
    @JoinTable(
            name = "movies_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres;

    @ManyToMany
    @JoinTable(
            name = "movies_directors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private List<Person> directors;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<MovieActor> movieActors;

    @Column(nullable = false)
    private Long voteTotal = 0L;

    @Column(nullable = false)
    private Integer voteCount = 0;

    @Column
    private double rating;

    @Column
    private String posterUrl;

    public void addVote(int voteValue) {
        this.voteTotal += voteValue;
        this.voteCount++;
        this.rating = voteCount > 0 ? (double) voteTotal / voteCount : 0.0;
    }

    public void recalculateRating() {
        this.rating = voteCount > 0 ? (double) voteTotal / voteCount : 0.0;
    }

}
