package sn.unchk.bibliotheque.repository;

import sn.unchk.bibliotheque.entity.Auteur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {
    List<Auteur> findByNomContainingIgnoreCase(String nom);
    Optional<Auteur> findByNom(String nom);  // ✅ ajoute cette méthode

}
