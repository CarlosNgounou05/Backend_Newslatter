# 📧 Backend Newsletter System

> Un système de gestion de newsletter robuste et sécurisé, conçu pour gérer des abonnements et la diffusion de contenus exclusifs.

Ce projet est une API REST complète permettant de gérer des utilisateurs, des abonnements (gratuit/payant) et des publications avec une gestion fine des permissions.

---

## ✨ Fonctionnalités Clés

- 🔐 **Authentification Sécurisée** : Inscription et connexion avec JWT (JSON Web Tokens) et hachage de mots de passe via `bcrypt`.
- 👥 **Gestion des Rôles** : Distinction entre les administrateurs et les abonnés.
- 💳 **Système d'Abonnement** : Protection automatique du contenu "Premium" pour les utilisateurs non payants.
- 📝 **Gestion des Posts (CRUD)** : Création, lecture, mise à jour et suppression de newsletter.
- 🗄️ **Base de Données Relationnelle** : Utilisation de PostgreSQL pour une intégrité maximale des données.

---

## 🛠️ Stack Technique

- **Runtime** : [Node.js](https://nodejs.org/)
- **Framework** : [Express.js](https://expressjs.com/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/)
- **Authentification** : [JWT](https://jwt.io/)
- **Client DB** : [pg (node-postgres)](https://node-postgres.com/)

---

## � Installation & Démarrage

### 1. Cloner le dépôt
```bash
git clone <URL_DU_REPO>
cd backend-newsletter
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement ⚙️
Créez un fichier `.env` à la racine en vous basant sur `.env.example` :
```env
PORT=3000
DB_USER=votre_user
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=newsletter_db
JWT_SECRET=un_secret_tres_robuste
```

### 4. Initialiser la Base de Données 💾
Assurez-vous que PostgreSQL est installé, puis exécutez le script pour créer les tables automatiquement :
```bash
psql -U votre_user -d newsletter_db -f database/schema.sql
```

### 5. Lancer l'application 🏃
```bash
# Mode développement (avec auto-reload si configuré)
npm run dev
```

---

## 🧪 Tests de l'API

Le projet inclut un fichier de tests prêt à l'emploi.
- 📂 Fichier : `src/requests/newslatter.rest`
- 💡 Utilisation : Installez l'extension **REST Client** dans VS Code pour exécuter les requêtes directement depuis l'éditeur.

---

## 📁 Architecture du Projet

```text
├── database/           # Scripts SQL (Initialisation DB)
├── src/
│   ├── config/         # Configuration (DB, etc.)
│   ├── controllers/    # Logique de traitement des entrées
│   ├── middlewares/    # Authentification & Gestion d'erreurs
│   ├── routes/         # Définition des points d'entrée API
│   ├── services/       # Logique métier & Requêtes DB
│   ├── utils/          # Fonctions utilitaires (Tokens, etc.)
│   └── server.js       # Point d'entrée de l'application
└── README.md           # Documentation
```
