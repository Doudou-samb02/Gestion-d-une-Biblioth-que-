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
@Table(name = "livres")
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(unique = true, nullable = false)
    private String isbn;

    private String langue; // Langue du livre

    private LocalDate datePublication;

    private int nbPages; // Nombre de pages

    private int nbExemplaires; // Nombre total d’exemplaires

    @Column(columnDefinition = "TEXT")
    private String description; // Résumé / synopsis

    @Column(length = 200000)
    private String cover; // Image de couverture (URL ou chemin)

    // ✅ Pas stocké en DB, calculé automatiquement
    @Transient
    public boolean isDisponible() {
        return nbExemplaires > 0;
    }

    // Relations
    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private Auteur auteur;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @OneToMany(mappedBy = "livre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprunt> emprunts;

    @Transient
    public int getNbEmprunts() {
        return emprunts != null ? emprunts.size() : 0;
    }

}
