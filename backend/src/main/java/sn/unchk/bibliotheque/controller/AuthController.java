package sn.unchk.bibliotheque.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;
import sn.unchk.bibliotheque.security.JwtUtil;
import sn.unchk.bibliotheque.mapper.UtilisateurMapper;
import sn.unchk.bibliotheque.dto.UtilisateurDTO;
import sn.unchk.bibliotheque.security.MyUserDetailsService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UtilisateurRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final MyUserDetailsService userDetailsService;

    public AuthController(UtilisateurRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          MyUserDetailsService userDetailsService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public UtilisateurDTO register(@RequestBody Utilisateur req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        req.setPassword(passwordEncoder.encode(req.getPassword()));
        if (req.getRole() == null)
            req.setRole(sn.unchk.bibliotheque.entity.Role.LECTEUR);

        Utilisateur saved = userRepo.save(req);
        return UtilisateurMapper.toDTO(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        // 1️⃣ Authentifie l'utilisateur
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(payload.get("email"), payload.get("password"))
        );

        // 2️⃣ Charge les détails de l'utilisateur
        UserDetails userDetails = userDetailsService.loadUserByUsername(payload.get("email"));

        // 3️⃣ Génère le token JWT
        String token = jwtUtil.generateToken(userDetails);

        // 4️⃣ Récupère l'utilisateur complet en BDD
        Utilisateur utilisateur = userRepo.findByEmail(payload.get("email"))
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 5️⃣ Retourne le token + infos utilisateur
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", UtilisateurMapper.toDTO(utilisateur)
        ));
    }

    // Vérifier l'utilisateur connecté
    @GetMapping("/me")
    public ResponseEntity<UtilisateurDTO> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName(); // username = email
        Utilisateur user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(UtilisateurMapper.toDTO(user));
    }

    // Déconnexion
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Ici on ne peut pas invalider le JWT côté serveur,
        // c'est au frontend de supprimer le token du stockage local.
        return ResponseEntity.ok("Déconnexion réussie");
    }
}
