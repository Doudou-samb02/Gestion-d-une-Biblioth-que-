package sn.unchk.bibliotheque.service;

import sn.unchk.bibliotheque.entity.Categorie;
import sn.unchk.bibliotheque.repository.CategorieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService {
    private final CategorieRepository repo;

    public CategorieService(CategorieRepository repo) {
        this.repo = repo;
    }

    public List<Categorie> getAll() {
        return repo.findAll();
    }

    public Optional<Categorie> getById(Long id) {
        return repo.findById(id);
    }

    public Categorie save(Categorie c) {
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
