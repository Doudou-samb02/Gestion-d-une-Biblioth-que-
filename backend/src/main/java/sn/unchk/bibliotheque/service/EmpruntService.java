package sn.unchk.bibliotheque.service;

import sn.unchk.bibliotheque.entity.Emprunt;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.entity.StatutEmprunt;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.EmpruntRepository;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.repository.LivreRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmpruntService {
    private final EmpruntRepository repo;
    private final LivreService livreService;
    private final LivreRepository livreRepo;

    public EmpruntService(EmpruntRepository repo, LivreService livreService, LivreRepository livreRepo) {
        this.repo = repo;
        this.livreService = livreService;
        this.livreRepo = livreRepo;
    }

    public List<Emprunt> getAll() {
        return repo.findAll();
    }

    public List<Emprunt> getAllByUtilisateur(Utilisateur utilisateur) {
        return repo.findByUtilisateur(utilisateur);
    }

    public Optional<Emprunt> getById(Long id) {
        return repo.findById(id);
    }

    // 🔹 Demande d'emprunt par un lecteur (statut = EN_ATTENTE)
    public Emprunt demander(Utilisateur u, Livre l) {
        Emprunt e = new Emprunt();
        e.setUtilisateur(u);
        e.setLivre(l);
        e.setRendu(false);
        e.setStatut(StatutEmprunt.EN_ATTENTE);
        e.setDateDemande(LocalDate.now());
        return repo.save(e);
    }

    // 🔹 Validation par admin
    public Emprunt valider(Long empruntId, int jours) {
        Emprunt e = repo.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));

        if (e.getStatut() != StatutEmprunt.EN_ATTENTE) {
            throw new IllegalStateException("Cet emprunt a déjà été traité");
        }

        e.setStatut(StatutEmprunt.VALIDE);
        e.setDateEmprunt(LocalDate.now());
        e.setDateLimiteRetour(LocalDate.now().plusDays(jours));

        // Marquer le livre comme indisponible
        Livre livre = e.getLivre();
        livre.setDisponible(false);
        livreRepo.save(livre);

        return repo.save(e);
    }


    // 🔹 Rejet par admin
    public Emprunt rejeter(Long empruntId) {
        Emprunt e = repo.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));

        e.setStatut(StatutEmprunt.REJETE);
        return repo.save(e);
    }

    // 🔹 Admin marque un emprunt comme rendu
    public Emprunt rendre(Long empruntId) {
        Emprunt e = repo.findById(empruntId)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));

        if (e.getStatut() != StatutEmprunt.VALIDE || e.isRendu()) {
            throw new IllegalStateException("Cet emprunt ne peut pas être rendu");
        }

        e.setRendu(true);
        e.setDateRetour(LocalDate.now());
        e.setStatut(StatutEmprunt.TERMINE); // ✅ Mettre le statut à TERMINE

        // Livre devient dispo à nouveau
        Livre livre = e.getLivre();
        livre.setDisponible(true);
        livreRepo.save(livre);

        return repo.save(e);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
