package sn.unchk.bibliotheque.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.CategorieCreateDTO;
import sn.unchk.bibliotheque.dto.CategorieDTO;
import sn.unchk.bibliotheque.entity.Categorie;
import sn.unchk.bibliotheque.mapper.CategorieMapper;
import sn.unchk.bibliotheque.service.CategorieService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategorieController {
    private final CategorieService service;

    public CategorieController(CategorieService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategorieDTO> all() {
        return service.getAll().stream().map(CategorieMapper::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CategorieDTO create(@RequestBody CategorieCreateDTO dto) {
        Categorie c = new Categorie();
        c.setNom(dto.nom());
        return CategorieMapper.toDTO(service.save(c));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CategorieDTO update(@PathVariable Long id, @RequestBody CategorieCreateDTO dto) {
        Categorie c = new Categorie();
        c.setId(id);
        c.setNom(dto.nom());
        return CategorieMapper.toDTO(service.save(c));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
