package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.UtilisateurDTO;
import sn.unchk.bibliotheque.entity.Utilisateur;

public class UtilisateurMapper {

    public static UtilisateurDTO toDTO(Utilisateur u) {
        if (u == null) return null;
        return new UtilisateurDTO(
                u.getId(),
                u.getNomComplet(),          // nomComplet dans le DTO
                u.getEmail(),
                u.getDateNaissance(),
                u.getRole(),
                u.isActif(),
                u.getDateInscription()
        );
    }
}
