# ⚡ ToolSuite - Suite d'Outils Web Moderne & Polyvalente

> **🤖 Note importante : Cette application et l'intégralité de son code source ont été entièrement générés par Intelligence Artificielle (IA).**

[![Technologies](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS%20%7C%20PHP-6366f1.svg)](#-technologies-utilisées)
[![Node.js](https://img.shields.io/badge/Node.js%20%2F%20npm-Aucun%20(Zero%20Dependency)-10b981.svg)](#-philosophie--architecture)
[![Vie Privée](https://img.shields.io/badge/Confidentialit%C3%A9-100%25%20Local%20%26%20S%C3%A9curis%C3%A9-06b6d4.svg)](#-philosophie--architecture)
[![Généré par IA](https://img.shields.io/badge/G%C3%A9n%C3%A9r%C3%A9%20par-IA%20(Google%20DeepMind)-8b5cf6.svg)](#-mention-de-génération-par-ia)

---

## 🌟 Présentation

**ToolSuite** est une suite complète de **16 outils web professionnels** regroupés au sein d'une interface utilisateur moderne, sobre, réactive et ergonomique. 

Elle couvre la manipulation de documents, le traitement d'images, les utilitaires pour développeurs et les outils pratiques du quotidien.

L'ensemble des calculs, conversions et traitements s'effectue **directement et localement dans votre navigateur** : aucun fichier ni donnée sensible n'est téléversé vers un serveur tiers externe.

---

## 🛠️ Les 16 Outils Intégrés

### 📑 1. Manipulation de Documents (PDF & Texte)
- **Fusion de PDF** : Combinez plusieurs documents PDF en un seul fichier. Réorganisez l'ordre des pages et des fichiers par de simples boutons monter/descendre avant la fusion (`pdf-lib`).
- **Séparation de PDF** : Extrayez des pages ciblées ou découpez vos documents par plages souples (ex: `1-3, 5, 8-10`).
- **Compresseur de PDF** : Réduisez la taille de vos documents PDF pour l'envoi par e-mail ou l'archivage avec calcul en direct de l'espace économisé.
- **Extracteur de texte (OCR)** : Transformez scans et images en texte éditable grâce à la reconnaissance optique de caractères en local (`Tesseract.js`), avec barre de progression et sélecteur multilingue (Français, Anglais, Espagnol, Allemand).
- **Convertisseur Markdown** : Éditeur en temps réel double volet avec rendu instantané, coloration du code, tableaux, export en code HTML propre et impression / génération PDF directe.

### 🖼️ 2. Traitement d'Images et Médias
- **Convertisseur de formats universel** : Convertissez instantanément vos fichiers JPG, PNG, BMP vers le format moderne ultra-léger **WebP** ou en conteneur vectoriel **SVG**.
- **Compresseur d'images** : Ajustez la qualité (1 à 100%) et l'échelle (25%, 50%, 75%, 100%) avec un comparateur visuel côte à côte et un badge de réduction du poids (jusqu'à -85%).
- **Générateur de Favicon** : Importez un logo unique pour produire automatiquement toutes les tailles requises (16x16, 32x32, 48x48, 180x180 Apple Touch, 192x192, 512x512 Android/PWA). Téléchargement en archive `.ZIP` complète (`JSZip`) avec extrait HTML `<head>` prêt à copier.
- **Suppresseur d'arrière-plan** : Détourage interactif avec baguette magique chromatique, curseur de tolérance, détection automatique des 4 coins, adoucissement alpha des contours (feathering) et gomme manuelle avec export PNG transparent.
- **Extracteur de palette de couleurs** : Échantillonnez n'importe quelle image pour extraire les 8 couleurs dominantes avec codes HEX, RGB, pipette sélective et export des variables CSS (`:root`) ou JSON.

### ⚙️ 3. Outils pour Développeurs (DevTools)
- **Formateur & Validateur JSON** : Indentation automatique (2 ou 4 espaces), minification en 1 ligne, diagnostic précis des erreurs de syntaxe (ligne / caractère) et vue arborescente colorisée.
- **Testeur d'expressions régulières (Regex)** : Surlignage dynamique des correspondances dans le texte, prise en charge des drapeaux (`g`, `i`, `m`, `s`), et tableau détaillé des groupes de capture ($1, $2...).
- **Générateur d'ombres CSS & Neumorphisme** : Interface avec curseurs de réglage (décalages X/Y, flou, étalement, opacité, mode `inset`) et préréglages Neumorphismes (Flat, Concave, Convex, Pressed) avec copie immédiate du code CSS.
- **Encodeur / Décodeur Base64** : Encodage/décodage complet de textes avec prise en charge intégrale de l'UTF-8 (accents et emojis) et conversion de fichiers/images en Data URLs web.

### 📱 4. Utilitaires Pratiques du Quotidien
- **Générateur de QR Codes dynamiques** : Modes dédiés pour URL, réseaux Wi-Fi (SSID + mot de passe sécurisé), cartes de contact vCard, menus de restaurant ou texte brut. Personnalisation des couleurs et export en PNG ou SVG.
- **Générateur de mots de passe forts** : Longueur paramétrable (6 à 64 caractères), filtres de complexité (majuscules, minuscules, chiffres, symboles, exclusion des caractères ambigus) et calcul en temps réel de l'entropie de Shannon.
- **Extracteur de palette de couleurs** : Téléchargez une photo, illustration ou capture d'écran pour en extraire instantanément la palette chromatique harmonieuse avec copie directe en 1 clic.

---

## 💡 Expérience Utilisateur & Design

- **Palette Visuelle Épurée & Professionnelle** : Design sobre aux tons ardoise/charbon neutres (`#0f141c`), typographie moderne Inter, contrastes doux et mode clair commutable d'un clic.
- **Recherche Rapide Globale (`Ctrl + K`)** : Barre de recherche instantanée avec navigation au clavier (`↑`, `↓`, `Entrée`, `Échap`) pour accéder à n'importe quel outil en moins d'une seconde.
- **Zéro Rechargement** : Navigation fluide par onglets et liens d'accès rapide.
- **Feedback Interactif** : Système de notifications Toast animées pour chaque action (copie dans le presse-papier, téléchargement, erreurs).

---

## 📁 Structure du Répertoire

```
.
├── index.html                  # Point d'entrée autonome (ouverture directe sans serveur)
├── index.php                   # Point d'entrée principal PHP (serveurs Apache / Nginx / PHP)
├── api/
│   └── api.php                 # API PHP d'information système et diagnostic environnement
├── css/
│   ├── style.css               # Design system de base, thèmes sombre/clair, grille responsive
│   ├── components.css          # Composants réutilisables (boutons, formulaires, modales, toasts)
│   └── tools.css               # Styles dédiés aux 16 outils (transparence, Markdown, ombres)
├── js/
│   ├── ui.js                   # Helpers d'interface (Toasts, copie, drag & drop, formats)
│   ├── app.js                  # Catalogue des outils, moteur de recherche Ctrl+K et routage
│   └── tools/
│       ├── pdf-tools.js        # Fusion, séparation et compression de PDF (PDF-Lib)
│       ├── ocr-tool.js         # Extraction de texte OCR (Tesseract.js)
│       ├── markdown-tool.js    # Éditeur Markdown et export HTML/PDF (Marked.js)
│       ├── image-tools.js      # Convertisseur de formats, compresseur et pack Favicon (JSZip)
│       ├── bg-remover.js       # Détourage et suppression de fond par Canvas
│       ├── dev-tools.js        # Validateur JSON, Testeur Regex, Ombres CSS et Base64
│       └── utility-tools.js    # QR Codes, Mots de passe et Palette de couleurs
└── README.md                   # Documentation du dépôt
```

---

## 🚀 Démarrage & Utilisation

### Option A : Lancement direct sans serveur (recommandé pour test rapide)
1. Ouvrez simplement le fichier `index.html` dans n'importe quel navigateur moderne (**Google Chrome**, **Mozilla Firefox**, **Microsoft Edge**, **Brave**, **Safari**).
2. Aucun serveur n'est nécessaire : les 16 outils sont 100% opérationnels immédiatement.

### Option B : Lancement sous serveur PHP (XAMPP, WAMP, Laragon ou CLI)
Si vous disposez d'un environnement PHP :
1. Placez le dossier du projet dans le répertoire de votre serveur web (ex: `htdocs` ou `www`).
2. Ou lancez le serveur intégré PHP depuis la racine du dossier :
   ```bash
   php -S localhost:8000
   ```
3. Rendez-vous sur `http://localhost:8000` (le fichier `index.php` et l'endpoint `api/api.php` seront automatiquement actifs).

---

## 💻 Technologies Utilisées

- **HTML5** sémantique avec balisage accessible et meta SEO.
- **CSS3 pur** : variables CSS (Custom Properties), Flexbox, CSS Grid, Glassmorphism, animations fluides (aucun framework lourd comme Tailwind ou Bootstrap).
- **JavaScript Vanilla (ES6+)** : architecture modulaire sans outil de build, sans Node.js, sans bundler (Webpack/Vite/Rollup).
- **PHP** : scripts natifs pour l'hébergement serveur standard et API utilitaire.
- **Bibliothèques autonomes chargées via CDN** :
  - [PDF-Lib](https://pdf-lib.js.org/) (manipulation PDF locale)
  - [Tesseract.js](https://tesseract.projectnaptha.com/) (moteur OCR client-side)
  - [Marked.js](https://marked.js.org/) (compilateur Markdown haute performance)
  - [JSZip](https://stuk.github.io/jszip/) (création d'archives ZIP à la volée)
  - [QRCode.js](https://davidshimjs.github.io/qrcodejs/) (génération vectorielle de QR Codes)

---

## 🤖 Mention de Génération par IA

> **Avertissement & Transparence :**  
> Ce projet, incluant la conception de l'architecture, le code source HTML, CSS, JavaScript et PHP, ainsi que la présente documentation, a été **entièrement conçu et généré par une Intelligence Artificielle** (Google DeepMind / Antigravity).

---

## 📄 Licence

Ce projet est distribué sous licence libre **MIT**. Vous êtes libre de l'utiliser, l'adapter, l'enrichir et l'intégrer à vos propres projets professionnels ou personnels.
