package sn.unchk.bibliotheque.dto;

import java.time.LocalDate;
import java.util.List;

public record AuteurDTO(Long id, String nom, String biographie, LocalDate dateNaissance, Long creeParId, List<LivreDTO> livres) {
}