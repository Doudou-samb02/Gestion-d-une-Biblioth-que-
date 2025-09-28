package sn.unchk.bibliotheque.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.EmpruntDTO;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.mapper.EmpruntMapper;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;
import sn.unchk.bibliotheque.service.EmpruntService;
import sn.unchk.bibliotheque.service.LivreService; // IMPORT AJOUTÉ

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/emprunts")
@CrossOrigin
public class EmpruntController {

    private final EmpruntService empruntService;
    private final UtilisateurRepository utilisateurRepository;
    private final LivreService livreService; // DÉCLARATION AJOUTÉE

    // CONSTRUCTEUR CORRIGÉ
    public EmpruntController(EmpruntService empruntService,
                             UtilisateurRepository utilisateurRepository,
                             LivreService livreService) {
        this.empruntService = empruntService;
        this.utilisateurRepository = utilisateurRepository;
        this.livreService = livreService;
    }

    // 🔹 Liste de tous les emprunts (admin uniquement)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmpruntDTO>> all() {
        List<EmpruntDTO> dtos = empruntService.getAll().stream()
                .map(EmpruntMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // 🔹 NOUVEL ENDPOINT : Récupérer les emprunts d'un utilisateur spécifique (admin uniquement)
    @GetMapping("/utilisateur/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmpruntDTO>> getEmpruntsByUtilisateurId(@PathVariable Long userId) {
        try {
            Utilisateur utilisateur = utilisateurRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + userId));

            List<EmpruntDTO> dtos = empruntService.getAllByUtilisateur(utilisateur).stream()
                    .map(EmpruntMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 Emprunts de l'utilisateur connecté
    @GetMapping("/mes-emprunts")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public ResponseEntity<List<EmpruntDTO>> mesEmprunts(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EmpruntDTO> dtos = empruntService.getAllByUtilisateur(u).stream()
                .map(EmpruntMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // 🔹 Récupérer un emprunt par id
    @GetMapping("/{id}")
    public ResponseEntity<EmpruntDTO> byId(@PathVariable Long id) {
        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.getById(id));
        return ResponseEntity.ok(dto);
    }

    // 🔹 CORRECTION : Demander un emprunt
    @PostMapping("/demander")
    @PreAuthorize("hasRole('LECTEUR')")
    public ResponseEntity<EmpruntDTO> demander(@RequestBody EmpruntRequest req, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // CORRECTION : Utiliser livreService pour récupérer le livre
        Livre l = livreService.getById(req.livreId())
                .orElseThrow(() -> new RuntimeException("Livre introuvable"));

        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.demander(u, l));
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // 🔹 Valider un emprunt (admin) - CORRECTION DU NOM DE MÉTHODE
    @PostMapping("/valider/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> valider(@PathVariable Long id, @RequestParam int jours) {
        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.valider(id, jours));
        return ResponseEntity.ok(dto);
    }

    // 🔹 Rejeter un emprunt (admin) - CORRECTION DU NOM DE MÉTHODE
    @PostMapping("/rejeter/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> rejeter(@PathVariable Long id) {
        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.rejeter(id));
        return ResponseEntity.ok(dto);
    }

    // 🔹 Marquer comme rendu (admin)
    @PostMapping("/rendre/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> rendre(@PathVariable Long id) {
        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.rendre(id));
        return ResponseEntity.ok(dto);
    }
    // 🔹 Prolonger un emprunt (admin) - À AJOUTER
    @PostMapping("/{id}/prolonger")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> prolonger(@PathVariable Long id, @RequestParam int jours) {
        EmpruntDTO dto = EmpruntMapper.toDTO(empruntService.prolonger(id, jours));
        return ResponseEntity.ok(dto);
    }

    // 🔹 Supprimer un emprunt (admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        empruntService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ DTO simplifié pour la requête
    public record EmpruntRequest(Long livreId, int jours) {}
}