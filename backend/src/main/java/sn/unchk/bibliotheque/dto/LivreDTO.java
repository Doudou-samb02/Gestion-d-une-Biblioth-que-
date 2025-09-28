package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record LivreDTO(
        Long id,
        String titre,
        String isbn,
        String langue,
        LocalDate datePublication,
        int nbPages,
        int nbExemplaires,
        String description,
        String cover,
        boolean disponible,
        Long auteurId,
        String auteurNom,
        Long categorieId,
        String categorieNom,
        String statut,
        int nbEmprunts
) {}
