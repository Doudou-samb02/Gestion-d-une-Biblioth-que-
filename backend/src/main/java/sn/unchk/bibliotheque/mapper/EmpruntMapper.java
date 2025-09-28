package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.EmpruntDTO;
import sn.unchk.bibliotheque.entity.Emprunt;

public class EmpruntMapper {

    public static EmpruntDTO toDTO(Emprunt e) {
        if (e == null) return null;

        Long utilisateurId = e.getUtilisateur() != null ? e.getUtilisateur().getId() : null;
        String utilisateurNom = e.getUtilisateur() != null ? e.getUtilisateur().getNomComplet() : "Anonyme";

        Long livreId = e.getLivre() != null ? e.getLivre().getId() : null;
        String livreTitre = e.getLivre() != null ? e.getLivre().getTitre() : "Livre inconnu";

        String auteurNom = (e.getLivre() != null && e.getLivre().getAuteur() != null)
                ? e.getLivre().getAuteur().getNomComplet()
                : "Auteur inconnu";

        String cover = (e.getLivre() != null && e.getLivre().getCover() != null)
                ? e.getLivre().getCover()
                : "/covers/default.jpg";

        String statut = e.getStatut() != null ? e.getStatut().name() : "INCONNU";

        return new EmpruntDTO(
                e.getId(),
                utilisateurId,
                utilisateurNom,
                livreId,
                livreTitre,
                auteurNom,
                cover,
                e.getDateDemande(),
                e.getDateEmprunt(),
                e.getDateLimiteRetour(),
                e.getDateRetour(),
                e.isRendu(),
                statut
        );
    }
}
