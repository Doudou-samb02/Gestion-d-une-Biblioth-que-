package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record LivreDTO(Long id, String titre, String isbn, LocalDate datePublication, String cover, Long auteurId, String auteurNom,
                       Long categorieId, String categorieNom, boolean disponible) {
}