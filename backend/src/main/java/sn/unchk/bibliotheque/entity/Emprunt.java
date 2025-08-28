package sn.unchk.bibliotheque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "emprunts")
public class Emprunt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDemande;       // 🔹 ajout pour tracer la demande
    private LocalDate dateEmprunt;       // quand l’admin valide
    private LocalDate dateLimiteRetour;  // date prévue de retour
    private LocalDate dateRetour;        // quand le livre est rendu
    private boolean rendu;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "livre_id")
    private Livre livre;

    @Enumerated(EnumType.STRING)
    private StatutEmprunt statut = StatutEmprunt.EN_ATTENTE; // valeur par défaut
}
