# ==========================
# Dockerfile pour Spring Boot avec H2 (démo)
# ==========================

# Utilise une image OpenJDK 17 légère et stable
FROM openjdk:17-jdk-slim

# Crée un dossier pour l'app
WORKDIR /app

# Copie tout le contenu du backend
COPY . .

# Rends le wrapper Maven exécutable
RUN chmod +x mvnw

# Build du projet (skip tests pour accélérer)
RUN ./mvnw clean package -DskipTests

# Expose le port Spring Boot par défaut
EXPOSE 8080

# Lance le jar avec le profil "demo" pour H2
CMD ["java", "-jar", "target/Gestion-d-une-Bibliothèque-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=demo"]
