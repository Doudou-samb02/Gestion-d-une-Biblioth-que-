package sn.unchk.bibliotheque.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;



    @RestController
    @RequestMapping("/api/upload")
    public class UploadController {

        // ⚠️ chemin absolu vers ton frontend/public/covers/
        private final String UPLOAD_DIR = "C:/Users/user/Documents/MASTER 1/Projet Operationnel/Gestion-d-une-Biblioth-que-/frontend/startup-nextjs-main/public/covers";

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
            try {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // nom unique
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR, fileName);
                Files.write(filePath, file.getBytes());

                // retourne l’URL publique exposée par Next.js frontend (port 3000)
                String fileUrl = "http://localhost:3000/covers/" + fileName;
                return ResponseEntity.ok(fileUrl);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erreur lors de l’upload du fichier");
            }
        }
    }

