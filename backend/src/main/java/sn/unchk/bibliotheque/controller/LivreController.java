package sn.unchk.bibliotheque.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.LivreCreateDTO;
import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Auteur;
import sn.unchk.bibliotheque.entity.Categorie;
import sn.unchk.bibliotheque.entity.Livre;
import sn.unchk.bibliotheque.mapper.LivreMapper;
import sn.unchk.bibliotheque.service.LivreService;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/livres")
@CrossOrigin
public class LivreController {
    private final LivreService service;

    public LivreController(LivreService service) {
        this.service = service;
    }

    @GetMapping
    public List<LivreDTO> all() {
        return service.getAll().stream().map(LivreMapper::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Optional<LivreDTO> byId(@PathVariable Long id) {
        return service.getById(id).map(LivreMapper::toDTO);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LivreDTO create(@RequestBody LivreCreateDTO dto) {
        Livre l = new Livre();
        l.setTitre(dto.titre());
        l.setIsbn(dto.isbn());
        l.setDatePublication(dto.datePublication());
        l.setLangue(dto.langue());
        l.setNbPages(dto.nbPages());
        l.setNbExemplaires(dto.nbExemplaires());
        l.setDescription(dto.description());

        if (dto.auteurId() != null) {
            Auteur a = new Auteur();
            a.setId(dto.auteurId());
            l.setAuteur(a);
        }

        if (dto.categorieId() != null) {
            Categorie c = new Categorie();
            c.setId(dto.categorieId());
            l.setCategorie(c);
        }

        if (dto.cover() != null && !dto.cover().isBlank()) {
            l.setCover(dto.cover());
        } else {
            l.setCover("http://localhost:3000/covers/default.png");
        }

        return LivreMapper.toDTO(service.save(l));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LivreDTO update(@PathVariable Long id, @RequestBody LivreCreateDTO dto) {
        Livre l = service.getById(id).orElseThrow(() -> new RuntimeException("Livre non trouvé"));
        l.setTitre(dto.titre());
        l.setIsbn(dto.isbn());
        l.setDatePublication(dto.datePublication());
        l.setLangue(dto.langue());
        l.setNbPages(dto.nbPages());
        l.setNbExemplaires(dto.nbExemplaires());
        l.setDescription(dto.description());

        if (dto.auteurId() != null) {
            Auteur a = new Auteur();
            a.setId(dto.auteurId());
            l.setAuteur(a);
        }
        if (dto.categorieId() != null) {
            Categorie c = new Categorie();
            c.setId(dto.categorieId());
            l.setCategorie(c);
        }
        if (dto.cover() != null && !dto.cover().isBlank()) {
            l.setCover(dto.cover());
        }

        return LivreMapper.toDTO(service.save(l));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/user/status")
    public Map<String, Boolean> getUserStatus(Principal principal) {
        boolean isLoggedIn = principal != null;
        return Map.of("isLoggedIn", isLoggedIn);
    }

    @GetMapping("/categorie/{categorieId}")
    public List<LivreDTO> getLivresByCategorie(@PathVariable Long categorieId) {
        return service.getByCategorie(categorieId)
                .stream()
                .map(LivreMapper::toDTO)
                .toList();
    }
}