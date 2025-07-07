# Yembal 2.0

Application Ruby on Rails pour les opportunités d'investissement au Sénégal.

## 📋 Description

Yembal est une plateforme web développée pour l'ADEPME permettant de découvrir et explorer les opportunités d'investissement industriel au Sénégal. Cette version 2.0 est une refonte complète avec des optimisations modernes.

## 🛠️ Technologies

- **Backend**: Ruby on Rails 7.2.1
- **Base de données**: SQLite (développement), PostgreSQL (production)
- **Frontend**: Stimulus, CSS moderne
- **Carte interactive**: Leaflet (prêt à intégrer)

## 🚀 Installation

### Prérequis
- Ruby 3.3.5
- Rails 7.2.1
- Bundler 2+

### Installation locale
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd yembal2

# Installer les dépendances
bundle install

# Configurer la base de données
bin/rails db:create
bin/rails db:migrate

# Démarrer le serveur
bin/rails server
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Structure du projet

```
yembal2/
├── app/
│   ├── controllers/     # Contrôleurs Rails
│   ├── models/         # Modèles (prêt pour Opportunity, Sector)
│   ├── views/          # Vues ERB
│   │   └── home/       # Pages principales
│   ├── assets/         # Ressources statiques
│   └── javascript/     # Contrôleurs Stimulus
├── config/             # Configuration Rails
├── db/                 # Migrations et schéma
└── public/             # Fichiers statiques (images, CSS, JS)
```

## 🎯 Fonctionnalités actuelles

- ✅ Page d'accueil avec header/footer
- ✅ Page "À propos" complète
- ✅ Structure Rails optimisée
- ✅ Configuration Stimulus
- ✅ Assets organisés (images, CSS, JS)

## 🚧 Fonctionnalités prévues

- [ ] Modèles Opportunity et Sector
- [ ] API REST pour les données
- [ ] Carte interactive Leaflet
- [ ] Système de filtres temps réel
- [ ] Import de données
- [ ] Recherche avancée

## 👥 Équipe

Développé pour l'ADEPME (Agence de Développement et d'Encadrement des Petites et Moyennes Entreprises) du Sénégal.

## 📄 Licence

Projet CONCREE pour la souveraineté économique du Sénégal.

---

**Contact**: CONCREE - Pour la souveraineté économique
