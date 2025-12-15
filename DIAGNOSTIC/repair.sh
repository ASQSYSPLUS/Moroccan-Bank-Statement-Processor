#!/bin/bash

# Script de réparation automatique de la structure du projet

echo "🔧 Réparation de la structure du projet..."
echo ""

# Créer le dossier src s'il n'existe pas
if [ ! -d "src" ]; then
    echo "📁 Création du dossier src/..."
    mkdir -p src
    echo "✅ Dossier créé"
else
    echo "✅ Dossier src/ existe déjà"
fi

# Vérifier et créer main.jsx s'il n'existe pas
if [ ! -f "src/main.jsx" ]; then
    echo "📄 Création de src/main.jsx..."
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
    echo "✅ src/main.jsx créé"
else
    echo "✅ src/main.jsx existe déjà"
fi

# Vérifier et créer index.css s'il n'existe pas
if [ ! -f "src/index.css" ]; then
    echo "📄 Création de src/index.css..."
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
    echo "✅ src/index.css créé"
else
    echo "✅ src/index.css existe déjà"
fi

# Vérifier App.jsx
if [ ! -f "src/App.jsx" ]; then
    echo "⚠️  src/App.jsx manquant !"
    echo "   Vous devez copier votre fichier App.jsx dans le dossier src/"
    echo "   Exemple: cp App.jsx src/"
else
    echo "✅ src/App.jsx existe"
fi

echo ""
echo "🎉 Réparation terminée !"
echo ""
echo "📋 Vérification finale :"
ls -la src/

echo ""
echo "▶️  Vous pouvez maintenant relancer :"
echo "   ./podman-manager.sh"
echo "   Puis choisir l'option 1 (Construire l'image)"
