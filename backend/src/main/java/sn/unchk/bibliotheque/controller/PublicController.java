package sn.unchk.bibliotheque.controller;

import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.AvisDTO;
import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.dto.CategorieDTO;
import sn.unchk.bibliotheque.mapper.AuteurMapper;
import sn.unchk.bibliotheque.mapper.CategorieMapper;
import sn.unchk.bibliotheque.mapper.LivreMapper;
import sn.unchk.bibliotheque.service.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PublicController {

    private final LivreService livreService;
    private final AuteurService auteurService;
    private final CategorieService categorieService;
    private final EmpruntService empruntService;
    private final AvisService avisService;

    public PublicController(LivreService livreService,
                            AuteurService auteurService,
                            CategorieService categorieService,
                            EmpruntService empruntService,
                            AvisService avisService) {
        this.livreService = livreService;
        this.auteurService = auteurService;
        this.categorieService = categorieService;
        this.empruntService = empruntService;
        this.avisService = avisService;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return Map.of(
                "livres", livreService.count(),
                "auteurs", auteurService.count(),
                "lecteurs", empruntService.countUtilisateurs()
        );
    }

    @GetMapping("/livres/nouveaux")
    public List<LivreDTO> getNouveauxLivres() {
        return livreService.findLatest(4).stream()
                .map(LivreMapper::toDTO)
                .toList();
    }

    @GetMapping("/livres/populaires")
    public List<LivreDTO> getPopulaires() {
        return livreService.findMostBorrowed(3).stream()
                .map(LivreMapper::toDTO)
                .toList();
    }

    @GetMapping("/genres")
    public List<CategorieDTO> getGenres() {
        return categorieService.findAll().stream()
                .map(CategorieMapper::toDTO)
                .toList();
    }

    @GetMapping("/auteurs/vedette")
    public List<AuteurDTO> getAuteursVedette() {
        return auteurService.findFeatured(3).stream()
                .map(AuteurMapper::toDTO)
                .toList();
    }

    @GetMapping("/avis")
    public List<AvisDTO> getAvis() {
        return avisService.findRecentReviews(3);
    }
}