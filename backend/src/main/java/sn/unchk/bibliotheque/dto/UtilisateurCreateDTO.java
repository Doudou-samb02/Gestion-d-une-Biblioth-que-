package sn.unchk.bibliotheque.dto;

import sn.unchk.bibliotheque.entity.Role;

public record UtilisateurCreateDTO(String nom, String email, String password, Role role) {
}