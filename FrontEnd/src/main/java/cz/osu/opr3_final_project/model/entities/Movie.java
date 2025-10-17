package cz.osu.opr3_final_project.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Movie {
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column
    private String title;

    @Column
    private String director;

    @Column
    private int releaseYear;
}
