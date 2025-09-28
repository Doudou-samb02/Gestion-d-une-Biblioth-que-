package sn.unchk.bibliotheque.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.entity.Auteur;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.mapper.LivreMapper;
import sn.unchk.bibliotheque.mapper.AuteurMapper;
import sn.unchk.bibliotheque.repository.AuteurRepository;
import sn.unchk.bibliotheque.repository.LivreRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AuteurService {
    private final AuteurRepository repo;
    private final LivreRepository livreRepository;

    public AuteurService(AuteurRepository repo, LivreRepository livreRepository) {
        this.repo = repo;
        this.livreRepository = livreRepository;
    }

    // ✅ CORRECTION : Méthode findById manquante
    public Auteur findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Auteur non trouvé avec l'ID : " + id));
    }

    // ✅ CORRECTION : Méthode getLivresByAuteur manquante
    public List<LivreDTO> getLivresByAuteur(Long auteurId) {
        List<Livre> livres = livreRepository.findByAuteurId(auteurId);
        return livres.stream()
                .map(LivreMapper::toDTO)
                .toList();
    }

    // ✅ Récupérer tous les auteurs
    public List<Auteur> getAll() {
        return repo.findAll();
    }

    // ✅ Récupérer un auteur par ID (méthode existante)
    public Optional<Auteur> getById(Long id) {
        return repo.findById(id);
    }

    // ✅ Récupérer un auteur par ID (version Optional)
    public Optional<Auteur> findByIdOptional(Long id) {
        return repo.findById(id);
    }

    // ✅ Recherche par nom
    public List<Auteur> searchByNom(String nom) {
        return repo.findByNomCompletContainingIgnoreCase(nom);
    }

    // ✅ Recherche par nationalité
    public List<Auteur> searchByNationalite(String nationalite) {
        return repo.findByNationaliteContainingIgnoreCase(nationalite);
    }

    // ✅ Créer un auteur
    public Auteur save(Auteur a) {
        return repo.save(a);
    }

    // ✅ Modifier un auteur
    public Auteur update(Long id, Auteur auteurMaj) {
        Auteur existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Auteur non trouvé avec l'ID : " + id));

        existing.setNomComplet(auteurMaj.getNomComplet());
        existing.setNationalite(auteurMaj.getNationalite());
        existing.setBiographie(auteurMaj.getBiographie()); // Correction: biography au lieu de biographie

        return repo.save(existing);
    }

    // ✅ Supprimer un auteur
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // ✅ Compter le nombre d'auteurs
    public long count() {
        return repo.count();
    }

    // ✅ Auteurs en vedette
    public List<Auteur> findFeatured(int limit) {
        return repo.findFeatured(limit);
    }

    // ✅ Récupérer tous les livres
    public List<LivreDTO> getAllLivres() {
        return livreRepository.findAll()
                .stream()
                .map(LivreMapper::toDTO)
                .toList();
    }

    // ✅ Auteurs en vedette avec comptage de livres
    public List<AuteurDTO> getFeaturedAuthorsWithBooksCount(int limit) {
        return repo.findFeatured(limit)
                .stream()
                .map(AuteurMapper::toDTO)
                .toList();
    }
}