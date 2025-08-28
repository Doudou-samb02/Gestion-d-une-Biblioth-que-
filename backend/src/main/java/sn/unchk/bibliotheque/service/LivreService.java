package sn.unchk.bibliotheque.service;

import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.repository.LivreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivreService {
    private final LivreRepository repo;

    public LivreService(LivreRepository repo) {
        this.repo = repo;
    }

    public List<Livre> getAll() {
        return repo.findAll();
    }

    public Optional<Livre> getById(Long id) {
        return repo.findById(id);
    }

    public List<Livre> searchByTitre(String titre) {
        return repo.findByTitreContainingIgnoreCase(titre);
    }

    public List<Livre> searchByCategorie(String cat) {
        return repo.findByCategorie_Nom(cat);
    }

    public List<Livre> searchByAuteur(String a) {
        return repo.findByAuteur_Nom(a);
    }

    public Optional<Livre> getByIsbn(String isbn) {
        return repo.findByIsbn(isbn).stream().findFirst();
    }

    public Livre save(Livre l) {
        return repo.save(l);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // ✅ Met à jour la disponibilité
    public Livre setDisponibilite(Long id, boolean disponible) {
        Livre livre = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Livre introuvable"));
        livre.setDisponible(disponible);
        return repo.save(livre);
    }
}
