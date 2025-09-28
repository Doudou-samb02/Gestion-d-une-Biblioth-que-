package sn.unchk.bibliotheque.mapper;

import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Livre;

public class LivreMapper {

    public static LivreDTO toDTO(Livre l) {
        if (l == null) return null;

        Long auteurId = l.getAuteur() != null ? l.getAuteur().getId() : null;
        String auteurNom = l.getAuteur() != null ? l.getAuteur().getNomComplet() : "Auteur inconnu";

        Long categorieId = l.getCategorie() != null ? l.getCategorie().getId() : null;
        String categorieNom = l.getCategorie() != null ? l.getCategorie().getNom() : "Catégorie inconnue";

        return new LivreDTO(
                l.getId(),
                l.getTitre(),
                l.getIsbn(),
                l.getLangue(),
                l.getDatePublication(),
                l.getNbPages(),
                l.getNbExemplaires(),
                l.getDescription(),
                l.getCover(),
                l.isDisponible(), // Utiliser la méthode isDisponible() de l'entité
                auteurId,
                auteurNom,
                categorieId,
                categorieNom,
                l.isDisponible() ? "Disponible" : "Indisponible",
                l.getNbEmprunts()
        );
    }
}