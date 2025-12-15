# 🏦 Processeur de Relevés Bancaires Marocains

Application web intelligente pour extraire et analyser automatiquement les transactions des relevés bancaires marocains en PDF.

## ✨ Fonctionnalités

- 📄 **Upload multi-fichiers PDF** - Traitement de plusieurs relevés simultanément
- 🤖 **Extraction IA** - Utilise Claude AI pour analyser les documents
- 💰 **Détection automatique** - Dates, montants, références, descriptifs
- 👥 **Parsing intelligent** - Extraction des noms de clients depuis les descriptifs
- 📊 **Export CSV** - Deux fichiers générés :
  - `transactions_bancaires.csv` - Toutes les transactions
  - `descriptifs_parse.csv` - Noms clients et mots-clés
- 🔗 **Liaison par référence** - Relation entre les deux fichiers via colonne "Référence"

## 🚀 Démarrage

### Option 1 : Avec Podman (Recommandé)
```bash
# Construire l'image
podman build -t processeur-bancaire:latest .

# Lancer l'application
podman run -d -p 8080:80 --name processeur-bancaire processeur-bancaire:latest

# Accéder à l'application
# http://localhost:8080
```

📖 **Guide détaillé :** Voir [GUIDE_PODMAN.md](GUIDE_PODMAN.md)

### Option 2 : Développement local
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build
```

## 📦 Structure du projet

```
processeur-bancaire/
├── src/
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée React
│   └── index.css         # Styles Tailwind
├── Dockerfile            # Configuration conteneur
├── nginx.conf            # Configuration serveur web
├── package.json          # Dépendances Node.js
├── vite.config.js        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
└── index.html            # Page HTML principale
```

## 🛠️ Technologies utilisées

- **React 18** - Framework UI
- **TailwindCSS** - Styles
- **Vite** - Build tool
- **Lucide React** - Icônes
- **Claude AI API** - Extraction PDF
- **Nginx** - Serveur web (production)

## 📝 Format des CSV générés

### transactions_bancaires.csv
```csv
date_valeur,date_operation,debit,credit,reference,banque,descriptif_brut
2024-01-15,2024-01-15,500.00,,REF123,Attijariwafa Bank,"VIREMENT CLIENT ABC"
```

### descriptifs_parse.csv
```csv
reference,descriptif_brut,nom_client,mots_cles,descriptif_nettoye
REF123,"VIREMENT CLIENT ABC","client abc","","client abc"
```

## 🔐 Configuration API

L'application utilise l'API Claude d'Anthropic. Pour l'utiliser :

1. Créez un compte sur https://console.anthropic.com
2. Générez une clé API
3. **Important :** Cette application appelle l'API directement depuis le navigateur
   - Pour la production, il est recommandé de passer par un backend sécurisé
   - Ou d'utiliser un proxy pour protéger votre clé API

## 🌐 Déploiement

### Vercel (Gratuit)
```bash
npm install -g vercel
vercel
```

### Netlify (Gratuit)
```bash
npm run build
# Glissez-déposez le dossier dist/ sur netlify.com
```

### Serveur avec Podman
Voir le guide complet : [GUIDE_PODMAN.md](GUIDE_PODMAN.md)

## 🐛 Résolution de problèmes

### "Erreur lors du traitement des fichiers"
- Vérifiez que le PDF est un vrai relevé bancaire
- Assurez-vous que le PDF n'est pas protégé par mot de passe
- Vérifiez votre connexion internet (appel API)

### "Seuls les fichiers PDF sont acceptés"
- Assurez-vous d'uploader uniquement des fichiers .pdf
- Vérifiez que le fichier n'est pas corrompu

### Le conteneur ne démarre pas (Podman)
```bash
podman logs processeur-bancaire
```

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## 📧 Contact

Pour toute question ou suggestion, contactez-nous !

---

**Note :** Cette application est conçue spécifiquement pour les formats de relevés bancaires marocains. Les performances peuvent varier selon les banques.
