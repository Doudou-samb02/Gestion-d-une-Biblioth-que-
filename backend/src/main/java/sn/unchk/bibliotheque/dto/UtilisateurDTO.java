package sn.unchk.bibliotheque.dto;

import sn.unchk.bibliotheque.entity.Role;
import java.time.LocalDate;

public record UtilisateurDTO(
        Long id,
        String nomComplet,
        String email,
        LocalDate dateNaissance,
        Role role,              // Profil : ADMIN ou LECTEUR
        boolean actif,          // Statut
        LocalDate dateInscription
) {}
