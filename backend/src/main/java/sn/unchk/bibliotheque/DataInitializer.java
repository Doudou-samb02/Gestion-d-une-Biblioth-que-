package sn.unchk.bibliotheque;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import sn.unchk.bibliotheque.entity.*;
import sn.unchk.bibliotheque.repository.*;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UtilisateurRepository utilisateurRepository,
                               AuteurRepository auteurRepository,
                               CategorieRepository categorieRepository,
                               LivreRepository livreRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // ✅ Admin par défaut
            boolean adminExists = utilisateurRepository.findAll().stream().anyMatch(u -> u.getRole() == Role.ADMIN);
            if (!adminExists) {
                Utilisateur admin = new Utilisateur();
                admin.setNom("Admin");
                admin.setEmail("admin@lib.sn");
                admin.setPassword(passwordEncoder.encode("passer"));
                admin.setRole(Role.ADMIN);
                utilisateurRepository.save(admin);
                System.out.println("✅ Admin par défaut créé : admin@lib.sn / passer");
            }

            // ✅ Lecteurs
            if (utilisateurRepository.findAll().stream().noneMatch(u -> u.getRole() == Role.LECTEUR)) {
                Utilisateur lecteur1 = new Utilisateur();
                lecteur1.setNom("Mamadou");
                lecteur1.setEmail("mamadou@lib.sn");
                lecteur1.setPassword(passwordEncoder.encode("passer"));
                lecteur1.setRole(Role.LECTEUR);

                Utilisateur lecteur2 = new Utilisateur();
                lecteur2.setNom("Awa");
                lecteur2.setEmail("awa@lib.sn");
                lecteur2.setPassword(passwordEncoder.encode("passer"));
                lecteur2.setRole(Role.LECTEUR);

                utilisateurRepository.saveAll(List.of(lecteur1, lecteur2));
                System.out.println("✅ Lecteurs par défaut créés");
            }

            // ✅ Catégories
            if (categorieRepository.count() == 0) {
                Categorie roman = new Categorie();
                roman.setNom("Roman");

                Categorie science = new Categorie();
                science.setNom("Science");

                Categorie philosophie = new Categorie();
                philosophie.setNom("Philosophie");

                categorieRepository.saveAll(List.of(roman, science, philosophie));
                System.out.println("✅ Catégories créées");
            }

            // ✅ Auteurs
            if (auteurRepository.count() == 0) {
                Auteur coelho = new Auteur();
                coelho.setNom("Paulo Coelho");

                Auteur orwell = new Auteur();
                orwell.setNom("George Orwell");

                Auteur exupery = new Auteur();
                exupery.setNom("Antoine de Saint-Exupéry");

                auteurRepository.saveAll(List.of(coelho, orwell, exupery));
                System.out.println("✅ Auteurs créés");
            }

            // ✅ Livres
            if (livreRepository.count() == 0) {
                // Récupération sécurisée des auteurs
                Auteur coelho = auteurRepository.findByNom("Paulo Coelho")
                        .orElseThrow(() -> new RuntimeException("Auteur Paulo Coelho non trouvé"));
                Auteur orwell = auteurRepository.findByNom("George Orwell")
                        .orElseThrow(() -> new RuntimeException("Auteur George Orwell non trouvé"));
                Auteur exupery = auteurRepository.findByNom("Antoine de Saint-Exupéry")
                        .orElseThrow(() -> new RuntimeException("Auteur Antoine de Saint-Exupéry non trouvé"));

                // Récupération sécurisée de la catégorie
                Categorie roman = categorieRepository.findByNom("Roman")
                        .orElseThrow(() -> new RuntimeException("Catégorie Roman non trouvée"));

                // Création des livres
                Livre l1 = new Livre();
                l1.setTitre("L'Alchimiste");
                l1.setIsbn("ISBN-111");
                l1.setDatePublication(LocalDate.of(1988, 1, 1));
                l1.setAuteur(coelho);
                l1.setCategorie(roman);
                l1.setCover("/covers/alchimiste.jpg");
                l1.setDisponible(true);

                Livre l2 = new Livre();
                l2.setTitre("1984");
                l2.setIsbn("ISBN-222");
                l2.setDatePublication(LocalDate.of(1949, 1, 1));
                l2.setAuteur(orwell);
                l2.setCategorie(roman);
                l2.setCover("/covers/1984.jpg");
                l2.setDisponible(true);

                Livre l3 = new Livre();
                l3.setTitre("Le Petit Prince");
                l3.setIsbn("ISBN-333");
                l3.setDatePublication(LocalDate.of(1943, 1, 1));
                l3.setAuteur(exupery);
                l3.setCategorie(roman);
                l3.setCover("/covers/petitprince.jpg");
                l3.setDisponible(true);

                // Sauvegarde
                livreRepository.saveAll(List.of(l1, l2, l3));
                System.out.println("✅ Livres créés");
            }

        };
    }
}
