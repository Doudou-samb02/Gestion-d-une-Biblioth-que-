package sn.unchk.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.unchk.bibliotheque.entity.Auteur;

import java.util.List;
import java.util.Optional;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {

    List<Auteur> findByNomCompletContainingIgnoreCase(String nomComplet);
    Optional<Auteur> findByNomComplet(String nomComplet);
    List<Auteur> findByNationaliteContainingIgnoreCase(String nationalite);

    // ✅ CORRECTION : Méthode findFeatured (sans Pageable si vous voulez utiliser LIMIT)
    @Query("SELECT a FROM Auteur a ORDER BY SIZE(a.livres) DESC LIMIT :limit")
    List<Auteur> findFeatured(int limit);

    long count();
}