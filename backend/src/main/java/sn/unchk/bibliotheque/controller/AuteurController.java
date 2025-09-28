package sn.unchk.bibliotheque.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sn.unchk.bibliotheque.dto.AuteurCreateDTO;
import sn.unchk.bibliotheque.dto.AuteurDTO;
import sn.unchk.bibliotheque.dto.LivreDTO;
import sn.unchk.bibliotheque.entity.Auteur;
import sn.unchk.bibliotheque.service.AuteurService;

import java.util.List;

@RestController
@RequestMapping("/api/auteurs")
@CrossOrigin(origins = "*")
public class AuteurController {
    private final AuteurService service;

    public AuteurController(AuteurService service) {
        this.service = service;
    }

    // ✅ Récupérer tous les auteurs
    @GetMapping
    public ResponseEntity<List<AuteurDTO>> getAllAuteurs() {
        try {
            List<AuteurDTO> auteurs = service.getAll().stream()
                    .map(auteur -> new AuteurDTO(
                            auteur.getId(),
                            auteur.getNomComplet(),
                            auteur.getNationalite(),
                            auteur.getBiographie(),
                            auteur.getDateNaissance(),
                            auteur.getDateDeces(),
                            auteur.getCreePar() != null ? auteur.getCreePar().getId() : null,
                            auteur.getLivres() != null ? auteur.getLivres().size() : 0
                    ))
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(auteurs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Récupérer un auteur par ID (CORRIGÉ)
    @GetMapping("/{id}")
    public ResponseEntity<AuteurDTO> getAuteurById(@PathVariable Long id) {
        try {
            Auteur auteur = service.findById(id); // Maintenant retourne Auteur directement

            AuteurDTO dto = new AuteurDTO(
                    auteur.getId(),
                    auteur.getNomComplet(),
                    auteur.getNationalite(),
                    auteur.getBiographie(),
                    auteur.getDateNaissance(),
                    auteur.getDateDeces(),
                    auteur.getCreePar() != null ? auteur.getCreePar().getId() : null,
                    auteur.getLivres() != null ? auteur.getLivres().size() : 0
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Récupérer les livres d'un auteur
    @GetMapping("/{id}/livres")
    public ResponseEntity<List<LivreDTO>> getLivresByAuteur(@PathVariable Long id) {
        try {
            List<LivreDTO> livres = service.getLivresByAuteur(id);
            return ResponseEntity.ok(livres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Créer un nouvel auteur (Admin seulement)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAuteur(@RequestBody AuteurCreateDTO dto, Authentication authentication) {
        try {
            Auteur auteur = new Auteur();
            auteur.setNomComplet(dto.nomComplet());
            auteur.setNationalite(dto.nationalite());
            auteur.setBiographie(dto.biographie());
            auteur.setDateNaissance(dto.dateNaissance());
            auteur.setDateDeces(dto.dateDeces());

            Auteur auteurCree = service.save(auteur);

            AuteurDTO responseDTO = new AuteurDTO(
                    auteurCree.getId(),
                    auteurCree.getNomComplet(),
                    auteurCree.getNationalite(),
                    auteurCree.getBiographie(),
                    auteurCree.getDateNaissance(),
                    auteurCree.getDateDeces(),
                    auteurCree.getCreePar() != null ? auteurCree.getCreePar().getId() : null,
                    auteurCree.getLivres() != null ? auteurCree.getLivres().size() : 0
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_CREATION", "Erreur lors de la création de l'auteur: " + e.getMessage()));
        }
    }

    // ✅ Mettre à jour un auteur (Admin seulement - CORRIGÉ)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAuteur(@PathVariable Long id, @RequestBody AuteurCreateDTO dto) {
        try {
            Auteur auteurExist = service.findById(id); // Maintenant retourne Auteur directement

            auteurExist.setNomComplet(dto.nomComplet());
            auteurExist.setNationalite(dto.nationalite());
            auteurExist.setBiographie(dto.biographie());
            auteurExist.setDateNaissance(dto.dateNaissance());
            auteurExist.setDateDeces(dto.dateDeces());

            Auteur auteurModifie = service.save(auteurExist);

            AuteurDTO responseDTO = new AuteurDTO(
                    auteurModifie.getId(),
                    auteurModifie.getNomComplet(),
                    auteurModifie.getNationalite(),
                    auteurModifie.getBiographie(),
                    auteurModifie.getDateNaissance(),
                    auteurModifie.getDateDeces(),
                    auteurModifie.getCreePar() != null ? auteurModifie.getCreePar().getId() : null,
                    auteurModifie.getLivres() != null ? auteurModifie.getLivres().size() : 0
            );

            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("AUTEUR_NON_TROUVE", "Auteur non trouvé avec l'ID : " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_MODIFICATION", "Erreur lors de la modification de l'auteur"));
        }
    }

    // ✅ Supprimer un auteur (Admin seulement - CORRIGÉ)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAuteur(@PathVariable Long id) {
        try {
            // Vérifier que l'auteur existe
            service.findById(id); // Lance une exception si non trouvé

            service.delete(id);
            return ResponseEntity.ok()
                    .body(new SuccessResponse("AUTEUR_SUPPRIME", "Auteur supprimé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("AUTEUR_NON_TROUVE", "Auteur non trouvé avec l'ID : " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_SUPPRESSION", "Erreur lors de la suppression de l'auteur"));
        }
    }

    // ✅ Classes pour les réponses standardisées
    public static class ErrorResponse {
        private String code;
        private String message;

        public ErrorResponse(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class SuccessResponse {
        private String code;
        private String message;

        public SuccessResponse(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}