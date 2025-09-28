package sn.unchk.bibliotheque.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.service.LivreService;
import sn.unchk.bibliotheque.service.EmpruntService;
import sn.unchk.bibliotheque.service.AuteurService;
import sn.unchk.bibliotheque.service.CategorieService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final LivreService livreService;
    private final EmpruntService empruntService;
    private final AuteurService auteurService;
    private final CategorieService categorieService;

    public DashboardController(LivreService livreService,
                               EmpruntService empruntService,
                               AuteurService auteurService,
                               CategorieService categorieService) {
        this.livreService = livreService;
        this.empruntService = empruntService;
        this.auteurService = auteurService;
        this.categorieService = categorieService;
    }

    // 1️⃣ Métriques principales pour LibraryMetrics
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        try {
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("booksCount", livreService.count());
            metrics.put("authorsCount", auteurService.count());
            metrics.put("loansInProgress", empruntService.countEnCours());
            metrics.put("pendingRequests", empruntService.countDemandesEnAttente());

            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la récupération des métriques");
            error.put("details", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // 2️⃣ Statistiques mensuelles pour MonthlyLoansChart
    @GetMapping("/stats/mensuels")
    public ResponseEntity<List<Map<String, Object>>> getStatsMensuels() {
        try {
            List<Map<String, Object>> stats = empruntService.getStatsMensuels();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 3️⃣ Top livres empruntés pour TopBooksChart
    @GetMapping("/stats/top-livres")
    public ResponseEntity<List<Map<String, Object>>> getTopLivres() {
        try {
            List<Map<String, Object>> topLivres = empruntService.getTopLivresEmpruntes(10);
            return ResponseEntity.ok(topLivres);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 4️⃣ Répartition par genre pour LoansByGenreChart
    @GetMapping("/stats/par-genre")
    public ResponseEntity<List<Map<String, Object>>> getStatsParGenre() {
        try {
            List<Map<String, Object>> repartition = empruntService.getRepartitionParGenre();
            return ResponseEntity.ok(repartition);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 5️⃣ Emprunts récents pour RecentLoans
    @GetMapping("/emprunts/recents")
    public ResponseEntity<List<Map<String, Object>>> getEmpruntsRecents() {
        try {
            List<Map<String, Object>> empruntsRecents = empruntService.getEmpruntsRecents(10);
            return ResponseEntity.ok(empruntsRecents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 6️⃣ Demandes en attente pour RecentLoanRequests
    @GetMapping("/demandes/en-attente")
    public ResponseEntity<List<Map<String, Object>>> getDemandesEnAttente() {
        try {
            List<Map<String, Object>> demandesEnAttente = empruntService.getDemandesEnAttente();
            return ResponseEntity.ok(demandesEnAttente);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 7️⃣ Endpoint complet pour toutes les données du dashboard (CORRIGÉ)
    @GetMapping("/complet")
    public ResponseEntity<Map<String, Object>> getDashboardComplet() {
        try {
            Map<String, Object> dashboardData = new HashMap<>();

            // Métriques (appel direct aux services pour éviter la récursion)
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("booksCount", livreService.count());
            metrics.put("authorsCount", auteurService.count());
            metrics.put("loansInProgress", empruntService.countEnCours());
            metrics.put("pendingRequests", empruntService.countDemandesEnAttente());
            dashboardData.put("metrics", metrics);

            // Graphiques
            dashboardData.put("monthlyStats", empruntService.getStatsMensuels());
            dashboardData.put("topBooks", empruntService.getTopLivresEmpruntes(5));
            dashboardData.put("genreStats", empruntService.getRepartitionParGenre()); // Changé de "genreDistribution" à "genreStats"

            // Activités récentes
            dashboardData.put("recentLoans", empruntService.getEmpruntsRecents(5));
            dashboardData.put("pendingRequests", empruntService.getDemandesEnAttente());

            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la récupération du dashboard complet");
            error.put("details", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}