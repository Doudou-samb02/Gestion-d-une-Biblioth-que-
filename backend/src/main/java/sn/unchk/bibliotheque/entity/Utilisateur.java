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
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomComplet; // ✅ Nom complet

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private LocalDate dateNaissance; // ✅ Date de naissance

    @Enumerated(EnumType.STRING)
    private Role role = Role.LECTEUR; // ✅ Profil (LECTEUR par défaut)

    private boolean actif = true; // ✅ Statut (true = actif, false = inactif)

    private LocalDate dateInscription = LocalDate.now(); // ✅ Date d'inscription auto

    // Relations
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emprunt> emprunts;
}
