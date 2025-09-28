// Dans UtilisateurController.java - Remplacer le code existant
package sn.unchk.bibliotheque.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    // ✅ Récupérer tous les utilisateurs (Admin seulement)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        try {
            List<UtilisateurDTO> utilisateurs = service.getAll()
                    .stream()
                    .map(UtilisateurMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(utilisateurs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUtilisateurById(@PathVariable Long id) {
        try {
            Utilisateur utilisateur = service.findById(id);
            if (utilisateur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("UTILISATEUR_NON_TROUVE", "Utilisateur non trouvé avec l'ID : " + id));
            }
            return ResponseEntity.ok(UtilisateurMapper.toDTO(utilisateur));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_SERVEUR", "Erreur lors de la récupération de l'utilisateur"));
        }
    }

    // ✅ Récupérer le profil de l'utilisateur connecté
    @GetMapping("/me")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public ResponseEntity<?> getMonProfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                throw new AccessDeniedException("Utilisateur non authentifié");
            }

            Utilisateur utilisateur = service.findByEmail(userDetails.getUsername());
            if (utilisateur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("PROFIL_NON_TROUVE", "Profil utilisateur non trouvé"));
            }

            return ResponseEntity.ok(UtilisateurMapper.toDTO(utilisateur));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("NON_AUTHENTIFIE", "Authentification requise"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_SERVEUR", "Erreur lors de la récupération du profil"));
        }
    }

    // ✅ Créer un nouvel utilisateur (Admin seulement)
    @PostMapping
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> creerUtilisateur(@RequestBody Utilisateur utilisateur) {
        try {
            if (service.findByEmail(utilisateur.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ErrorResponse("EMAIL_EXISTANT", "Un utilisateur avec cet email existe déjà"));
            }

            Utilisateur utilisateurCree = service.save(utilisateur);
            return ResponseEntity.status(HttpStatus.CREATED).body(UtilisateurMapper.toDTO(utilisateurCree));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_CREATION", "Erreur lors de la création de l'utilisateur: " + e.getMessage()));
        }
    }

    // ✅ Mettre à jour un utilisateur (Admin seulement)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> modifierUtilisateur(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur utilisateurModifie = service.update(id, utilisateur);
            if (utilisateurModifie == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("UTILISATEUR_NON_TROUVE", "Utilisateur non trouvé avec l'ID : " + id));
            }
            return ResponseEntity.ok(UtilisateurMapper.toDTO(utilisateurModifie));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_MODIFICATION", "Erreur lors de la modification de l'utilisateur"));
        }
    }

    // ✅ Mettre à jour son propre profil
    @PutMapping("/me/update")
    @PreAuthorize("hasRole('LECTEUR') or hasRole('ADMIN')")
    public ResponseEntity<?> modifierMonProfil(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody Utilisateur utilisateur) {
        try {
            if (userDetails == null) {
                throw new AccessDeniedException("Utilisateur non authentifié");
            }

            Utilisateur utilisateurModifie = service.updateSelf(userDetails.getUsername(), utilisateur);
            if (utilisateurModifie == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("PROFIL_NON_TROUVE", "Profil utilisateur non trouvé"));
            }

            return ResponseEntity.ok(UtilisateurMapper.toDTO(utilisateurModifie));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("NON_AUTHENTIFIE", "Authentification requise"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_MODIFICATION", "Erreur lors de la modification du profil"));
        }
    }

    // ✅ Supprimer un utilisateur (Admin seulement)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerUtilisateur(@PathVariable Long id) {
        try {
            boolean supprime = service.delete(id);
            if (!supprime) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse("UTILISATEUR_NON_TROUVE", "Utilisateur non trouvé avec l'ID : " + id));
            }
            return ResponseEntity.ok().body(new SuccessResponse("UTILISATEUR_SUPPRIME", "Utilisateur supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("ERREUR_SUPPRESSION", "Erreur lors de la suppression de l'utilisateur"));
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

        // Getters et setters
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

        // Getters et setters
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}