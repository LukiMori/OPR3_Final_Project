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
@Table(name = "persons")
public class Person {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @Column
    private String name;

    @Column
    private String birthDate;

    @Column(columnDefinition = "TEXT")
    private String biography;
}
