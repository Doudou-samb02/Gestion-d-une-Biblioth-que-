package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.CategorieDTO;
import sn.unchk.bibliotheque.entity.Categorie;

public class CategorieMapper {
    public static CategorieDTO toDTO(Categorie c) {
        if (c == null) return null;
        return new CategorieDTO(c.getId(), c.getNom());
    }
}
