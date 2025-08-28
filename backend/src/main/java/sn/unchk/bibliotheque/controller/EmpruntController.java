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

import java.util.List;

@RestController
@RequestMapping("/api/emprunts")
@CrossOrigin
public class EmpruntController {
    private final EmpruntService service;
    private final UtilisateurRepository utilisateurRepository;

    public EmpruntController(EmpruntService service , UtilisateurRepository utilisateurRepository) {
        this.service = service;
        this.utilisateurRepository = utilisateurRepository;
    }

    // 🔹 Liste de tous les emprunts (admin uniquement)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmpruntDTO>> all() {
        return ResponseEntity.ok(
                service.getAll().stream()
                        .map(EmpruntMapper::toDTO)
                        .toList()
        );
    }

    // 🔹 Emprunts d’un utilisateur spécifique (admin ou l’utilisateur lui-même)
    @GetMapping("/utilisateur/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<List<EmpruntDTO>> empruntsUtilisateur(@PathVariable Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        List<EmpruntDTO> emprunts = service.getAllByUtilisateur(u).stream()
                .map(EmpruntMapper::toDTO)
                .toList();

        return ResponseEntity.ok(emprunts);
    }


    // 🔹 Emprunts de l’utilisateur connecté
    @GetMapping("/mes-emprunts")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public ResponseEntity<List<EmpruntDTO>> mesEmprunts(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return ResponseEntity.ok(
                service.getAllByUtilisateur(u).stream()
                        .map(EmpruntMapper::toDTO)
                        .toList()
        );
    }

    // 🔹 Récupérer un emprunt par id
    @GetMapping("/{id}")
    public ResponseEntity<EmpruntDTO> byId(@PathVariable Long id) {
        return service.getById(id)
                .map(EmpruntMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Lecteur fait une demande
    @PostMapping("/demander")
    @PreAuthorize("hasRole('LECTEUR')")
    public ResponseEntity<EmpruntDTO> demander(@RequestBody EmpruntRequest req, Authentication authentication) {
        // ⚠️ Sécurité : on prend l’utilisateur connecté
        String email = authentication.getName();
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Livre l = new Livre();
        l.setId(req.livreId());

        EmpruntDTO dto = EmpruntMapper.toDTO(service.demander(u, l));
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // 🔹 Admin valide avec le nombre de jours
    @PostMapping("/valider/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EmpruntDTO valider(@PathVariable Long id, @RequestParam int jours) {
        return EmpruntMapper.toDTO(service.valider(id, jours));
    }


    // 🔹 Admin rejette une demande
    @PostMapping("/rejeter/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> rejeter(@PathVariable Long id) {
        return ResponseEntity.ok(EmpruntMapper.toDTO(service.rejeter(id)));
    }

    // 🔹 Admin marque comme rendu
    @PostMapping("/rendre/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmpruntDTO> rendre(@PathVariable Long id) {
        return ResponseEntity.ok(EmpruntMapper.toDTO(service.rendre(id)));
    }

    // 🔹 Supprimer un emprunt
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ DTO simplifié pour la requête
    public record EmpruntRequest(Long livreId, int jours) {}
}
