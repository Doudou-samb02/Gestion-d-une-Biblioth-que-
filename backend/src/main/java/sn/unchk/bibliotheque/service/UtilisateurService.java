package sn.unchk.bibliotheque.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // Pour hasher le mot de passe
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Utilisateur inscrire(Utilisateur utilisateur) {
        if (utilisateurRepository.findByEmail(utilisateur.getEmail()) != null) {
            throw new RuntimeException("Email déjà utilisé !");
        }
        utilisateur.setRole("USER");

        // Hasher le mot de passe avant de sauvegarder
        String hashedPassword = passwordEncoder.encode(utilisateur.getMotDePasse());
        utilisateur.setMotDePasse(hashedPassword);

        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur connexion(String email, String motDePasse) {
        Utilisateur user = utilisateurRepository.findByEmail(email);
        if (user == null) {
            return null; // utilisateur non trouvé
        }

        // Vérifier le mot de passe (comparaison avec hash)
        if (!passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
            return null; // mot de passe incorrect
        }

        return user; // connexion réussie
    }
}
