package sn.unchk.bibliotheque.dto;

import sn.unchk.bibliotheque.entity.StatutEmprunt;
import java.time.LocalDate;

public record EmpruntDTO(
        Long id,
        Long utilisateurId,
        String utilisateurNom,
        Long livreId,
        String livreTitre,
        String auteurNom,
        String cover,
        LocalDate dateDemande,
        LocalDate dateEmprunt,
        LocalDate dateLimiteRetour,
        LocalDate dateRetour,
        boolean rendu,
        String statut
) {}
