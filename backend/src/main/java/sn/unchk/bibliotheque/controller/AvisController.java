package sn.unchk.bibliotheque.controller;

import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.AvisDTO;
import sn.unchk.bibliotheque.service.AvisService;

import java.util.List;

@RestController
@RequestMapping("/api/livres")
@CrossOrigin
public class AvisController {

    private final AvisService avisService;

    public AvisController(AvisService avisService) {
        this.avisService = avisService;
    }

    @GetMapping("/{livreId}/avis")
    public List<AvisDTO> getAvisByLivre(@PathVariable Long livreId) {
        return avisService.getAvisByLivre(livreId);
    }
}
