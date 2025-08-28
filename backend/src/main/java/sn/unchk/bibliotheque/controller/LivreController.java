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

import java.util.List;
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

        // 👇 cover URL
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
        Livre l = new Livre();
        l.setId(id);
        l.setTitre(dto.titre());
        l.setIsbn(dto.isbn());
        l.setDatePublication(dto.datePublication());
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
        return LivreMapper.toDTO(service.save(l));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
