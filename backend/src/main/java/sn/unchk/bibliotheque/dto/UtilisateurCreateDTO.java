package sn.unchk.bibliotheque.dto;

import sn.unchk.bibliotheque.entity.Role;
import java.time.LocalDate;

public record UtilisateurCreateDTO(
        String nomComplet,
        String email,
        String password,
        LocalDate dateNaissance,
        Role role,          // ADMIN ou LECTEUR (par défaut LECTEUR côté service si null)
        boolean actif       // Statut (true = actif, false = inactif)
) {}
