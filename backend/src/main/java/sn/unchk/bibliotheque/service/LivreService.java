package sn.unchk.bibliotheque.service;

import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.repository.LivreRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LivreService {

    private final LivreRepository repo;

    public LivreService(LivreRepository repo) {
        this.repo = repo;
    }

    // CRUD de base
    public List<Livre> getAll() {
        return repo.findAll();
    }

    public Optional<Livre> getById(Long id) {
        return repo.findById(id);
    }

    public Livre save(Livre livre) {
        return repo.save(livre);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public long count() {
        return repo.count();
    }

    // Pour PublicController
    public List<Livre> findLatest(int limit) {
        return repo.findLatest(limit);
    }

    public List<Livre> findMostBorrowed(int limit) {
        return repo.findMostBorrowed(limit);
    }

    // Recherches
    public List<Livre> searchByTitre(String titre) {
        return repo.findByTitreContainingIgnoreCase(titre);
    }

    public List<Livre> searchByCategorie(String nomCategorie) {
        return repo.findByCategorie_Nom(nomCategorie);
    }

    public List<Livre> searchByAuteur(String nomComplet) {
        return repo.findByAuteur_NomComplet(nomComplet);
    }

    // Gestion disponibilité
    public List<Livre> getDisponibles() {
        return repo.findByNbExemplairesGreaterThan(0);
    }
    // ✅ AJOUTER CETTE MÉTHODE si elle n'existe pas
    public List<Livre> getByCategorie(Long categorieId) {
        return repo.findByCategorieId(categorieId);
    }
}