# 📁 STRUCTURE DU PROJET

## Vue d'ensemble

Votre projet est maintenant prêt pour Podman ! Voici tous les fichiers et leur rôle :

```
processeur-bancaire-podman/
│
├── 📄 DEMARRAGE_RAPIDE.md       ← COMMENCEZ ICI ! Guide en 5 minutes
├── 📄 GUIDE_PODMAN.md            ← Documentation complète Podman
├── 📄 README.md                  ← Documentation du projet
│
├── 🐳 Dockerfile                 ← Instructions pour construire l'image
├── ⚙️  nginx.conf                ← Configuration du serveur web
├── 📋 .dockerignore              ← Fichiers à exclure du conteneur
├── 📋 .gitignore                 ← Fichiers à exclure de Git
│
├── 📦 package.json               ← Dépendances Node.js
├── ⚙️  vite.config.js            ← Configuration Vite
├── 🎨 tailwind.config.js         ← Configuration TailwindCSS
├── ⚙️  postcss.config.js         ← Configuration PostCSS
├── 📄 index.html                 ← Page HTML principale
│
├── 🔧 podman-manager.sh          ← Script de gestion (facilite tout !)
│
└── src/                          ← Code source de l'application
    ├── App.jsx                   ← Composant principal (votre processeur)
    ├── main.jsx                  ← Point d'entrée React
    └── index.css                 ← Styles CSS avec Tailwind
```

---

## 📚 Documentation - Quel fichier lire ?

### 🚀 Vous êtes pressé ?
→ **DEMARRAGE_RAPIDE.md** (5 minutes pour tout installer)

### 🔍 Vous voulez comprendre Podman ?
→ **GUIDE_PODMAN.md** (toutes les commandes expliquées)

### 📖 Vous voulez comprendre le code ?
→ **README.md** (architecture et technologies)

---

## 🎯 Fichiers clés à connaître

### 1️⃣ Dockerfile
**Rôle :** Définit comment construire votre application en conteneur
- Utilise Node.js pour compiler l'application
- Utilise Nginx pour servir les fichiers en production
- Optimisé pour la taille et la performance

### 2️⃣ src/App.jsx
**Rôle :** Votre application React complète
- Upload de fichiers PDF
- Appel à l'API Claude pour extraction
- Parsing des descriptifs
- Génération des CSV
- Interface utilisateur complète

### 3️⃣ podman-manager.sh
**Rôle :** Script qui simplifie toutes les opérations
- Menu interactif
- Construction automatique
- Gestion des logs
- Redémarrage facile

### 4️⃣ nginx.conf
**Rôle :** Configuration du serveur web
- Gestion des routes React (SPA)
- Compression gzip
- Cache des assets
- Headers de sécurité

---

## 🔧 Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| `package.json` | Dépendances npm (React, Tailwind, etc.) |
| `vite.config.js` | Configuration du build tool Vite |
| `tailwind.config.js` | Styles TailwindCSS |
| `postcss.config.js` | Traitement CSS |
| `.dockerignore` | Fichiers ignorés par Podman |
| `.gitignore` | Fichiers ignorés par Git |

---

## 📝 Workflow de développement

### Développement local (sans Podman)
```bash
npm install       # Installer les dépendances
npm run dev       # Lancer en mode dev (http://localhost:5173)
npm run build     # Compiler pour production
```

### Production avec Podman
```bash
./podman-manager.sh   # Utiliser le script (recommandé)
# OU
podman build -t processeur-bancaire:latest .
podman run -d -p 8080:80 --name processeur-bancaire processeur-bancaire:latest
```

---

## 🔄 Modifier l'application

### Vous voulez changer le code ?

1. **Modifiez** `src/App.jsx` (votre logique métier)
2. **Testez en local** avec `npm run dev`
3. **Reconstruisez** l'image Podman :
   ```bash
   ./podman-manager.sh
   # Choisir option 8 (Reconstruire complètement)
   ```

### Vous voulez changer le style ?

1. **Modifiez** `src/App.jsx` (classes Tailwind)
2. **OU modifiez** `src/index.css` (CSS personnalisé)
3. **Reconstruisez** comme ci-dessus

### Vous voulez changer le port ?

**Option 1 :** Modifier `podman-manager.sh`
```bash
PORT="9000"  # Ligne 15, changez 8080 en 9000
```

**Option 2 :** Commande manuelle
```bash
podman run -d -p 9000:80 --name processeur-bancaire processeur-bancaire:latest
```

---

## 🌐 Déploiement en production

### Option 1 : Serveur avec Podman
```bash
# Sur votre serveur
git clone [votre-repo]
cd processeur-bancaire-podman
podman build -t processeur-bancaire:latest .
podman run -d -p 80:80 --restart=always --name processeur-bancaire processeur-bancaire:latest
```

### Option 2 : Cloud (Vercel, Netlify)
```bash
# Pas besoin de Podman, juste :
npm run build
# Puis uploadez le dossier dist/
```

---

## 💾 Sauvegarder votre travail

### Avec Git
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [votre-repo]
git push -u origin main
```

### Image Podman
```bash
# Sauvegarder l'image
podman save -o processeur-bancaire.tar processeur-bancaire:latest

# Charger sur un autre ordinateur
podman load -i processeur-bancaire.tar
```

---

## 🎓 Prochaines étapes suggérées

### Niveau Débutant
- [ ] Tester l'application avec vos propres PDF
- [ ] Changer les couleurs dans `src/App.jsx`
- [ ] Modifier le titre de la page

### Niveau Intermédiaire
- [ ] Ajouter une page "À propos"
- [ ] Créer un historique des traitements
- [ ] Sauvegarder les résultats dans le navigateur

### Niveau Avancé
- [ ] Ajouter une base de données (PostgreSQL)
- [ ] Créer un backend API (Express, FastAPI)
- [ ] Ajouter l'authentification utilisateur
- [ ] Déployer sur un serveur cloud

---

## 🆘 Support

### Fichiers de diagnostic
En cas de problème, ces fichiers vous aideront :

1. **Logs Podman :**
   ```bash
   podman logs processeur-bancaire > logs.txt
   ```

2. **État du conteneur :**
   ```bash
   podman inspect processeur-bancaire > inspect.json
   ```

3. **Logs de build :**
   Les erreurs de build s'affichent lors de `podman build`

---

## ✅ Checklist finale

Avant de partager ou déployer :

- [ ] L'application fonctionne localement (`npm run dev`)
- [ ] L'image Podman se construit sans erreur
- [ ] Le conteneur démarre correctement
- [ ] Les PDF sont traités correctement
- [ ] Les CSV se téléchargent
- [ ] Aucune erreur dans les logs
- [ ] Le README est à jour
- [ ] Les variables sensibles ne sont pas dans le code

---

**Félicitations !** 🎉 Vous avez maintenant une application web professionnelle conteneurisée avec Podman !
