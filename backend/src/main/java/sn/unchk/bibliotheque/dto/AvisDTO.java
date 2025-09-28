package sn.unchk.bibliotheque.dto;

public record AvisDTO(
        Long id,
        String commentaire,
        int note,
        String utilisateurNom,
        String livreTitre
) {}