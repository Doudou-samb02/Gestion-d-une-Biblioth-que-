package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record AuteurDTO(
        Long id,
        String nomComplet,
        String nationalite,
        String biographie,
        LocalDate dateNaissance,
        LocalDate dateDeces,
        Long creeParId,
        int booksCount
) {}