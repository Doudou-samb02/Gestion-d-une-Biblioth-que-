package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Livre;

public class LivreMapper {
    public static LivreDTO toDTO(Livre l) {
        if (l == null) return null;
        Long aid = l.getAuteur() != null ? l.getAuteur().getId() : null;
        String an = l.getAuteur() != null ? l.getAuteur().getNom() : null;
        Long cid = l.getCategorie() != null ? l.getCategorie().getId() : null;
        String cn = l.getCategorie() != null ? l.getCategorie().getNom() : null;
        return new LivreDTO(l.getId(), l.getTitre(), l.getIsbn(), l.getDatePublication(), l.getCover(), aid, an, cid, cn, l.isDisponible());
    }
}
