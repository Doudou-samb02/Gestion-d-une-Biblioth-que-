package sn.unchk.bibliotheque.service;

import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Auteur;
import sn.unchk.bibliotheque.mapper.LivreMapper;
import sn.unchk.bibliotheque.repository.AuteurRepository;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.repository.LivreRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuteurService {
    private final AuteurRepository repo;
    private final LivreRepository livreRepository;

    public AuteurService(AuteurRepository repo,LivreRepository livreRepository) {
        this.repo = repo;this.livreRepository = livreRepository;
    }

    public List<LivreDTO> getLivresByAuteur(Long auteurId) {
        return livreRepository.findByAuteurId(auteurId)
                .stream()
                .map(LivreMapper::toDTO) // Ton mapper renvoie aussi la catégorie
                .collect(Collectors.toList());
    }

    public List<Auteur> getAll() {
        return repo.findAll();
    }

    public Optional<Auteur> getById(Long id) {
        return repo.findById(id);
    }

    public List<Auteur> searchByNom(String nom) {
        return repo.findByNomContainingIgnoreCase(nom);
    }

    public Auteur save(Auteur a) {
        return repo.save(a);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
