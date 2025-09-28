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
                               EmpruntRepository empruntRepository,
                               AvisRepository avisRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {

            // ==========================
            // Utilisateurs
            // ==========================
            if (utilisateurRepository.findAll().stream().noneMatch(u -> u.getRole() == Role.ADMIN)) {
                Utilisateur admin = new Utilisateur();
                admin.setNomComplet("Admin");
                admin.setEmail("admin@lib.sn");
                admin.setPassword(passwordEncoder.encode("passer"));
                admin.setRole(Role.ADMIN);
                admin.setActif(true);
                admin.setDateNaissance(LocalDate.of(1980, 1, 1));
                admin.setDateInscription(LocalDate.now());
                utilisateurRepository.save(admin);
                System.out.println("✅ Admin créé : admin@lib.sn / passer");
            }

            if (utilisateurRepository.findAll().stream().noneMatch(u -> u.getRole() == Role.LECTEUR)) {
                Utilisateur lecteur1 = new Utilisateur();
                lecteur1.setNomComplet("Mamadou");
                lecteur1.setEmail("mamadou@lib.sn");
                lecteur1.setPassword(passwordEncoder.encode("passer"));
                lecteur1.setRole(Role.LECTEUR);
                lecteur1.setActif(true);
                lecteur1.setDateNaissance(LocalDate.of(1995, 5, 10));
                lecteur1.setDateInscription(LocalDate.now());

                Utilisateur lecteur2 = new Utilisateur();
                lecteur2.setNomComplet("Awa");
                lecteur2.setEmail("awa@lib.sn");
                lecteur2.setPassword(passwordEncoder.encode("passer"));
                lecteur2.setRole(Role.LECTEUR);
                lecteur2.setActif(true);
                lecteur2.setDateNaissance(LocalDate.of(1997, 8, 20));
                lecteur2.setDateInscription(LocalDate.now());

                utilisateurRepository.saveAll(List.of(lecteur1, lecteur2));
                System.out.println("✅ Lecteurs créés");
            }

            // ==========================
            // Catégories
            // ==========================
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

            // ==========================
            // Auteurs
            // ==========================
            if (auteurRepository.count() == 0) {
                Utilisateur creePar = utilisateurRepository.findAll().stream().findFirst().orElseThrow();

                Auteur coelho = new Auteur();
                coelho.setNomComplet("Paulo Coelho");
                coelho.setNationalite("Brésilienne");
                coelho.setBiographie("Paulo Coelho est un écrivain brésilien célèbre pour L'Alchimiste.");
                coelho.setDateNaissance(LocalDate.of(1947, 8, 24));
                coelho.setDateDeces(null);
                coelho.setCreePar(creePar);

                Auteur orwell = new Auteur();
                orwell.setNomComplet("George Orwell");
                orwell.setNationalite("Britannique");
                orwell.setBiographie("George Orwell est célèbre pour 1984 et La Ferme des animaux.");
                orwell.setDateNaissance(LocalDate.of(1903, 6, 25));
                orwell.setDateDeces(LocalDate.of(1950, 1, 21));
                orwell.setCreePar(creePar);

                Auteur exupery = new Auteur();
                exupery.setNomComplet("Antoine de Saint-Exupéry");
                exupery.setNationalite("Française");
                exupery.setBiographie("Auteur du Petit Prince, pilote et écrivain français.");
                exupery.setDateNaissance(LocalDate.of(1900, 6, 29));
                exupery.setDateDeces(LocalDate.of(1944, 7, 31));
                exupery.setCreePar(creePar);

                auteurRepository.saveAll(List.of(coelho, orwell, exupery));
                System.out.println("✅ Auteurs créés");
            }

            // ==========================
            // Livres
            // ==========================
            if (livreRepository.count() == 0) {
                Auteur coelho = auteurRepository.findByNomComplet("Paulo Coelho").orElseThrow();
                Auteur orwell = auteurRepository.findByNomComplet("George Orwell").orElseThrow();
                Auteur exupery = auteurRepository.findByNomComplet("Antoine de Saint-Exupéry").orElseThrow();

                Categorie roman = categorieRepository.findByNom("Roman").orElseThrow();

                Livre l1 = new Livre();
                l1.setTitre("L'Alchimiste");
                l1.setIsbn("ISBN-111");
                l1.setDatePublication(LocalDate.of(1988, 1, 1));
                l1.setLangue("Portugais");
                l1.setNbPages(208);
                l1.setNbExemplaires(10);
                l1.setDescription("Un jeune berger part à la recherche de son rêve et découvre la sagesse de la vie.");
                l1.setCover("/covers/alchimiste.jpg");
                l1.setAuteur(coelho);
                l1.setCategorie(roman);

                Livre l2 = new Livre();
                l2.setTitre("1984");
                l2.setIsbn("ISBN-222");
                l2.setDatePublication(LocalDate.of(1949, 1, 1));
                l2.setLangue("Anglais");
                l2.setNbPages(328);
                l2.setNbExemplaires(5);
                l2.setDescription("Roman dystopique décrivant un État totalitaire omniprésent.");
                l2.setCover("/covers/1984.jpg");
                l2.setAuteur(orwell);
                l2.setCategorie(roman);

                Livre l3 = new Livre();
                l3.setTitre("Le Petit Prince");
                l3.setIsbn("ISBN-333");
                l3.setDatePublication(LocalDate.of(1943, 1, 1));
                l3.setLangue("Français");
                l3.setNbPages(96);
                l3.setNbExemplaires(7);
                l3.setDescription("Conte philosophique et poétique pour enfants et adultes.");
                l3.setCover("/covers/petitprince.jpg");
                l3.setAuteur(exupery);
                l3.setCategorie(roman);

                livreRepository.saveAll(List.of(l1, l2, l3));
                System.out.println("✅ Livres créés");
            }

            // ==========================
// Emprunts
// ==========================
            if (empruntRepository.count() == 0) {
                Utilisateur mamadou = utilisateurRepository.findByEmail("mamadou@lib.sn").orElseThrow();
                Utilisateur awa = utilisateurRepository.findByEmail("awa@lib.sn").orElseThrow();

                Livre alchimiste = livreRepository.findByIsbn("ISBN-111").orElseThrow();
                Livre petitPrince = livreRepository.findByIsbn("ISBN-333").orElseThrow();

                Emprunt e1 = new Emprunt();
                e1.setUtilisateur(mamadou);
                e1.setLivre(alchimiste);
                e1.setDateEmprunt(LocalDate.now().minusDays(5));
                e1.setDateLimiteRetour(LocalDate.now().plusDays(10));
                e1.setDateRetour(null);

                Emprunt e2 = new Emprunt();
                e2.setUtilisateur(awa);
                e2.setLivre(petitPrince);
                e2.setDateEmprunt(LocalDate.now().minusDays(2));
                e2.setDateLimiteRetour(LocalDate.now().plusDays(12));
                e2.setDateRetour(null);

                empruntRepository.saveAll(List.of(e1, e2));
                System.out.println("✅ Emprunts créés");
            }

// ==========================
// Avis
// ==========================
            if (avisRepository.count() == 0) {
                Utilisateur mamadou = utilisateurRepository.findByEmail("mamadou@lib.sn").orElseThrow();
                Utilisateur awa = utilisateurRepository.findByEmail("awa@lib.sn").orElseThrow();

                Livre alchimiste = livreRepository.findByIsbn("ISBN-111").orElseThrow();
                Livre petitPrince = livreRepository.findByIsbn("ISBN-333").orElseThrow();
                Livre orwell1984 = livreRepository.findByIsbn("ISBN-222").orElseThrow();

                Avis avis1 = new Avis(null, alchimiste, mamadou, 5,
                        "J'ai adoré ce livre, très inspirant !", LocalDate.now().minusDays(1));

                Avis avis2 = new Avis(null, petitPrince, awa, 4,
                        "Conte magnifique pour enfants et adultes.", LocalDate.now());

                Avis avis3 = new Avis(null, orwell1984, mamadou, 5,
                        "Un classique incontournable, encore d’actualité !", LocalDate.now().minusDays(3));

                Avis avis4 = new Avis(null, petitPrince, mamadou, 3,
                        "Sympa, mais un peu trop poétique pour moi.", LocalDate.now().minusDays(2));

                avisRepository.saveAll(List.of(avis1, avis2, avis3, avis4));
                System.out.println("✅ Avis créés");
            }



        };
    }
}
