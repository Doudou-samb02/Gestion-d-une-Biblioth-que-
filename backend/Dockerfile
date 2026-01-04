# Image OpenJDK 17 officielle
FROM eclipse-temurin:17-jdk

# Installer Maven
RUN apt-get update && apt-get install -y maven

# Crée un dossier pour l'app
WORKDIR /app

# Copie tout le backend
COPY . .

# Build du projet Spring Boot
RUN mvn clean package -DskipTests

# Expose le port Spring Boot par défaut
EXPOSE 8080

# Lancer le jar avec le profil "demo" (H2)
CMD ["java", "-jar", "target/Gestion-d-une-Bibliothèque-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=demo"]
