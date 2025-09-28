package sn.unchk.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.unchk.bibliotheque.entity.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // ✅ Recherche par email (authentification)
    Optional<Utilisateur> findByEmail(String email);

    // ✅ Vérification existence email
    boolean existsByEmail(String email);

    // ✅ Recherche par nom complet (utile pour les filtres, recherche admin, etc.)
    List<Utilisateur> findByNomCompletContainingIgnoreCase(String nomComplet);

    // ✅ Recherche par statut (actif/inactif)
    List<Utilisateur> findByActif(boolean actif);

}
