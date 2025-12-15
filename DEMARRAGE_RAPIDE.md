# 🚀 DÉMARRAGE RAPIDE - 5 MINUTES

## Ce que vous allez faire :
1. ✅ Installer Podman (2 min)
2. ✅ Télécharger les fichiers (1 min)
3. ✅ Lancer l'application (2 min)

---

## Étape 1 : Installer Podman

### 🐧 Linux (Ubuntu/Debian)
Ouvrez un terminal et tapez :
```bash
sudo apt update
sudo apt install -y podman
```

### 🍎 macOS
```bash
brew install podman
podman machine init
podman machine start
```

### 🪟 Windows
Téléchargez et installez depuis : https://podman.io/getting-started/installation

**Vérifiez l'installation :**
```bash
podman --version
```
Vous devriez voir quelque chose comme : `podman version 4.x.x`

---

## Étape 2 : Préparer les fichiers

1. **Téléchargez tous les fichiers** du dossier `processeur-bancaire-podman/`

2. **Vérifiez que vous avez :**
   ```
   processeur-bancaire-podman/
   ├── Dockerfile ✓
   ├── nginx.conf ✓
   ├── package.json ✓
   ├── src/
   │   ├── App.jsx ✓
   │   ├── main.jsx ✓
   │   └── index.css ✓
   └── ... (autres fichiers)
   ```

3. **Ouvrez un terminal** dans ce dossier
   - Sur Windows : Clic droit → "Git Bash Here" ou "PowerShell"
   - Sur Mac/Linux : Clic droit → "Ouvrir dans le terminal"

---

## Étape 3 : Lancer l'application

### 🎯 Méthode facile (avec le script)

```bash
# Rendre le script exécutable (une seule fois)
chmod +x podman-manager.sh

# Lancer le script
./podman-manager.sh
```

Puis suivez le menu :
1. Choisir option **1** (Construire l'image) - Attendez 2-5 minutes
2. Choisir option **2** (Démarrer l'application)
3. Choisir option **10** (Ouvrir dans le navigateur)

### 🔧 Méthode manuelle (3 commandes)

```bash
# 1. Construire l'image
podman build -t processeur-bancaire:latest .

# 2. Lancer l'application
podman run -d -p 8080:80 --name processeur-bancaire processeur-bancaire:latest

# 3. Ouvrir dans votre navigateur
# Allez sur : http://localhost:8080
```

---

## 🎉 C'est prêt !

Votre application est maintenant accessible sur : **http://localhost:8080**

### Que faire maintenant ?

1. **Testez avec un PDF** de relevé bancaire
2. **Téléchargez les CSV** générés
3. **Analysez les données** extraites

---

## 📱 Commandes utiles

```bash
# Voir si l'application tourne
podman ps

# Arrêter l'application
podman stop processeur-bancaire

# Redémarrer l'application
podman start processeur-bancaire

# Voir les logs (en cas de problème)
podman logs processeur-bancaire
```

---

## 🆘 Problèmes fréquents

### "Port 8080 déjà utilisé"
Utilisez un autre port :
```bash
podman run -d -p 9000:80 --name processeur-bancaire processeur-bancaire:latest
```
Puis allez sur : http://localhost:9000

### "Permission denied"
Sur Linux, ajoutez-vous au groupe podman :
```bash
sudo usermod -aG podman $USER
```
Puis déconnectez-vous et reconnectez-vous.

### "Image not found"
Assurez-vous d'être dans le bon dossier et reconstruisez :
```bash
podman build -t processeur-bancaire:latest .
```

---

## 📚 Documentation complète

Pour aller plus loin, consultez :
- **GUIDE_PODMAN.md** - Guide détaillé avec toutes les options
- **README.md** - Documentation complète du projet

---

## 💡 Conseils

- ✅ L'application utilise l'API Claude (Anthropic)
- ✅ Fonctionne avec tous les navigateurs modernes
- ✅ Supporte le multi-fichiers PDF
- ✅ Génère 2 CSV : transactions + descriptifs parsés
- ✅ Totalement gratuit à héberger localement

---

**Besoin d'aide ?** Consultez les logs avec `podman logs processeur-bancaire`
