# 🐳 Guide Podman - Processeur de Relevés Bancaires Marocains

## 📋 Ce dont vous avez besoin

### 1. Installer Podman

**Sur Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y podman
```

**Sur Fedora/RHEL:**
```bash
sudo dnf install -y podman
```

**Sur macOS:**
```bash
brew install podman
podman machine init
podman machine start
```

**Sur Windows:**
Téléchargez l'installeur depuis: https://podman.io/getting-started/installation

---

## 🚀 Démarrage rapide (3 étapes)

### Étape 1: Télécharger tous les fichiers
Placez tous les fichiers du projet dans un même dossier:
```
processeur-bancaire/
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

### Étape 2: Construire l'image
Ouvrez votre terminal dans le dossier `processeur-bancaire/` et tapez:

```bash
podman build -t processeur-bancaire:latest .
```

**Temps de construction:** 2-5 minutes (selon votre connexion internet)

### Étape 3: Lancer l'application
```bash
podman run -d -p 8080:80 --name processeur-bancaire processeur-bancaire:latest
```

🎉 **Votre application est maintenant accessible sur:** http://localhost:8080

---

## 📱 Commandes utiles

### Voir les conteneurs en cours d'exécution
```bash
podman ps
```

### Arrêter l'application
```bash
podman stop processeur-bancaire
```

### Redémarrer l'application
```bash
podman start processeur-bancaire
```

### Supprimer le conteneur
```bash
podman rm -f processeur-bancaire
```

### Voir les logs (pour déboguer)
```bash
podman logs processeur-bancaire
```

### Voir les logs en temps réel
```bash
podman logs -f processeur-bancaire
```

---

## 🔄 Mise à jour de l'application

Si vous modifiez le code, suivez ces étapes:

```bash
# 1. Arrêter et supprimer l'ancien conteneur
podman stop processeur-bancaire
podman rm processeur-bancaire

# 2. Reconstruire l'image
podman build -t processeur-bancaire:latest .

# 3. Relancer
podman run -d -p 8080:80 --name processeur-bancaire processeur-bancaire:latest
```

---

## 🌐 Déploiement en production

### Option 1: Changer le port
Pour utiliser le port 80 (HTTP standard):
```bash
podman run -d -p 80:80 --name processeur-bancaire processeur-bancaire:latest
```

### Option 2: Redémarrage automatique
Pour que l'application redémarre automatiquement:
```bash
podman run -d -p 8080:80 --restart=always --name processeur-bancaire processeur-bancaire:latest
```

### Option 3: Variables d'environnement
Si vous voulez configurer des paramètres:
```bash
podman run -d -p 8080:80 \
  -e NODE_ENV=production \
  --name processeur-bancaire \
  processeur-bancaire:latest
```

---

## 🔒 Sauvegarder et partager l'image

### Sauvegarder l'image dans un fichier
```bash
podman save -o processeur-bancaire.tar processeur-bancaire:latest
```

### Charger l'image depuis un fichier
```bash
podman load -i processeur-bancaire.tar
```

### Envoyer vers Docker Hub (pour partager)
```bash
# 1. Se connecter
podman login docker.io

# 2. Tagger l'image
podman tag processeur-bancaire:latest votre-username/processeur-bancaire:latest

# 3. Envoyer
podman push votre-username/processeur-bancaire:latest
```

---

## 🐛 Résolution des problèmes

### Le conteneur ne démarre pas
```bash
# Voir les logs détaillés
podman logs processeur-bancaire

# Vérifier l'état
podman ps -a
```

### Port déjà utilisé
Si le port 8080 est déjà occupé, utilisez un autre port:
```bash
podman run -d -p 9000:80 --name processeur-bancaire processeur-bancaire:latest
```
Accédez alors via: http://localhost:9000

### Erreur "permission denied"
Sur Linux, ajoutez votre utilisateur au groupe podman:
```bash
sudo usermod -aG podman $USER
```
Puis déconnectez-vous et reconnectez-vous.

### Nettoyer complètement
Pour tout supprimer et recommencer:
```bash
# Supprimer tous les conteneurs
podman rm -f $(podman ps -aq)

# Supprimer toutes les images
podman rmi -f $(podman images -q)
```

---

## 💡 Conseils Pro

### 1. Utiliser un fichier docker-compose (podman-compose)
Créez un fichier `docker-compose.yml`:
```yaml
version: '3.8'
services:
  processeur:
    build: .
    ports:
      - "8080:80"
    restart: always
```

Puis lancez:
```bash
podman-compose up -d
```

### 2. Limiter les ressources
```bash
podman run -d -p 8080:80 \
  --memory="512m" \
  --cpus="1.0" \
  --name processeur-bancaire \
  processeur-bancaire:latest
```

### 3. Mode développement avec rechargement automatique
```bash
podman run -it --rm \
  -v $(pwd):/app \
  -p 5173:5173 \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npm run dev -- --host"
```

---

## 📊 Surveillance

### Voir l'utilisation des ressources
```bash
podman stats processeur-bancaire
```

### Inspecter le conteneur
```bash
podman inspect processeur-bancaire
```

---

## ✅ Checklist avant la production

- [ ] L'application fonctionne sur http://localhost:8080
- [ ] Tous les fichiers PDF sont correctement traités
- [ ] Les CSV se téléchargent correctement
- [ ] Aucune erreur dans les logs (`podman logs processeur-bancaire`)
- [ ] Le conteneur redémarre automatiquement (`--restart=always`)
- [ ] Les ports sont correctement configurés
- [ ] (Optionnel) Certificat SSL configuré pour HTTPS

---

## 🆘 Besoin d'aide ?

1. **Vérifiez les logs:** `podman logs processeur-bancaire`
2. **Testez avec:** `curl http://localhost:8080`
3. **Redémarrez:** `podman restart processeur-bancaire`

Pour plus d'informations: https://podman.io/docs
