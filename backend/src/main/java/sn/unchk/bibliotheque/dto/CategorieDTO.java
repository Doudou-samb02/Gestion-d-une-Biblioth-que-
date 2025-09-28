package sn.unchk.bibliotheque.dto;

public record CategorieDTO(
        Long id,
        String nom,

        int livresCount
) {}