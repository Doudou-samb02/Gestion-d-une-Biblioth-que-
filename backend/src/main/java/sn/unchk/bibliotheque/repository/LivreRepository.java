package sn.unchk.bibliotheque.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.unchk.bibliotheque.entity.Livre;

import java.util.List;
import java.util.Optional;

public interface LivreRepository extends JpaRepository<Livre, Long> {

    // Recherche par titre
    List<Livre> findByTitreContainingIgnoreCase(String titre);

    // Recherche par catégorie
    List<Livre> findByCategorie_Nom(String nomCategorie);

    // Recherche par auteur
    List<Livre> findByAuteur_NomComplet(String nomComplet);

    // Recherche par ISBN
    Optional<Livre> findByIsbn(String isbn);

    // Recherche par id auteur
    List<Livre> findByAuteurId(Long auteurId);

    // Recherche par id catégorie
    List<Livre> findByCategorieId(Long categorieId);

    // Derniers livres ajoutés
    @Query("SELECT l FROM Livre l ORDER BY l.id DESC")
    List<Livre> findTopByOrderByIdDesc(Pageable pageable);

    // Livres les plus empruntés
    @Query("SELECT l FROM Livre l LEFT JOIN l.emprunts e GROUP BY l ORDER BY COUNT(e) DESC")
    List<Livre> findTopMostBorrowed(Pageable pageable);

    // Nouveaux livres (pour PublicController)
    @Query("SELECT l FROM Livre l ORDER BY l.datePublication DESC")
    List<Livre> findLatest(int limit);

    // Livres populaires (pour PublicController)
    @Query("SELECT l FROM Livre l ORDER BY SIZE(l.emprunts) DESC")
    List<Livre> findMostBorrowed(int limit);

    // Livres disponibles
    List<Livre> findByNbExemplairesGreaterThan(int min);

    // Comptage
    long count();
}