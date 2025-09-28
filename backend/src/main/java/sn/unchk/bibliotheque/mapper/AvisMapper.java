package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.AvisDTO;
import sn.unchk.bibliotheque.entity.Avis;

public class AvisMapper {

    public static AvisDTO toDTO(Avis avis) {
        if (avis == null) {
            return null;
        }

        // Inclure le nom complet de l'utilisateur
        String utilisateurNom = "Anonyme";
        if (avis.getUtilisateur() != null) {
            utilisateurNom = avis.getUtilisateur().getNomComplet();
        }

        // Inclure le titre du livre
        String livreTitre = "Livre inconnu";
        if (avis.getLivre() != null) {
            livreTitre = avis.getLivre().getTitre();
        }

        return new AvisDTO(
                avis.getId(),
                avis.getCommentaire(),
                avis.getNote(),
                utilisateurNom,
                livreTitre
        );
    }
}