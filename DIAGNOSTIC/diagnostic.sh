#!/bin/bash

# Script de diagnostic pour le projet

echo "🔍 Diagnostic du projet..."
echo ""

echo "📁 Structure des fichiers :"
echo "=========================="
if [ -f "package.json" ]; then
    echo "✅ package.json trouvé"
else
    echo "❌ package.json MANQUANT"
fi

if [ -f "index.html" ]; then
    echo "✅ index.html trouvé"
else
    echo "❌ index.html MANQUANT"
fi

if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile trouvé"
else
    echo "❌ Dockerfile MANQUANT"
fi

if [ -d "src" ]; then
    echo "✅ Dossier src/ trouvé"
    
    if [ -f "src/App.jsx" ]; then
        echo "  ✅ src/App.jsx trouvé"
    else
        echo "  ❌ src/App.jsx MANQUANT"
    fi
    
    if [ -f "src/main.jsx" ]; then
        echo "  ✅ src/main.jsx trouvé"
    else
        echo "  ❌ src/main.jsx MANQUANT"
    fi
    
    if [ -f "src/index.css" ]; then
        echo "  ✅ src/index.css trouvé"
    else
        echo "  ❌ src/index.css MANQUANT"
    fi
else
    echo "❌ Dossier src/ MANQUANT !"
fi

echo ""
echo "📂 Fichiers présents dans le dossier actuel :"
echo "=============================================="
ls -la

echo ""
echo "📂 Contenu du dossier src/ (si existe) :"
echo "=========================================="
if [ -d "src" ]; then
    ls -la src/
else
    echo "Le dossier src/ n'existe pas !"
fi

echo ""
echo "🎯 Solution :"
echo "============"
echo "Si des fichiers sont manquants, vous devez :"
echo "1. Créer le dossier src/ : mkdir -p src"
echo "2. Copier tous les fichiers .jsx et .css dans src/"
echo "3. Relancer la construction"
