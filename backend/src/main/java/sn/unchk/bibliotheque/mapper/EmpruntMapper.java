package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.EmpruntDTO;
import sn.unchk.bibliotheque.entity.Emprunt;

public class EmpruntMapper {
    public static EmpruntDTO toDTO(Emprunt e) {
        if (e == null) return null;

        Long uid = e.getUtilisateur() != null ? e.getUtilisateur().getId() : null;
        String un = e.getUtilisateur() != null ? e.getUtilisateur().getNom() : null;
        Long lid = e.getLivre() != null ? e.getLivre().getId() : null;
        String lt = e.getLivre() != null ? e.getLivre().getTitre() : null;
        // ✅ Bien mapper l'auteur et la cover
        String an = (e.getLivre() != null && e.getLivre().getAuteur() != null)
                ? e.getLivre().getAuteur().getNom()
                : "Auteur inconnu";

        String cv = (e.getLivre() != null && e.getLivre().getCover() != null)
                ? e.getLivre().getCover()
                : "/covers/default.jpg";

        return new EmpruntDTO(
                e.getId(),
                uid,
                un,
                lid,
                lt,
                an,
                cv,
                e.getDateDemande(),   // ✅ nouveau
                e.getDateEmprunt(),
                e.getDateLimiteRetour(),
                e.getDateRetour(),
                e.isRendu(),
                e.getStatut()         // ✅ nouveau
        );
    }
}
