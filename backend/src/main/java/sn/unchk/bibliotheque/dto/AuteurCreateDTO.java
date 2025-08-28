package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;

public record AuteurCreateDTO(String nom, String biographie, LocalDate dateNaissance, Long creeParId) {
}