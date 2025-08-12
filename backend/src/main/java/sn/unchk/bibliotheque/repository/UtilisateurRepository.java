package sn.unchk.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sn.unchk.bibliotheque.entity.Utilisateur;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Utilisateur findByEmail(String email);
}
