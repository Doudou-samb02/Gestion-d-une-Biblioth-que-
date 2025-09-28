# Gestion-d-une-Biblioth-que-

Ce projet est une application web composée de :
- **Backend** : Spring Boot
- **Frontend Client** : Next.js
- **Frontend Admin** : Next.js

---

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :
- Java 17+ (pour Spring Boot)
- Maven
- Node.js 18+ (pour Next.js)
- npm ou yarn

---

## Structure du projet

/Gestion-d-une-Biblioth-que--main
/backend -> Application Spring Boot
/frontend/startup-nextjs-main -> Application Next.js pour les utilisateurs
/frontend-admin/frontend-admin -> Application Next.js pour l'administration

## Lancer le projet

### 1. Backend (Spring Boot)

1. Ouvrir un terminal dans le dossier `backend`.
2. Lancer la commande Maven pour démarrer l'application :
-mvn clean install
-puis mvn srping-boot:run

### 2. Frontend (next js)

1. Ouvrir un terminal dans le dossier `frontend/startup-nextjs-main`.
2. Lancer la commande  pour démarrer l'application :
-npm install
-puis npm run dev

### 3. Frontend-admin (next js)

1. Ouvrir un terminal dans le dossier `frontend-admin/frontend-admin`.
2. Lancer la commande  pour démarrer l'application :
-npm install
-puis npm run dev


Assurez-vous que le backend est lancé avant de lancer les frontends pour que l'application fonctionne correctement.

Vous pouvez modifier les ports et configurations dans les fichiers .env ou application.properties selon vos besoins.


