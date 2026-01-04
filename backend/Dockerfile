# ===== Image de base =====
FROM eclipse-temurin:17-jdk

# ===== Installer Maven =====
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# ===== Créer le dossier de travail =====
WORKDIR /app

# ===== Copier tout le backend =====
COPY . .

# ===== Build du projet Spring Boot =====
RUN mvn clean package -DskipTests

# ===== Vérifier le jar généré (optionnel pour debug) =====
RUN ls -l target/

# ===== Exposer le port Spring Boot =====
EXPOSE 8080

# ===== Lancer l'application avec le profil "demo" =====
CMD ["sh", "-c", "java -jar target/$(ls target | grep SNAPSHOT.jar | head -n 1) --spring.profiles.active=demo"]
