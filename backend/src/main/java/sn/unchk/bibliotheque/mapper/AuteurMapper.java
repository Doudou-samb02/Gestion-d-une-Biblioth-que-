package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.entity.Auteur;

public class AuteurMapper {

    public static AuteurDTO toDTO(Auteur a) {
        if (a == null) return null;
        Long creeParId = a.getCreePar() != null ? a.getCreePar().getId() : null;
        int booksCount = a.getLivres() != null ? a.getLivres().size() : 0;
        return new AuteurDTO(
                a.getId(),
                a.getNomComplet(),
                a.getNationalite(),
                a.getBiographie(),
                a.getDateNaissance(),
                a.getDateDeces(),
                creeParId,
                booksCount
        );
    }
}
