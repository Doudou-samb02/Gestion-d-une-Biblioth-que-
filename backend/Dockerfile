# Image OpenJDK 17 officielle
FROM eclipse-temurin:17-jdk

# Installer Maven
RUN apt-get update && apt-get install -y maven

# Crée un dossier pour l'app
WORKDIR /app

# Copie tout le backend
COPY . .

# Build et renommer le .jar pour éviter les accents
RUN mvn clean package -DskipTests \
    && mv target/bibliotheque-0.0.1-SNAPSHOT.jar.original target/bibliotheque-demo.jar

# Expose le port Spring Boot par défaut
EXPOSE 8080

# Lancer le jar avec le profil "demo" (H2)
CMD ["java", "-jar", "target/bibliotheque-demo.jar", "--spring.profiles.active=demo"]
