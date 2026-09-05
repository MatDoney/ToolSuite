# ⚡ ToolSuite - Suite d'Outils Web Moderne & Polyvalente

> **🤖 Note importante : Cette application et l'intégralité de son code source ont été entièrement générés par Intelligence Artificielle (IA).**

> **🌐 Auto-hébergement & Déploiement libre :**  
> Vous êtes totalement libre de **télécharger, cloner, modifier et auto-héberger** ce projet sur votre propre serveur ou machine (Apache, Nginx, Docker, GitHub Pages, Raspberry Pi, etc.) grâce à la **[Licence libre MIT](#-licence)**.  
> ⚠️ **Attention importante avant mise en ligne :** Si vous déployez ce projet sur un serveur accessible au public, pensez impérativement à **adapter et personnaliser les fichiers de mentions légales** (`mentions-legales.html` et/ou `mentions-legales.php`) avec vos propres coordonnées et les informations de votre hébergement afin d'être en conformité avec la réglementation (loi LCEN et RGPD).

[![Technologies](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS%20%7C%20PHP-6366f1.svg)](#-technologies-utilisées)
[![Licence](https://img.shields.io/badge/Licence-MIT%20(Open%20Source)-22c55e.svg)](#-licence)
[![Node.js](https://img.shields.io/badge/Node.js%20%2F%20npm-Aucun%20(Zero%20Dependency)-10b981.svg)](#-philosophie--architecture)
[![Vie Privée](https://img.shields.io/badge/Confidentialit%C3%A9-100%25%20Local%20%26%20S%C3%A9curis%C3%A9-06b6d4.svg)](#-philosophie--architecture)
[![Généré par IA](https://img.shields.io/badge/G%C3%A9n%C3%A9r%C3%A9%20par-IA%20(Google%20DeepMind)-8b5cf6.svg)](#-mention-de-génération-par-ia)

---

## 🌟 Présentation

**ToolSuite** est une suite complète de **42 outils web professionnels** regroupés au sein d'une interface utilisateur moderne, sobre, réactive et ergonomique. 

Elle couvre la manipulation de documents, le traitement d'images, les utilitaires pour développeurs, la rédaction de texte, la productivité & la gestion du temps, les calculs financiers rapides et les réseaux sociaux.

L'ensemble des calculs, conversions et traitements s'effectue **directement et localement dans votre navigateur** : aucun fichier ni donnée sensible n'est téléversé vers un serveur tiers externe.

---

## 🛠️ Les 42 Outils Intégrés

### 📑 1. Manipulation de Documents (PDF & Texte) — 17 outils
- **Fusion de PDF** : Combinez plusieurs documents PDF en un seul fichier. Réorganisez l'ordre des pages et des fichiers par de simples boutons monter/descendre avant la fusion (`pdf-lib`).
- **Séparation de PDF** : Extrayez des pages ciblées ou découpez vos documents par plages souples (ex: `1-3, 5, 8-10`).
- **Compresseur de PDF** : Réduisez la taille de vos documents PDF pour l'envoi par e-mail ou l'archivage avec calcul en direct de l'espace économisé.
- **Extracteur de texte (OCR)** : Transformez scans et images en texte éditable grâce à la reconnaissance optique de caractères en local (`Tesseract.js`), avec barre de progression et sélecteur multilingue (Français, Anglais, Espagnol, Allemand).
- **Convertisseur Markdown** : Éditeur en temps réel double volet avec rendu instantané, coloration du code, tableaux, export en code HTML propre et impression / génération PDF directe.
- **Caviardage Sécurisé (Redact)** : Dessinez des rectangles noirs sur les informations sensibles (noms, IBAN, numéros confidentiels) pour les détruire physiquement du code source du document par rasterisation haute définition, sans masquer simplement le texte.
- **Gestionnaire de Mots de Passe PDF** : Verrouillez et sécurisez un PDF avec un mot de passe ou retirez la protection d'un fichier déverrouillé pour éviter de ressaisir le code à chaque ouverture.
- **Aplatissement (Flattening)** : Figez les formulaires remplis (AcroForms), signatures et calques interactifs pour que les champs ne soient plus cliquables et deviennent une image fixe inaltérable.
- **Réorganisation visuelle et Rotation** : Interface visuelle en miniatures avec glisser-déposer (Drag & Drop) pour réorganiser les pages, les supprimer ou pivoter les scans à l'envers (90°, 180°, 270°).
- **Recadrage de marges (Crop Tool)** : Détectez automatiquement ou réglez manuellement les marges blanches superflues pour adapter vos documents aux liseuses ou smartphones.
- **Extracteur d'Images Intégrées** : Parcourez l'ensemble du PDF pour extraire toutes les illustrations et photos en haute définition, avec téléchargement individuel ou en archive groupée `.ZIP`.
- **Signature Électronique de PDF** : Dessinez votre signature au doigt ou à la souris, tapez votre nom en calligraphie cursive ou importez un scan transparent, puis positionnez et dimensionnez librement la signature sur n'importe quelle page.
- **Générateur de Filigrane (Watermark)** : Ajoutez un tampon textuel ("CONFIDENTIEL", "BROUILLON") ou une marque semi-transparente en diagonale ou centré avec réglage précis de l'opacité et de l'angle.
- **Numérotation automatique de pages** : Insérez des numéros de page élégants dans les en-têtes ou pieds de page (`1`, `Page 1 / 10`, `1 sur N`, `- 1 -`), avec exclusion optionnelle de la couverture.
- **URL vers PDF (Mode Lecture)** : Convertissez n'importe quelle page web ou article de blog en document PDF propre et épuré de toute publicité pour l'archivage.
- **Extraction de Tableaux vers Excel** : Analysez les données tabulaires d'un document PDF pour les exporter instantanément en classeur Excel (`.xls`) ou fichier `.csv` UTF-8 avec BOM.
- **Images multiples vers PDF** : Compilez plusieurs photos, captures et scans (JPG, PNG, WebP) en un seul document PDF ordonné, ajusté ou au format standard A4.

### 🖼️ 2. Traitement d'Images et Médias — 5 outils
- **Convertisseur de formats universel** : Convertissez instantanément vos fichiers JPG, PNG, BMP vers le format moderne ultra-léger **WebP** ou en conteneur vectoriel **SVG**.
- **Compresseur d'images** : Ajustez la qualité (1 à 100%) et l'échelle (25%, 50%, 75%, 100%) avec un comparateur visuel côte à côte et un badge de réduction du poids (jusqu'à -85%).
- **Générateur de Favicon** : Importez un logo unique pour produire automatiquement toutes les tailles requises (16x16, 32x32, 48x48, 180x180 Apple Touch, 192x192, 512x512 Android/PWA). Téléchargement en archive `.ZIP` complète (`JSZip`) avec extrait HTML `<head>` prêt à copier.
- **Suppresseur d'arrière-plan** : Détourage interactif avec baguette magique chromatique, curseur de tolérance, détection automatique des 4 coins, adoucissement alpha des contours (feathering) et gomme manuelle avec export PNG transparent.
- **Extracteur de palette de couleurs** : Échantillonnez n'importe quelle image pour extraire les couleurs dominantes avec codes HEX, RGB, pipette sélective et export des variables CSS (`:root`) ou JSON.

### ⚙️ 3. Outils pour Développeurs (DevTools) — 4 outils
- **Formateur & Validateur JSON** : Indentation automatique (2 ou 4 espaces), minification en 1 ligne, diagnostic précis des erreurs de syntaxe (ligne / caractère) et vue arborescente colorisée.
- **Testeur d'expressions régulières (Regex)** : Surlignage dynamique des correspondances dans le texte, prise en charge des drapeaux (`g`, `i`, `m`, `s`), et tableau détaillé des groupes de capture ($1, $2...).
- **Générateur d'ombres CSS & Neumorphisme** : Interface avec curseurs de réglage (décalages X/Y, flou, étalement, opacité, mode `inset`) et préréglages Neumorphismes (Flat, Concave, Convex, Pressed) avec copie immédiate du code CSS.
- **Encodeur / Décodeur Base64** : Encodage/décodage complet de textes avec prise en charge intégrale de l'UTF-8 (accents et emojis) et conversion de fichiers/images en Data URLs web.

### ✍️ 4. Outils de Texte et Rédaction — 4 outils
- **Comparateur de texte (Diff Tool)** : Mise en évidence précise des ajouts et suppressions entre deux textes, avec vue côte à côte ou unifiée style GitHub (différenciation ligne par ligne et coloration syntaxique vert/rouge).
- **Compteur de mots avancé** : Statistiques complètes en temps réel (mots, caractères avec/sans espaces, phrases, paragraphes, temps de lecture et de parole estimé) et tableau d'analyse de densité des mots-clés récurrents avec barres de progression.
- **Convertisseur de casse** : Transformation instantanée d'un texte brut vers 9 formats différents : `camelCase`, `snake_case`, `kebab-case`, `PascalCase`, `CONSTANT_CASE`, `Title Case`, `Sentence case`, `MAJUSCULES` et `minuscules`.
- **Nettoyeur de texte** : Nettoyage en 1 clic : suppression des espaces multiples, lignes vides superflues, balises HTML indésirables, espaces de début/fin de ligne, normalisation des guillemets et conversion des tabulations en espaces.

### ⏱️ 5. Productivité et Temps — 3 outils
- **Planificateur de fuseaux horaires** : Frise chronologique interactive sur 24 heures affichant les fuseaux de Paris, Londres, New York, San Francisco, Tokyo, Sydney, Dubaï et São Paulo. Surlignage automatique des plages de bureaux (9h-18h) et détection instantanée des heures de chevauchement compatibles.
- **Calculateur de dates & jours ouvrés** : Calcul précis du delta en jours, semaines, mois, années ainsi que du nombre exact de jours ouvrés (hors week-ends). Module de projection de date future ou passée (+/- X jours).
- **Minuteur Pomodoro minimaliste** : Cycle de travail (25 min de focus, 5 min de pause courte, 15 min de pause longue), gestionnaire de tâches intégré avec cases à cocher et **générateur de bruits blancs synthétiques natif** (pluie douce, café chaleureux, vagues de l'océan générés via la Web Audio API sans aucun fichier audio externe).

### 💰 6. Finance et Calculs Rapides — 3 outils
- **Calculateur de pourcentages** : Résolution instantanée des 4 calculs clés : `X% de Y`, `X est quel % de Y`, augmentation/diminution en %, et recherche de la valeur initiale avant variation.
- **Partage d'addition (Split Bill)** : Calcul instantané de l'addition par personne, choix rapide de pourboire (0%, 10%, 15%, 20% ou personnalisé), prise en compte des arrondis et bouton pour copier le récapitulatif clair dans WhatsApp/SMS.
- **Simulateur d'intérêts composés** : Projection d'épargne sur 1 à 40 ans avec capital initial, versement mensuel et taux d'intérêt annuel. Visualisation graphique native sur Canvas 2D (capital versé vs intérêts cumulés) et tableau annuel détaillé.

### 📱 7. Marketing et Réseaux Sociaux — 3 outils
- **Aperçu de balises Meta & SEO** : Prévisualisation en direct du rendu de votre page web sous forme de carte sociale pour **Google**, **Twitter / X**, **LinkedIn** et **Facebook / OpenGraph**. Générateur complet d'extraits de code HTML `<meta>` prêt à coller dans votre site.
- **Générateur de liens UTM** : Construction standardisée de liens de tracking pour Google Analytics (Source, Medium, Campaign, Term, Content). Validation automatique de l'URL, raccourcissement visuel et copie en 1 clic.
- **Créateur de grilles Instagram** : Découpez n'importe quelle photo panoramique ou carrée en grille de **3 tuiles (1x3)**, **6 tuiles (2x3)** ou **9 tuiles (3x3)**. Aperçu visuel avec ordre numéroté de publication et téléchargement groupé en archive `.ZIP` automatique via `JSZip`.

### 🎲 8. Utilitaires & Tirage au Sort — 3 outils
- **Générateur de QR Codes dynamiques** : Modes dédiés pour URL, réseaux Wi-Fi (SSID + mot de passe sécurisé), cartes de contact vCard, menus ou texte libre. Personnalisation des couleurs et export PNG / SVG.
- **Générateur de mots de passe forts** : Longueur paramétrable (6 à 64 caractères), filtres de complexité et calcul en temps réel de l'entropie de Shannon.
- **Roue de tirage au sort interactive** : Roue animée sur Canvas physique avec inertie réaliste, bruitages de cliquetis synthétisés par l'API Web Audio, pluie de confettis festifs lors de la désignation du vainqueur et historique des gagnants avec option pour retirer le nom sélectionné.

---

## 💡 Expérience Utilisateur & Design

- **Palette Visuelle Épurée & Professionnelle** : Design sobre aux tons ardoise/charbon neutres (`#0f141c`), typographie moderne Inter, contrastes doux et mode clair commutable d'un clic.
- **Recherche Rapide Globale (`Ctrl + K`)** : Barre de recherche instantanée avec navigation au clavier (`↑`, `↓`, `Entrée`, `Échap`) pour accéder à l'un des 42 outils en moins d'une seconde.
- **Filtrage Thématique Instantané** : Barre d'onglets de filtrage par catégories pour naviguer sans effort entre documents, images, code, rédaction, temps, finance et marketing.
- **Zéro Rechargement** : Navigation fluide avec mémorisation de l'outil actif.
- **Feedback Interactif** : Système de notifications Toast animées pour chaque action (copie dans le presse-papier, téléchargement, erreurs).

---

## 📁 Structure du Répertoire

```
.
├── index.html                  # Point d'entrée autonome (ouverture directe sans serveur)
├── index.php                   # Point d'entrée principal PHP (serveurs Apache / Nginx / PHP)
├── mentions-legales.html       # Mentions Légales & RGPD conformes LCEN (version HTML)
├── mentions-legales.php        # Mentions Légales & RGPD conformes LCEN (version PHP)
├── api/
│   └── api.php                 # API PHP d'information système et extraction web (fetch_url)
├── css/
│   ├── style.css               # Design system de base, thèmes sombre/clair, grille responsive
│   ├── components.css          # Composants réutilisables (boutons, formulaires, modales, toasts)
│   └── tools.css               # Styles dédiés aux 42 outils (diff, timeline, kanban, canvas, etc.)
├── js/
│   ├── ui.js                   # Helpers d'interface (Toasts, copie, drag & drop, formats)
│   ├── app.js                  # Catalogue des 42 outils, moteur de recherche Ctrl+K et routage
│   └── tools/
│       ├── pdf-tools.js        # Fusion, séparation et compression de PDF (PDF-Lib)
│       ├── pdf-advanced-tools.js # 12 Outils avancés PDF (Caviardage, signature, rotation, filigrane, etc.)
│       ├── ocr-tool.js         # Extraction de texte OCR (Tesseract.js)
│       ├── markdown-tool.js    # Éditeur Markdown et export HTML/PDF (Marked.js)
│       ├── image-tools.js      # Convertisseur de formats, compresseur et pack Favicon (JSZip)
│       ├── bg-remover.js       # Détourage et suppression de fond par Canvas
│       ├── dev-tools.js        # Validateur JSON, Testeur Regex, Ombres CSS et Base64
│       ├── utility-tools.js    # QR Codes, Mots de passe et Palette de couleurs
│       ├── text-tools.js       # Diff Tool, Compteur de mots avancé, Casse, Nettoyeur
│       ├── productivity-tools.js # Fuseaux horaires, Calculateur de dates, Pomodoro & Bruits blancs
│       ├── finance-tools.js    # Pourcentages, Split Bill, Intérêts composés avec graphique
│       ├── marketing-tools.js  # Balises Meta SEO, Liens UTM, Découpe Grille Instagram
│       └── wheel-tool.js       # Roue de tirage au sort physique avec Web Audio & Confettis
├── docs/
│   ├── index.html              # Portail web interactif de la documentation technique
│   └── API.md                  # Manuel technique complet au format Markdown (2400+ lignes)
├── scripts/
│   └── generate_docs.py        # Générateur automatisé de documentation (JSDoc 3 & PHPDoc)
├── jsdoc.json                  # Configuration officielle standard JSDoc 3
├── package.json                # Métadonnées et scripts npm (docs, docs:generate)
├── LICENSE                     # Licence open-source MIT
└── README.md                   # Documentation complète du projet
```

---

## 📚 Documentation Technique & Génération d'API

L'intégralité du code source propriétaire JavaScript (15 modules) et PHP (proxy REST) est rigoureusement commentée selon les spécifications formelles **JSDoc 3** et **PHPDoc** (PSR-5 / PSR-19) avec typage précis de tous les paramètres, retours, exceptions et exemples d'appels.

### Consulter la documentation
- **Portail Web Interactif** : Ouvrez directement `docs/index.html` dans votre navigateur pour une exploration visuelle complète avec recherche en direct, filtrage par module, typages et détails des fonctions.
- **Manuel Markdown** : Consultez [`docs/API.md`](docs/API.md) pour la référence textuelle complète et navigable.

### Régénérer la documentation
1. **Via Python 3 (autonome, sans dépendance)** :
   ```bash
   py scripts/generate_docs.py
   ```
2. **Via npm et JSDoc (standard Node.js)** :
   ```bash
   npm run docs
   ```

---

## 🚀 Démarrage & Utilisation

### Option A : Lancement direct sans serveur (recommandé pour test rapide)
1. Double-cliquez simplement sur le fichier `index.html` pour l'ouvrir dans n'importe quel navigateur moderne (**Google Chrome**, **Mozilla Firefox**, **Microsoft Edge**, **Brave**, **Safari**).
2. Aucun serveur ni installation de paquet n'est requis : l'intégralité des 42 outils fonctionne immédiatement.

### Option B : Lancement sous serveur PHP (XAMPP, WAMP, Laragon ou CLI)
Si vous disposez d'un environnement PHP :
1. Placez le dossier du projet dans le répertoire de votre serveur web (ex: `htdocs` ou `www`).
2. Ou lancez le serveur intégré PHP depuis la racine du dossier :
   ```bash
   php -S localhost:8000
   ```
3. Rendez-vous sur `http://localhost:8000` (le fichier `index.php` et l'endpoint `api/api.php` seront automatiquement actifs avec affichage de la version PHP).

---

## 💻 Technologies Utilisées

- **HTML5** sémantique avec balisage accessible et meta SEO.
- **CSS3 pur** : variables CSS (Custom Properties), Flexbox, CSS Grid, Glassmorphism, animations fluides (aucun framework lourd comme Tailwind ou Bootstrap).
- **JavaScript Vanilla (ES6+)** : architecture modulaire sans outil de build, sans Node.js, sans bundler (Webpack/Vite/Rollup).
- **Web Audio API** : synthèse sonore native sans fichiers MP3/WAV externes (cliquetis d'inertie de la roue, bruiteur pour la pluie, le café et les vagues).
- **HTML5 Canvas 2D** : graphiques financiers vectoriels, animation physique de la roue et traitement d'image pixel par pixel.
- **PHP** : scripts natifs pour l'hébergement serveur standard et API utilitaire.
- **Bibliothèques autonomes chargées via CDN** :
  - [PDF-Lib](https://pdf-lib.js.org/) (manipulation et modification de PDF locale)
  - [PDF.js](https://mozilla.github.io/pdf.js/) (moteur de rendu, visualisation et extraction vectorielle de PDF)
  - [Tesseract.js](https://tesseract.projectnaptha.com/) (moteur OCR client-side)
  - [Marked.js](https://marked.js.org/) (compilateur Markdown haute performance)
  - [JSZip](https://stuk.github.io/jszip/) (création d'archives ZIP à la volée pour Favicons, images PDF et Instagram)
  - [QRCode.js](https://davidshimjs.github.io/qrcodejs/) (génération vectorielle de QR Codes)

---

## 🤖 Mention de Génération par IA

> **Avertissement & Transparence :**  
> Ce projet, incluant la conception de l'architecture logicielle, le code source HTML, CSS, JavaScript et PHP, ainsi que la présente documentation, a été **entièrement conçu et généré par une Intelligence Artificielle** (Google DeepMind / Antigravity).

---

## 📄 Licence

Ce projet est distribué sous la **[Licence libre MIT](LICENSE)** (Massachusetts Institute of Technology).

Cette licence open-source permissive vous garantit une liberté totale pour :
- 🚀 **Auto-héberger librement** : Installez et déployez ToolSuite sur vos propres serveurs, machines locales, NAS ou VPS.
- 🛠️ **Modifier & Adapter** : Personnalisez l'interface, ajoutez de nouveaux outils ou ajustez les fonctionnalités à vos besoins.
- 💼 **Usage personnel & commercial** : Utilisez les 42 outils librement, sans frais ni redevance, pour des besoins individuels, associatifs ou professionnels.
- 📢 **Redistribuer** : Partagez ou forkez le projet en conservant la notice de copyright et la licence MIT originale.

