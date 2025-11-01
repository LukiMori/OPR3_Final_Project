package cz.osu.opr3_final_project.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
public class Person {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column
    private String name;

    @Column
    private String birthDate;

    @Column
    private String biography;

    @Column
    private int rating;

    @Column
    @ManyToMany(mappedBy = "director")
    private List<Movie> directedMovies;

    @Column
    @ManyToMany(mappedBy = "actors")
    private List<Movie> actedMovies;


}
