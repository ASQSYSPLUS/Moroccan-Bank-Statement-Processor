# 🚨 RÉSOLUTION D'ERREUR : "Rollup failed to resolve import"

## Le problème

Vous avez cette erreur lors de la construction :
```
[vite]: Rollup failed to resolve import "/src/main.jsx" from "/app/index.html"
```

## ❓ Cause

Il manque le dossier `src/` ou les fichiers dedans dans votre projet.

---

## ✅ SOLUTION RAPIDE (2 minutes)

### Méthode 1 : Script automatique (RECOMMANDÉ)

```bash
# 1. Exécuter le script de réparation
./repair.sh

# 2. Si App.jsx n'est pas dans src/, le copier
cp App.jsx src/   # (si vous avez App.jsx à la racine)

# 3. Relancer la construction
./podman-manager.sh
# Puis choisir option 1
```

### Méthode 2 : Diagnostic puis correction manuelle

```bash
# 1. Voir ce qui manque
./diagnostic.sh

# 2. Créer la structure manuellement
mkdir -p src
cp App.jsx src/
cp main.jsx src/  # si existe
cp index.css src/  # si existe

# 3. Relancer la construction
./podman-manager.sh
```

---

## 📁 Structure correcte attendue

Votre dossier doit ressembler à ça :

```
RB-PARSING-V01/           ← Votre dossier actuel
├── Dockerfile
├── package.json
├── index.html
├── nginx.conf
├── podman-manager.sh
├── repair.sh              ← NOUVEAU script
├── diagnostic.sh          ← NOUVEAU script
└── src/                   ← IMPORTANT: Ce dossier doit exister
    ├── App.jsx            ← Votre application principale
    ├── main.jsx           ← Point d'entrée React
    └── index.css          ← Styles Tailwind
```

---

## 🔍 Vérification manuelle

Tapez ces commandes pour vérifier :

```bash
# Êtes-vous dans le bon dossier ?
pwd
# Devrait afficher quelque chose comme : /Users/az/RB-PARSING-V01

# Le dossier src existe-t-il ?
ls -la src/
# Devrait lister : App.jsx, main.jsx, index.css

# Si "No such file or directory", créez-le :
mkdir -p src
```

---

## 📝 Étapes détaillées si rien ne fonctionne

### 1. Vérifier où vous êtes

```bash
pwd
ls -la
```

Vous devriez voir tous les fichiers du projet (Dockerfile, package.json, etc.)

### 2. Créer le dossier src

```bash
mkdir -p src
```

### 3. Créer main.jsx

```bash
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF
```

### 4. Créer index.css

```bash
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF
```

### 5. Copier App.jsx dans src/

Si vous avez déjà un fichier `App.jsx` à la racine ou ailleurs :

```bash
# Depuis la racine du projet
cp App.jsx src/

# OU si c'est dans un autre dossier
cp chemin/vers/App.jsx src/
```

**IMPORTANT :** Si vous n'avez pas de fichier App.jsx, téléchargez-le depuis les fichiers que je vous ai fournis !

### 6. Vérifier que tout est en place

```bash
ls -la src/
```

Vous devriez voir :
```
-rw-r--r--  1 az  staff  12345 Dec 16 10:00 App.jsx
-rw-r--r--  1 az  staff    234 Dec 16 10:00 index.css
-rw-r--r--  1 az  staff    189 Dec 16 10:00 main.jsx
```

### 7. Relancer la construction

```bash
./podman-manager.sh
# Choisir option 1
```

---

## 🎯 Cas particuliers

### "Je n'ai pas de fichier App.jsx"

Téléchargez-le depuis les fichiers que je vous ai fournis. Il doit contenir tout le code de votre processeur de relevés bancaires.

### "Permission denied sur les scripts"

```bash
chmod +x repair.sh
chmod +x diagnostic.sh
chmod +x podman-manager.sh
```

### "Les fichiers sont dans un autre dossier"

Si vos fichiers sont éparpillés, rassemblez-les :

```bash
# Trouver où est App.jsx
find . -name "App.jsx"

# Le copier dans src/
cp ./chemin/trouvé/App.jsx src/
```

---

## 📞 Toujours bloqué ?

Envoyez-moi le résultat de ces commandes :

```bash
pwd
ls -la
ls -la src/
cat index.html
```

Je pourrai vous aider plus précisément ! 🚀

---

## ✅ Checklist finale

Avant de relancer la construction, vérifiez :

- [ ] Je suis dans le bon dossier (celui avec Dockerfile)
- [ ] Le dossier `src/` existe
- [ ] `src/App.jsx` existe et contient mon code
- [ ] `src/main.jsx` existe
- [ ] `src/index.css` existe
- [ ] J'ai exécuté `chmod +x podman-manager.sh`

Si tout est coché ✅, relancez `./podman-manager.sh` !
