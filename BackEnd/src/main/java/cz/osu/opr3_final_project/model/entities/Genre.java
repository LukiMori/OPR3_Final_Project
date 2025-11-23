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
@Table(name = "genres")
public class Genre {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private String name;


    @ManyToMany(mappedBy = "genres")
    private List<Movie> genreMovies;
}