package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record AuteurCreateDTO(
        String nomComplet,
        String nationalite,
        String biographie,
        LocalDate dateNaissance,
        LocalDate dateDeces,
        Long creeParId
) {}