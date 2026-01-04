# ==========================
# Image officielle OpenJDK 17
# ==========================
FROM eclipse-temurin:17-jdk

# Installer Maven
RUN apt-get update && apt-get install -y maven

# Crée un dossier pour l'app
WORKDIR /app

# Copie tout le backend dans le container
COPY . .

# Build du projet Spring Boot (skip tests pour aller plus vite)
RUN mvn clean package -DskipTests

# Expose le port Spring Boot par défaut
EXPOSE 8080

# Lancer le jar avec le profil "demo"
CMD ["sh", "-c", "java -jar target/'Gestion-d-une-Bibliothèque-0.0.1-SNAPSHOT.jar' --spring.profiles.active=demo"]
