package sn.unchk.bibliotheque.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.service.UtilisateurService;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/inscription")
    public ResponseEntity<?> inscription(@RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur savedUser = utilisateurService.inscrire(utilisateur);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody Utilisateur utilisateur) {
        Utilisateur user = utilisateurService.connexion(utilisateur.getEmail(), utilisateur.getMotDePasse());
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email ou mot de passe incorrect");
        }
        return ResponseEntity.ok("Connexion réussie : Bienvenue " + user.getNom()); 
    }
}
