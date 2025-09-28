package sn.unchk.bibliotheque.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {
    private final UtilisateurRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> getAll() {
        return repo.findAll();
    }

    public Utilisateur findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    // ✅ MÉTHODE AJOUTÉE : Récupérer un utilisateur par son ID
    public Utilisateur findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));
    }

    // ✅ Méthode existante (à garder pour la compatibilité)
    public Optional<Utilisateur> getById(Long id) {
        return repo.findById(id);
    }

    public Utilisateur save(Utilisateur u) {
        // 🔒 Hachage du mot de passe avant sauvegarde
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        return repo.save(u);
    }

    // ✅ Mise à jour d'un utilisateur existant
    public Utilisateur update(Long id, Utilisateur updated) {
        Utilisateur existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        existing.setNomComplet(updated.getNomComplet());
        existing.setEmail(updated.getEmail());
        //existing.setAdresse(updated.getAdresse());

        // 🔐 Si mot de passe fourni et différent, on le re-hash
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            if (!updated.getPassword().startsWith("$2a$")) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            } else {
                existing.setPassword(updated.getPassword()); // déjà encodé
            }
        }

        existing.setRole(updated.getRole());
        return repo.save(existing);
    }

    // ✅ Update profil du user connecté (sans toucher au rôle)
    public Utilisateur updateSelf(String email, Utilisateur updated) {
        Utilisateur existing = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        existing.setNomComplet(updated.getNomComplet());
        existing.setEmail(updated.getEmail());
        //existing.setAdresse(updated.getAdresse());

        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            if (!updated.getPassword().startsWith("$2a$")) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            } else {
                existing.setPassword(updated.getPassword());
            }
        }

        // ❌ Pas de changement de rôle
        return repo.save(existing);
    }

    // ✅ SOLUTION 1 : Retourner boolean
    public boolean delete(Long id) {
        try {
            if (!repo.existsById(id)) {
                return false; // Utilisateur non trouvé
            }

            repo.deleteById(id);
            return true; // Suppression réussie

        } catch (Exception e) {
            // Log l'erreur
            System.err.println("Erreur lors de la suppression: " + e.getMessage());
            return false;
        }
    }
}