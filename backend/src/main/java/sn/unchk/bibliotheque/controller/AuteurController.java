package sn.unchk.bibliotheque.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import sn.unchk.bibliotheque.dto.AuteurCreateDTO;
import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Auteur;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.mapper.AuteurMapper;
import org.springframework.security.core.Authentication;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;
import sn.unchk.bibliotheque.service.AuteurService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auteurs")
@CrossOrigin
public class AuteurController {
    private final AuteurService service;
    private final UtilisateurRepository utilisateurRepository;

    public AuteurController(AuteurService service, UtilisateurRepository utilisateurRepository) {
        this.service = service;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping
    public List<AuteurDTO> all() {
        return service.getAll().stream().map(AuteurMapper::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}/livres")
    public List<LivreDTO> getLivresByAuteur(@PathVariable Long id) {
        return service.getLivresByAuteur(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AuteurDTO create(@RequestBody AuteurCreateDTO dto, Authentication authentication) {
        Auteur a = new Auteur();
        a.setNom(dto.nom());
        a.setBiographie(dto.biographie());
        a.setDateNaissance(dto.dateNaissance());

        // Récupération de l'utilisateur connecté depuis le SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        a.setCreePar(u);

        return AuteurMapper.toDTO(service.save(a));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AuteurDTO update(@PathVariable Long id, @RequestBody AuteurCreateDTO dto) {
        Auteur a = new Auteur();
        a.setId(id);
        a.setNom(dto.nom());
        a.setBiographie(dto.biographie());
        a.setDateNaissance(dto.dateNaissance());
        if (dto.creeParId() != null) {
            Utilisateur u = new Utilisateur();
            u.setId(dto.creeParId());
            a.setCreePar(u);
        }
        return AuteurMapper.toDTO(service.save(a));
    }

    @GetMapping("/{id}")
    public AuteurDTO getById(@PathVariable Long id) {
        Auteur auteur = service.getById(id)
                .orElseThrow(() -> new RuntimeException("Auteur introuvable"));

        return AuteurMapper.toDTO(auteur);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
