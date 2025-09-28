package sn.unchk.bibliotheque.repository;

import sn.unchk.bibliotheque.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Optional<Categorie> findByNom(String nom);
    //List<Categorie> findByNom(String nom);  // ✅ ajoute cette méthode

}
