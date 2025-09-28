package sn.unchk.bibliotheque.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sn.unchk.bibliotheque.entity.Avis;

import java.util.List;

public interface AvisRepository extends JpaRepository<Avis, Long> {

    // ✅ Récupérer les derniers avis triés par date décroissante
    @Query("SELECT a FROM Avis a ORDER BY a.date DESC")
    List<Avis> findRecentReviews(Pageable pageable);

    // Récupère tous les avis d'un livre par son id
    List<Avis> findByLivreIdOrderByIdDesc(Long livreId);
}
