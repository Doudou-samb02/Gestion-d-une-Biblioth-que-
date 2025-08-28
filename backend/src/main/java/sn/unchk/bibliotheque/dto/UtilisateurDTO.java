package sn.unchk.bibliotheque.dto;

import sn.unchk.bibliotheque.entity.Role;

public record UtilisateurDTO(Long id, String nom, String email, Role role) {
}