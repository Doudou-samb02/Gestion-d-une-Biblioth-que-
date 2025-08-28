package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.entity.Auteur;

import java.util.List;
import java.util.stream.Collectors;

public class AuteurMapper {
    public static AuteurDTO toDTO(Auteur a) {
        if (a == null) return null;
        Long creePar = a.getCreePar() != null ? a.getCreePar().getId() : null;
        return new AuteurDTO(a.getId(), a.getNom(), a.getBiographie(), a.getDateNaissance(), creePar, a.getLivres() != null
                ? a.getLivres().stream().map(LivreMapper::toDTO).collect(Collectors.toList())
                : List.of());
    }
}
