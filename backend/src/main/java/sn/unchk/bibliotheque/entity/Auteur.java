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

    private String nomComplet; // ✅ Nom complet de l’auteur

    private String nationalite; // ✅ Nationalité

    @Column(length = 2000)
    private String biographie;

    private LocalDate dateNaissance;

    private LocalDate dateDeces; // ✅ Optionnelle (nullable si pas de décès)

    // Relations
    @ManyToOne
    @JoinColumn(name = "cree_par")
    private Utilisateur creePar;

    @OneToMany(mappedBy = "auteur", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Livre> livres;
}
