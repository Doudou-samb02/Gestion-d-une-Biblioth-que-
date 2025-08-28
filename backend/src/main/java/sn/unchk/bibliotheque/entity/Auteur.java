package sn.unchk.bibliotheque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "auteurs")
public class Auteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    @Column(length = 2000)
    private String biographie;
    private LocalDate dateNaissance;
    @ManyToOne
    @JoinColumn(name = "cree_par")
    private Utilisateur creePar;
    @OneToMany(mappedBy = "auteur")
   private List<Livre> livres;
}
