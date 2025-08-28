package sn.unchk.bibliotheque.repository;

import sn.unchk.bibliotheque.entity.Emprunt;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.entity.Livre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {
    List<Emprunt> findByUtilisateur(Utilisateur utilisateur);

    List<Emprunt> findByLivreAndRenduFalse(Livre livre);

    List<Emprunt> findByRenduFalse();

    // ✅ Pour trouver un emprunt en cours juste avec l’ID du livre
    Optional<Emprunt> findByLivreIdAndRenduFalse(Long livreId);
}
