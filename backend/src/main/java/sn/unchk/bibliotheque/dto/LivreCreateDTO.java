package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record LivreCreateDTO(String titre, String isbn, LocalDate datePublication, String cover,  Long auteurId, Long categorieId) {
}