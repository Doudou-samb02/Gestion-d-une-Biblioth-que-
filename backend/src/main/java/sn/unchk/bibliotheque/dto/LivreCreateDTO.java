package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record LivreCreateDTO(
        String titre,
        String isbn,
        String langue,        // ✅ Langue du livre
        LocalDate datePublication,
        int nbPages,          // ✅ Nombre de pages
        int nbExemplaires,    // ✅ Nombre d'exemplaires disponibles
        String description,   // ✅ Résumé du livre
        String cover,         // ✅ Image de couverture
        Long auteurId,
        Long categorieId,
        int empruntsCount
) {}
