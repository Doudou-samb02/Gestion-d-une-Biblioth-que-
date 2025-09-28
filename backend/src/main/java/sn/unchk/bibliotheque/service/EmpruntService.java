package sn.unchk.bibliotheque.service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.entity.Emprunt;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.entity.StatutEmprunt;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.EmpruntRepository;
import sn.unchk.bibliotheque.repository.LivreRepository;
import sn.unchk.bibliotheque.repository.AuteurRepository;
import sn.unchk.bibliotheque.repository.CategorieRepository;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmpruntService {

    private final EmpruntRepository repo;
    private final LivreRepository livreRepo;
    private final AuteurRepository auteurRepo;
    private final CategorieRepository categorieRepo;

    public EmpruntService(EmpruntRepository repo, LivreRepository livreRepo,
                          AuteurRepository auteurRepo, CategorieRepository categorieRepo) {
        this.repo = repo;
        this.livreRepo = livreRepo;
        this.auteurRepo = auteurRepo;
        this.categorieRepo = categorieRepo;
    }

    // ==========================
    // CRUD de base
    // ==========================
    public List<Emprunt> getAll() {
        return repo.findAll();
    }

    public Emprunt getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Emprunt non trouvé"));
    }

    public List<Emprunt> getAllByUtilisateur(Utilisateur utilisateur) {
        return repo.findByUtilisateur(utilisateur);
    }

    public Emprunt demander(Utilisateur u, Livre l) {
        if (!l.isDisponible()) {
            throw new IllegalStateException("Livre non disponible");
        }

        boolean dejaEmprunte = repo.existsByUtilisateurAndLivreAndRenduFalse(u, l);
        if (dejaEmprunte) {
            throw new IllegalStateException("L'utilisateur a déjà emprunté ce livre et ne l'a pas encore rendu");
        }

        Emprunt e = new Emprunt();
        e.setUtilisateur(u);
        e.setLivre(l);
        e.setRendu(false);
        e.setStatut(StatutEmprunt.EN_ATTENTE);
        e.setDateDemande(LocalDate.now());
        return repo.save(e);
    }

    @Transactional
    public Emprunt valider(Long empruntId, int jours) {
        Emprunt e = getById(empruntId);

        if (e.getStatut() != StatutEmprunt.EN_ATTENTE) {
            throw new IllegalStateException("Cet emprunt a déjà été traité");
        }

        Livre livre = e.getLivre();
        if (!livre.isDisponible()) {
            throw new IllegalStateException("Livre non disponible");
        }

        // Décrémenter le stock
        livre.setNbExemplaires(livre.getNbExemplaires() - 1);
        livreRepo.save(livre);

        e.setStatut(StatutEmprunt.VALIDE);
        e.setDateEmprunt(LocalDate.now());
        e.setDateLimiteRetour(LocalDate.now().plusDays(jours));

        return repo.save(e);
    }

    public Emprunt rejeter(Long empruntId) {
        Emprunt e = getById(empruntId);
        e.setStatut(StatutEmprunt.REJETE);
        return repo.save(e);
    }

    @Transactional
    public Emprunt rendre(Long empruntId) {
        Emprunt e = getById(empruntId);

        if (e.getStatut() != StatutEmprunt.VALIDE || e.isRendu()) {
            throw new IllegalStateException("Cet emprunt ne peut pas être rendu");
        }

        // Incrémenter le stock
        Livre livre = e.getLivre();
        livre.setNbExemplaires(livre.getNbExemplaires() + 1);
        livreRepo.save(livre);

        e.setRendu(true);
        e.setDateRetour(LocalDate.now());
        e.setStatut(StatutEmprunt.TERMINE);

        return repo.save(e);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Optional<Livre> getLivreById(Long id) {
        return livreRepo.findById(id);
    }

    // ==========================
// Prolongation d'emprunt
// ==========================
    @Transactional
    public Emprunt prolonger(Long empruntId, int joursSupplementaires) {
        if (joursSupplementaires <= 0) {
            throw new RuntimeException("Le nombre de jours supplémentaires doit être positif");
        }

        if (joursSupplementaires > 30) {
            throw new RuntimeException("La prolongation ne peut pas dépasser 30 jours");
        }

        Emprunt e = getById(empruntId);

        // Vérifier que l'emprunt est valide et en cours
        if (e.getStatut() != StatutEmprunt.VALIDE) {
            throw new RuntimeException("Seuls les emprunts validés peuvent être prolongés");
        }

        if (e.isRendu()) {
            throw new RuntimeException("Impossible de prolonger un emprunt déjà rendu");
        }

        // Vérifier que la date de retour prévue existe
        if (e.getDateLimiteRetour() == null) {
            throw new RuntimeException("Date de retour prévue non définie");
        }

        // Vérifier que le livre n'est pas déjà en retard
        if (e.getDateLimiteRetour().isBefore(LocalDate.now())) {
            throw new RuntimeException("Impossible de prolonger un emprunt en retard");
        }

        // Calculer la nouvelle date
        LocalDate nouvelleDate = e.getDateLimiteRetour().plusDays(joursSupplementaires);

        // Vérifier que la nouvelle date n'est pas trop éloignée (max 3 mois à partir de la date d'emprunt)
        if (e.getDateEmprunt() != null) {
            LocalDate dateMax = e.getDateEmprunt().plusMonths(3);
            if (nouvelleDate.isAfter(dateMax)) {
                throw new RuntimeException("La durée totale de l'emprunt ne peut pas dépasser 3 mois");
            }
        }

        // Mettre à jour la date de retour
        e.setDateLimiteRetour(nouvelleDate);

        // Optionnel: Ajouter un log pour tracer la prolongation
        System.out.println("Emprunt #" + empruntId + " prolongé de " + joursSupplementaires + " jours. " +
                "Nouvelle date de retour: " + nouvelleDate);

        return repo.save(e);
    }

    // ==========================
    // Statistiques
    // ==========================
    public long countEnCours() {
        return repo.countByStatutAndRendu(StatutEmprunt.VALIDE, false);
    }

    public long countDemandesEnAttente() {
        return repo.countByStatut(StatutEmprunt.EN_ATTENTE);
    }

    public long countUtilisateurs() {
        return repo.countDistinctByUtilisateur();
    }

    public List<Map<String, Object>> getStatsMensuels() {
        List<Emprunt> empruntsCetteAnnee = repo.findByDateEmpruntYear(LocalDate.now().getYear())
                .stream()
                .filter(e -> e.getDateEmprunt() != null)
                .collect(Collectors.toList());

        Map<Month, Long> statsParMois = empruntsCetteAnnee.stream()
                .filter(e -> e.getDateEmprunt() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDateEmprunt().getMonth(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> stats = new ArrayList<>();
        String[] nomsMois = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};

        for (int i = 0; i < nomsMois.length; i++) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("mois", nomsMois[i]);
            stat.put("nombre", statsParMois.getOrDefault(Month.of(i + 1), 0L).intValue());
            stats.add(stat);
        }

        return stats;
    }

    public List<Map<String, Object>> getTopLivresEmpruntes(int limit) {
        List<Emprunt> empruntsValides = repo.findByStatut(StatutEmprunt.VALIDE);

        Map<Livre, Long> livresAvecCount = empruntsValides.stream()
                .collect(Collectors.groupingBy(Emprunt::getLivre, Collectors.counting()));

        return livresAvecCount.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(limit)
                .map(entry -> {
                    Map<String, Object> livre = new HashMap<>();
                    livre.put("titre", entry.getKey().getTitre());
                    livre.put("auteur", entry.getKey().getAuteur() != null ?
                            entry.getKey().getAuteur().getNomComplet() : "Inconnu");
                    livre.put("emprunts", entry.getValue().intValue());
                    return livre;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRepartitionParGenre() {
        List<Emprunt> empruntsCetteAnnee = repo.findByDateEmpruntYear(LocalDate.now().getYear())
                .stream()
                .filter(e -> e.getDateEmprunt() != null)
                .collect(Collectors.toList());

        Map<String, Long> countParCategorie = empruntsCetteAnnee.stream()
                .filter(e -> e.getDateEmprunt() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getLivre().getCategorie() != null ?
                                e.getLivre().getCategorie().getNom() : "Non spécifié",
                        Collectors.counting()
                ));

        long total = empruntsCetteAnnee.stream()
                .filter(e -> e.getDateEmprunt() != null)
                .count();

        return countParCategorie.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> genre = new HashMap<>();
                    genre.put("genre", entry.getKey());
                    genre.put("count", entry.getValue().intValue());
                    genre.put("pourcentage", total > 0 ?
                            Math.round((entry.getValue() * 100.0 / total) * 10.0) / 10.0 : 0.0);
                    return genre;
                })
                .sorted((g1, g2) -> Integer.compare((Integer) g2.get("count"), (Integer) g1.get("count")))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getEmpruntsRecents(int limit) {
        List<Emprunt> empruntsRecents = repo.findByStatut(
                StatutEmprunt.VALIDE,
                PageRequest.of(0, limit)
        ).getContent(); // conversion Page -> List

        return empruntsRecents.stream()
                .map(e -> {
                    Map<String, Object> emprunt = new HashMap<>();
                    emprunt.put("id", e.getId());
                    emprunt.put("livreTitre", e.getLivre().getTitre());
                    emprunt.put("utilisateurNom", e.getUtilisateur().getNomComplet());
                    emprunt.put("utilisateurEmail", e.getUtilisateur().getEmail());
                    emprunt.put("dateEmprunt", formatDate(e.getDateEmprunt()));
                    emprunt.put("dateRetourPrevue", formatDate(e.getDateLimiteRetour()));

                    String statut;
                    if (e.isRendu()) {
                        statut = "TERMINE";
                    } else if (e.getDateLimiteRetour().isBefore(LocalDate.now())) {
                        statut = "EN_RETARD";
                    } else {
                        statut = "EN_COURS";
                    }
                    emprunt.put("statut", statut);

                    return emprunt;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDemandesEnAttente() {
        List<Emprunt> demandesEnAttente = repo.findByStatutOrderByDateDemandeDesc(StatutEmprunt.EN_ATTENTE);

        return demandesEnAttente.stream()
                .map(e -> {
                    Map<String, Object> demande = new HashMap<>();
                    demande.put("id", e.getId());
                    demande.put("livreTitre", e.getLivre().getTitre());
                    demande.put("utilisateurNom", e.getUtilisateur().getNomComplet());
                    demande.put("utilisateurEmail", e.getUtilisateur().getEmail());
                    demande.put("dateDemande", formatDate(e.getDateDemande()));
                    demande.put("statut", "EN_ATTENTE");
                    return demande;
                })
                .collect(Collectors.toList());
    }

    // Utilitaire pour formater les dates
    private String formatDate(LocalDate date) {
        if (date == null) return "N/A";
        return date.toString(); // tu peux remplacer par un format plus joli si besoin
    }
}
