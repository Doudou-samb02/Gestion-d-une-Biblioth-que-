# Utilise une image OpenJDK
FROM openjdk:17-jdk-alpine

# Crée un dossier pour l'app
WORKDIR /app

# Copie le pom + code
COPY . .

# Build le projet
RUN ./mvnw clean package -DskipTests

# Expose le port
EXPOSE 8080

# Commande pour lancer le jar (remplace par ton jar exact)
CMD ["java", "-jar", "target/Gestion-d-une-Bibliothèque-0.0.1-SNAPSHOT.jar"]
