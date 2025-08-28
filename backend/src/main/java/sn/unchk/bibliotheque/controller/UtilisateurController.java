package sn.unchk.bibliotheque.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.UtilisateurDTO;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.mapper.UtilisateurMapper;
import sn.unchk.bibliotheque.service.UtilisateurService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin
public class UtilisateurController {
    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UtilisateurDTO> all() {
        return service.getAll().stream().map(UtilisateurMapper::toDTO).collect(Collectors.toList());
    }

    // ✅ Récupérer le profil de l'utilisateur connecté
    @GetMapping("/me")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public UtilisateurDTO getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return UtilisateurMapper.toDTO(service.findByEmail(userDetails.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UtilisateurDTO create(@RequestBody Utilisateur u) {
        return UtilisateurMapper.toDTO(service.save(u));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UtilisateurDTO update(@PathVariable Long id, @RequestBody Utilisateur u) {
        return UtilisateurMapper.toDTO(service.update(id, u));
    }

    // ✅ Lecteur : mettre à jour son propre profil
    @PutMapping("/me/update")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public UtilisateurDTO updateMe(@AuthenticationPrincipal UserDetails userDetails,
                                   @RequestBody Utilisateur u) {
        return UtilisateurMapper.toDTO(service.updateSelf(userDetails.getUsername(), u));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
