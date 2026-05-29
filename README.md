# App_phenix
# 📚 Le Phénix - Gestion de Centre de Soutien Scolaire

## 🚀 Description du projet

**Le Phénix** est une application web de gestion d’un centre de soutien scolaire développée avec **React.js**, **Node.js** et **MySQL**.
Elle permet de gérer efficacement les étudiants, les enseignants, les cours, les inscriptions et le suivi pédagogique.

---

## 🧩 Fonctionnalités principales

* 👨‍🎓 Gestion des étudiants (inscription, modification, suppression)
* 👨‍🏫 Gestion des enseignants
* 📚 Gestion des cours et matières
* 🗓️ Planification des séances de cours
* 📊 Suivi des performances des étudiants
* 🔐 Authentification (admin / utilisateur)
* 💾 Base de données MySQL sécurisée

---

## 🛠️ Technologies utilisées

### Frontend

* React.js
* Axios
* React Router
* Tailwind CSS / Bootstrap (si utilisé)

### Backend

* Node.js
* Express.js
* JWT (authentification)
* bcrypt (sécurité des mots de passe)

### Base de données

* MySQL

---

## 📁 Structure du projet

```
App_phenix/
│
├── client/          # Frontend React
├── server/          # Backend Node.js / Express
├── database/        # Scripts SQL
└── README.md
```

---

## ⚙️ Installation du projet

### 1. Cloner le dépôt

```bash
git clone git@github.com:Abdoulraman/App_phenix.git
cd App_phenix
```

---

### 2. Backend (Node.js)

```bash
cd server
npm install
npm start
```

---

### 3. Frontend (React.js)

```bash
cd client
npm install
npm start
```

---

### 4. Base de données (MySQL)

* Créer une base de données :

```sql
CREATE DATABASE phenix_db;
```

* Importer le fichier SQL situé dans `/database`

---

## 🔐 Configuration environnement (.env)

Créer un fichier `.env` dans `/server` :

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=phenix_db
JWT_SECRET=secret_key
```

---

## 📸 Aperçu du projet

*(Ajouter ici des captures d’écran de ton application)*

---

## 👨‍💻 Auteur

* **Nom** : Abdoulraman Mouchigam
* GitHub : Abdoulraman
* Projet : Le Phénix - Gestion de centre de soutien scolaire

---

## 📌 Objectif

Ce projet vise à digitaliser et optimiser la gestion des centres de soutien scolaire afin de faciliter le suivi des étudiants et l’organisation des cours.

---

## 📜 Licence

Ce projet est open-source à des fins éducatives.

