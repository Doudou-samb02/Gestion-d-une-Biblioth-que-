package sn.unchk.bibliotheque.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sn.unchk.bibliotheque.entity.Emprunt;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.entity.StatutEmprunt;
import sn.unchk.bibliotheque.entity.Utilisateur;

import java.time.LocalDate;
import java.util.List;

public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {

    // Liste des emprunts par utilisateur
    List<Emprunt> findByUtilisateur(Utilisateur utilisateur);

    // Vérifier si un utilisateur a déjà emprunté un livre et ne l'a pas rendu
    boolean existsByUtilisateurAndLivreAndRenduFalse(Utilisateur utilisateur, Livre livre);

    // Compte des emprunts par statut et rendu
    long countByStatutAndRendu(StatutEmprunt statut, boolean rendu);

    long countByStatut(StatutEmprunt statut);

    // Emprunts par statut
    List<Emprunt> findByStatut(StatutEmprunt statut);

    Page<Emprunt> findByStatut(StatutEmprunt statut, Pageable pageable);

    // Trier par date de demande décroissante
    List<Emprunt> findByStatutOrderByDateDemandeDesc(StatutEmprunt statut);

    // CORRECTION : Pour statistiques annuelles avec @Query
    @Query("SELECT e FROM Emprunt e WHERE YEAR(e.dateEmprunt) = :year")
    List<Emprunt> findByDateEmpruntYear(@Param("year") int year);

    // Emprunts non rendus d'un livre
    List<Emprunt> findByLivreAndRenduFalse(Livre livre);

    // Nombre distinct d'utilisateurs ayant emprunté
    @Query("SELECT COUNT(DISTINCT e.utilisateur) FROM Emprunt e")
    long countDistinctByUtilisateur();
}