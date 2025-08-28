package sn.unchk.bibliotheque.repository;

import sn.unchk.bibliotheque.entity.Livre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LivreRepository extends JpaRepository<Livre, Long> {
    List<Livre> findByTitreContainingIgnoreCase(String titre);

    List<Livre> findByCategorie_Nom(String nomCategorie);

    List<Livre> findByAuteur_Nom(String nomAuteur);

    List<Livre> findByIsbn(String isbn);
    List<Livre> findByAuteurId(Long auteurId);
}
