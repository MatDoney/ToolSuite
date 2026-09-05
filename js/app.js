/**
 * @file app.js
 * @description Routeur central, catalogue exhaustif des 42 outils et système de recherche instantanée de ToolSuite.
 * Gère l'affichage dynamique de la grille du tableau de bord, le filtrage par catégories, la navigation
 * par ancres d'URL (Hash routing type '#tool-id'), le panneau de recherche globale rapide (raccourci Ctrl+K ou '/')
 * avec navigation au clavier (flèches haut/bas, Entrée, Échap), et le cycle de vie d'initialisation de chaque module.
 * @module App
 */

/**
 * @typedef {Object} ToolItem
 * @property {string} id - Identifiant unique de l'outil correspondant à son ancre d'URL et à l'ID de sa vue HTML (ex: 'tool-pdf-merge').
 * @property {string} name - Intitulé principal de l'outil affiché sur la carte et dans la barre de titre.
 * @property {string} category - Identifiant technique de la catégorie principale ('doc', 'image', 'dev', 'util', 'text', 'time', 'finance', 'marketing').
 * @property {string[]} [categories] - Tableau optionnel de catégories secondaires pour indexation multiple (ex: ['util', 'image']).
 * @property {string} categoryLabel - Nom lisible de la catégorie affiché sur les badges.
 * @property {string} desc - Description synthétique des fonctionnalités offertes par l'outil.
 * @property {string} tag - Badge technique mettant en valeur les librairies ou spécificités (ex: 'PDF-Lib • Illimité', 'Canvas Alpha').
 * @property {string} icon - Émoji ou symbole graphique distinctif.
 * @property {string} iconClass - Classe CSS d'habillage colorimétrique de l'icône ('icon-doc', 'icon-image', 'icon-dev', 'icon-util').
 */

/**
 * Répertoire exhaustif des 42 outils web disponibles dans l'application.
 * @type {ToolItem[]}
 */
const TOOLS_CATALOG = [
  // 1. Documents & PDF
  {
    id: 'tool-pdf-merge',
    name: 'Fusion de PDF',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Assemblez plusieurs documents PDF en un seul fichier réorganisable par glisser-déposer.',
    tag: 'PDF-Lib • Illimité',
    icon: '📑',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-split',
    name: 'Séparation de PDF',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Extrayez des pages spécifiques ou découpez un PDF par plages de numéros de pages.',
    tag: 'Extraction rapide',
    icon: '✂️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-compress',
    name: 'Compresseur de PDF',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Réduisez le poids de vos fichiers PDF pour faciliter les envois par e-mail et le stockage.',
    tag: 'Optimisation de flux',
    icon: '🗜️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-ocr',
    name: 'Extracteur de texte (OCR)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Transformez vos scans et images en texte éditable grâce à Tesseract OCR en local.',
    tag: 'Tesseract.js • Multi-langues',
    icon: '👁️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-markdown',
    name: 'Convertisseur Markdown',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Éditeur Markdown en direct avec prévisualisation temps réel, export en HTML et impression PDF.',
    tag: 'Marked • Live Preview',
    icon: '📝',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-redact',
    name: 'Outil de caviardage (Redact)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Masquez et détruisez physiquement les données sensibles (noms, IBAN) du code source du PDF.',
    tag: 'Sécurité • Destruction physique',
    icon: '🔲',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-password',
    name: 'Gestionnaire de mots de passe',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Verrouillez un PDF par mot de passe ou retirez définitivement la protection d\'un fichier déverrouillé.',
    tag: 'Chiffrement • Déverrouillage',
    icon: '🔐',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-flatten',
    name: 'Aplatissement de PDF (Flatten)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Figez les formulaires interactifs, annotations et calques pour les transformer en contenu fixe non modifiable.',
    tag: 'AcroForms • Image fixe',
    icon: '📄',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-reorder',
    name: 'Réorganisation visuelle & Rotation',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Changez l\'ordre des pages par glisser-déposer, redressez les pages inversées ou supprimez des pages.',
    tag: 'Drag & Drop • Rotation 360°',
    icon: '🔄',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-crop',
    name: 'Recadrage de marges (Crop)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Découpez les marges blanches superflues d\'un PDF pour l\'adapter aux liseuses et smartphones.',
    tag: 'Auto-détection • Marges',
    icon: '✂️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-extract-img',
    name: 'Extracteur d\'images',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Extrayez automatiquement toutes les images incorporées dans un PDF et téléchargez-les en archive ZIP.',
    tag: 'Haute résolution • Export ZIP',
    icon: '🖼️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-signature',
    name: 'Outil de signature',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Dessinez votre signature, importez un scan ou tapez votre nom en cursive et apposez-la sur le document.',
    tag: 'Dessin • Scan • Cursive',
    icon: '✍️',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-watermark',
    name: 'Générateur de filigrane',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Appliquez un filigrane textuel ("CONFIDENTIEL", "BROUILLON") ou un logo semi-transparent sur vos pages.',
    tag: 'Opacité • Rotation 45°',
    icon: '💧',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf-numbering',
    name: 'Numérotation automatique',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Insérez des numéros de page dans les en-têtes ou pieds de page avec choix du format ("1/10", "Page 1 sur N").',
    tag: 'En-têtes • Pieds de page',
    icon: '🔢',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-url2pdf',
    name: 'URL vers PDF (Mode Lecture)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Convertissez n\'importe quel article web en document PDF épuré sans publicité, idéal pour l\'archivage.',
    tag: 'Archivage web • Sans pub',
    icon: '🌐',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-pdf2excel',
    name: 'PDF vers Excel (Tableaux)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Repérez automatiquement les structures de lignes et colonnes dans un PDF et exportez en CSV ou Excel.',
    tag: 'Extraction tabulaire • CSV / XLS',
    icon: '📊',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-img2pdf',
    name: 'Images vers PDF (Multi-images)',
    category: 'doc',
    categoryLabel: 'Documents & PDF',
    desc: 'Assemblez plusieurs photos et images (JPG, PNG, WebP) au sein d\'un document PDF unique bien cadré.',
    tag: 'Multi-images • A4 / Ajusté',
    icon: '📷',
    iconClass: 'icon-doc'
  },

  // 2. Traitement d'Images & Médias
  {
    id: 'tool-img-convert',
    name: 'Convertisseur d\'images',
    category: 'image',
    categoryLabel: 'Images & Médias',
    desc: 'Convertissez vos visuels en JPG, PNG, WebP ultra-léger ou conteneur vectoriel SVG.',
    tag: 'Multi-formats • WebP',
    icon: '🔄',
    iconClass: 'icon-image'
  },
  {
    id: 'tool-img-compress',
    name: 'Compresseur d\'images',
    category: 'image',
    categoryLabel: 'Images & Médias',
    desc: 'Réduisez le poids de vos images jusqu\'à 85% avec prévisualisation et comparateur direct.',
    tag: 'Qualité réglable • -80%',
    icon: '⚡',
    iconClass: 'icon-image'
  },
  {
    id: 'tool-favicon',
    name: 'Générateur de Favicon',
    category: 'image',
    categoryLabel: 'Images & Médias',
    desc: 'Générez instantanément toutes les tailles d\'icônes (iOS, Android, Web) et téléchargez le ZIP.',
    tag: 'Pack complet • ZIP',
    icon: '⭐',
    iconClass: 'icon-image'
  },
  {
    id: 'tool-bg-remover',
    name: 'Suppresseur d\'arrière-plan',
    category: 'image',
    categoryLabel: 'Images & Médias',
    desc: 'Détourez le sujet principal d\'une photo avec baguette magique, lissage et pinceau gomme.',
    tag: 'Canvas Alpha • Détourage',
    icon: '🪄',
    iconClass: 'icon-image'
  },

  // 3. Outils Développeur (DevTools)
  {
    id: 'tool-json-formatter',
    name: 'Formateur & Validateur JSON',
    category: 'dev',
    categoryLabel: 'DevTools',
    desc: 'Validez, indentez, minifiez et explorez vos objets JSON avec repérage des erreurs de syntaxe.',
    tag: 'Arbre colorisé • Minify',
    icon: '{ }',
    iconClass: 'icon-dev'
  },
  {
    id: 'tool-regex-tester',
    name: 'Testeur Regex Interactif',
    category: 'dev',
    categoryLabel: 'DevTools',
    desc: 'Testez et validez vos expressions régulières avec surlignage en temps réel et capture de groupes.',
    tag: 'Temps réel • Groupes $1',
    icon: '.*',
    iconClass: 'icon-dev'
  },
  {
    id: 'tool-css-shadow',
    name: 'Générateur d\'ombres & Neumorphisme',
    category: 'dev',
    categoryLabel: 'DevTools',
    desc: 'Créez visuellement des ombres box-shadow et du style Neumorphisme avec copie du code CSS.',
    tag: 'Soft UI • CSS3',
    icon: '🎨',
    iconClass: 'icon-dev'
  },
  {
    id: 'tool-base64',
    name: 'Encodeur / Décodeur Base64',
    category: 'dev',
    categoryLabel: 'DevTools',
    desc: 'Convertissez instantanément textes (avec UTF-8) et fichiers/images en chaînes Base64 sécurisées.',
    tag: 'Data URL • UTF-8 Safe',
    icon: '🔒',
    iconClass: 'icon-dev'
  },

  // 4. Utilitaires Quotidiens
  {
    id: 'tool-qrcode',
    name: 'Générateur de QR Codes',
    category: 'util',
    categoryLabel: 'Utilitaires',
    desc: 'Créez des QR Codes personnalisés pour Wi-Fi, Cartes de visite vCard, URL et menus de restaurant.',
    tag: 'Wi-Fi • vCard • SVG',
    icon: '📱',
    iconClass: 'icon-util'
  },
  {
    id: 'tool-password',
    name: 'Générateur de mots de passe',
    category: 'util',
    categoryLabel: 'Utilitaires',
    desc: 'Générez des mots de passe ultra-sécurisés avec mesure de l\'entropie mathématique en temps réel.',
    tag: 'Crypto-sécurisé • Entropie',
    icon: '🔑',
    iconClass: 'icon-util'
  },
  {
    id: 'tool-color-palette',
    name: 'Extracteur de palette de couleurs',
    category: 'util',
    categories: ['util', 'image'],
    categoryLabel: 'Utilitaires & Images',
    desc: 'Uploader une image pour obtenir instantanément les codes hexadécimaux et RGB de ses couleurs dominantes.',
    tag: 'Extraction HEX • Pipette • CSS',
    icon: '🎯',
    iconClass: 'icon-util'
  },

  // 5. Outils de Texte et Rédaction
  {
    id: 'tool-diff',
    name: 'Comparateur de texte (Diff)',
    category: 'text',
    categoryLabel: 'Texte & Rédaction',
    desc: 'Comparez deux textes et mettez en évidence les ajouts, suppressions et modifications à la manière de GitHub.',
    tag: 'Diff visuel • Ligne par ligne',
    icon: '🔍',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-word-counter',
    name: 'Compteur de mots avancé',
    category: 'text',
    categoryLabel: 'Texte & Rédaction',
    desc: 'Analysez en temps réel le nombre de mots, caractères, temps de lecture et la densité des mots-clés dominants.',
    tag: 'Densité • Temps de lecture',
    icon: '📊',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-case-converter',
    name: 'Convertisseur de casse',
    category: 'text',
    categoryLabel: 'Texte & Rédaction',
    desc: 'Convertissez instantanément vos textes en camelCase, snake_case, PascalCase, kebab-case et majuscules/minuscules.',
    tag: '9 formats • Copie rapide',
    icon: '🔤',
    iconClass: 'icon-doc'
  },
  {
    id: 'tool-text-cleaner',
    name: 'Nettoyeur de texte',
    category: 'text',
    categoryLabel: 'Texte & Rédaction',
    desc: 'Supprimez les doubles espaces, sauts de ligne superflus, balises HTML et caractères indésirables.',
    tag: 'Purification • Économie d\'octets',
    icon: '🧹',
    iconClass: 'icon-doc'
  },

  // 6. Productivité et Temps
  {
    id: 'tool-timezone',
    name: 'Planificateur de fuseaux horaires',
    category: 'time',
    categoryLabel: 'Productivité & Temps',
    desc: 'Visualisez les heures de travail qui se chevauchent entre plusieurs pays pour planifier des réunions sans erreur.',
    tag: 'Frise 24h • Horaires de bureau',
    icon: '🌍',
    iconClass: 'icon-util'
  },
  {
    id: 'tool-date-calc',
    name: 'Calculateur de dates',
    category: 'time',
    categoryLabel: 'Productivité & Temps',
    desc: 'Calculez la durée exacte entre deux dates, le nombre de jours ouvrés ou projetez une date future.',
    tag: 'Jours ouvrés • Projection',
    icon: '📅',
    iconClass: 'icon-util'
  },
  {
    id: 'tool-pomodoro',
    name: 'Minuteur Pomodoro',
    category: 'time',
    categoryLabel: 'Productivité & Temps',
    desc: 'Minuteur de concentration minimaliste avec gestion de tâches et bruits blancs intégrés (pluie, café, vagues).',
    tag: 'Focus • Web Audio API',
    icon: '⏱️',
    iconClass: 'icon-util'
  },

  // 7. Finance et Calculs Rapides
  {
    id: 'tool-percentage',
    name: 'Calculateur de pourcentages',
    category: 'finance',
    categoryLabel: 'Finance & Calculs',
    desc: 'Résolvez instantanément tous vos calculs de pourcentages, augmentations, réductions et remises commerciales.',
    tag: '4 modes • Calcul instantané',
    icon: '％',
    iconClass: 'icon-dev'
  },
  {
    id: 'tool-split-bill',
    name: 'Partage d\'addition (Split Bill)',
    category: 'finance',
    categoryLabel: 'Finance & Calculs',
    desc: 'Divisez la note d\'un restaurant ou d\'un achat de groupe en calculant le pourboire et le montant par personne.',
    tag: 'Pourboire • Récapitulatif copiable',
    icon: '🧾',
    iconClass: 'icon-dev'
  },
  {
    id: 'tool-compound-interest',
    name: 'Simulateur d\'intérêts composés',
    category: 'finance',
    categoryLabel: 'Finance & Calculs',
    desc: 'Simulez l\'évolution de votre épargne sur 1 à 40 ans avec graphique interactif comparant capital et intérêts.',
    tag: 'Graphique Canvas • Projection',
    icon: '📈',
    iconClass: 'icon-dev'
  },

  // 8. Marketing et Réseaux Sociaux
  {
    id: 'tool-meta-preview',
    name: 'Aperçu de balises Meta',
    category: 'marketing',
    categoryLabel: 'Marketing & Réseaux',
    desc: 'Visualisez exactement le rendu de vos liens sur Twitter / X, LinkedIn et Facebook avec génération du code HTML.',
    tag: 'OpenGraph • Twitter Cards',
    icon: '📱',
    iconClass: 'icon-image'
  },
  {
    id: 'tool-utm-builder',
    name: 'Générateur de liens UTM',
    category: 'marketing',
    categoryLabel: 'Marketing & Réseaux',
    desc: 'Créez des URLs de suivi avec paramètres UTM personnalisés (source, medium, campagne) pour Google Analytics.',
    tag: 'Tracking • Google Analytics',
    icon: '🔗',
    iconClass: 'icon-image'
  },
  {
    id: 'tool-insta-grid',
    name: 'Créateur de grilles Instagram',
    category: 'marketing',
    categoryLabel: 'Marketing & Réseaux',
    desc: 'Découpez vos photos en 3, 6 ou 9 carrés parfaits avec numérotation d\'ordre de publication et export en archive ZIP.',
    tag: 'Mosaïque 3x3 • Export ZIP',
    icon: '📸',
    iconClass: 'icon-image'
  },

  // 9. Tirage au sort
  {
    id: 'tool-wheel',
    name: 'Roue de tirage au sort',
    category: 'util',
    categories: ['util', 'marketing'],
    categoryLabel: 'Utilitaires & Jeux',
    desc: 'Entrez une liste de noms ou d\'options et lancez la roue interactive avec rotation physique, bruitage et confettis.',
    tag: 'Roue physique • Sons & Confettis',
    icon: '🎡',
    iconClass: 'icon-util'
  }
];

/**
 * Objet d'orchestration principal de l'application cliente ToolSuite.
 * @namespace App
 */
const App = {
  /** @type {string} Identifiant du filtre de catégorie actif ('all' par défaut) */
  activeCategory: 'all',
  /** @type {string|null} Identifiant de l'outil actuellement ouvert à l'écran (ou null si sur le tableau de bord) */
  currentToolId: null,
  /** @type {(toolId: string) => void} Fonction de sélection d'un résultat de recherche */
  selectSearchResult: () => {},

  /**
   * Point d'entrée principal de l'application déclenché au chargement du DOM.
   * Configure le thème sombre/clair, génère les cartes, attache la navigation et initialise les outils.
   * @function init
   * @memberof App
   * @returns {void}
   */
  init() {
    UI.initTheme();
    this.renderDashboardCards();
    this.initNavigation();
    this.initQuickSearch();
    this.initTools();

    // Surveillance des changements d'ancre dans l'URL pour le routage direct (ex: #tool-qrcode)
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  },

  /**
   * Interprète le fragment d'URL actif (hash) et affiche l'outil correspondant ou le tableau de bord.
   * @function handleHashChange
   * @memberof App
   * @returns {void}
   */
  handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash && TOOLS_CATALOG.some(t => t.id === hash)) {
      this.openTool(hash);
    } else {
      this.showDashboard();
    }
  },

  /**
   * Génère dynamiquement le balisage HTML des vignettes du tableau de bord selon la catégorie active.
   * @function renderDashboardCards
   * @memberof App
   * @returns {void}
   */
  renderDashboardCards() {
    const grid = document.getElementById('tools-dashboard-grid');
    if (!grid) return;

    const filtered = this.activeCategory === 'all' 
      ? TOOLS_CATALOG 
      : TOOLS_CATALOG.filter(t => t.category === this.activeCategory || (Array.isArray(t.categories) && t.categories.includes(this.activeCategory)));

    grid.innerHTML = filtered.map(tool => `
      <div class="tool-card" onclick="App.openTool('${tool.id}')">
        <div class="tool-card-header">
          <div class="tool-icon-wrapper ${tool.iconClass}">${tool.icon}</div>
          <span class="tool-category-badge">${tool.categoryLabel}</span>
        </div>
        <h3 class="tool-title">${tool.name}</h3>
        <p class="tool-desc">${tool.desc}</p>
        <div class="tool-card-footer">
          <span class="tool-tag">${tool.tag}</span>
          <span class="tool-open-btn">Ouvrir →</span>
        </div>
      </div>
    `).join('');
  },

  /**
   * Attache les écouteurs d'événements pour les boutons de filtre, la barre latérale et le menu mobile.
   * @function initNavigation
   * @memberof App
   * @returns {void}
   */
  initNavigation() {
    // Boutons de filtrage par catégorie
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category') || 'all';
        this.renderDashboardCards();
      });
    });

    // Liens de navigation de la barre latérale
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-nav-category');
        const toolId = link.getAttribute('data-nav-tool');

        if (toolId) {
          this.openTool(toolId);
        } else if (cat) {
          this.showDashboard();
          const targetBtn = /** @type {HTMLElement|null} */ (document.querySelector(`.filter-btn[data-category="${cat}"]`));
          if (targetBtn) targetBtn.click();
        }

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Fermeture du menu rétractable sur mobile
        document.getElementById('app-sidebar')?.classList.remove('open');
      });
    });

    // Boutons de retour au tableau de bord principal
    document.querySelectorAll('.back-to-dash-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '';
        this.showDashboard();
      });
    });

    // Bouton de bascule du menu mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  },

  /**
   * Affiche la vue principale du tableau de bord et masque toute vue d'outil ouverte.
   * @function showDashboard
   * @memberof App
   * @returns {void}
   */
  showDashboard() {
    this.currentToolId = null;
    const dashView = document.getElementById('dashboard-view');
    if (dashView) dashView.style.display = 'block';
    document.querySelectorAll('.tool-view-wrapper').forEach(view => view.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Ouvre la vue dédiée d'un outil et synchronise l'ancre d'URL correspondante.
   * @function openTool
   * @memberof App
   * @param {string} toolId - Identifiant unique de l'outil (ex: 'tool-ocr').
   * @returns {void}
   */
  openTool(toolId) {
    const tool = TOOLS_CATALOG.find(t => t.id === toolId);
    if (!tool) return;

    this.currentToolId = toolId;
    window.location.hash = toolId;

    const dashView = document.getElementById('dashboard-view');
    if (dashView) dashView.style.display = 'none';
    document.querySelectorAll('.tool-view-wrapper').forEach(view => view.classList.remove('active'));

    const targetView = document.getElementById(`view-${toolId}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Initialise le modal de recherche globale prédictive (Palette de commandes).
   * Gère le déclenchement par raccourci clavier (Ctrl+K ou touche '/') et la sélection au clavier.
   * @function initQuickSearch
   * @memberof App
   * @returns {void}
   */
  initQuickSearch() {
    const modalBackdrop = /** @type {HTMLElement|null} */ (document.getElementById('search-modal-backdrop'));
    const searchInput = /** @type {HTMLInputElement|null} */ (document.getElementById('search-modal-input'));
    const searchResults = document.getElementById('search-modal-results');
    const searchTrigger = document.getElementById('search-trigger-btn');

    if (!modalBackdrop || !searchInput || !searchResults) return;

    let selectedIndex = 0;
    let filteredTools = [...TOOLS_CATALOG];

    /**
     * Ouvre la boîte de dialogue de recherche et donne le focus au champ de saisie.
     * @inner
     */
    const openSearch = () => {
      modalBackdrop.classList.add('open');
      searchInput.value = '';
      selectedIndex = 0;
      renderResults();
      setTimeout(() => searchInput.focus(), 50);
    };

    /**
     * Ferme la boîte de dialogue de recherche.
     * @inner
     */
    const closeSearch = () => {
      modalBackdrop.classList.remove('open');
    };

    /**
     * Filtre les outils et régénère les éléments correspondants dans le menu déroulant.
     * @inner
     */
    const renderResults = () => {
      const q = searchInput.value.toLowerCase().trim();
      filteredTools = TOOLS_CATALOG.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.desc.toLowerCase().includes(q) || 
        t.tag.toLowerCase().includes(q) || 
        t.categoryLabel.toLowerCase().includes(q)
      );

      if (filteredTools.length === 0) {
        searchResults.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Aucun outil trouvé pour "${q}"</div>`;
        return;
      }

      searchResults.innerHTML = filteredTools.map((t, idx) => `
        <div class="search-item ${idx === selectedIndex ? 'selected' : ''}" onclick="App.selectSearchResult('${t.id}')">
          <div class="search-item-icon ${t.iconClass}">${t.icon}</div>
          <div class="search-item-info">
            <div class="search-item-title">${t.name}</div>
            <div class="search-item-desc">${t.desc}</div>
          </div>
          <span class="search-item-category">${t.categoryLabel}</span>
        </div>
      `).join('');
    };

    searchTrigger?.addEventListener('click', openSearch);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSearch();
    });

    searchInput.addEventListener('input', () => {
      selectedIndex = 0;
      renderResults();
    });

    // Raccourcis clavier globaux (Ctrl+K ou '/' lorsque le curseur n'est pas dans un champ texte)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA')) {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        closeSearch();
      } else if (modalBackdrop.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % filteredTools.length;
          renderResults();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + filteredTools.length) % filteredTools.length;
          renderResults();
        } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
          e.preventDefault();
          this.selectSearchResult(filteredTools[selectedIndex].id);
        }
      }
    });

    /**
     * Sélectionne un résultat dans la recherche, ferme le modal et charge l'outil ciblé.
     * @param {string} toolId - Identifiant de l'outil sélectionné.
     */
    this.selectSearchResult = (toolId) => {
      closeSearch();
      this.openTool(toolId);
    };
  },

  /**
   * Déclenche l'initialisation sécurisée de chaque sous-module JavaScript de la suite.
   * Enveloppe chaque appel dans un bloc try/catch pour isoler les éventuelles exceptions locales.
   * @function initTools
   * @memberof App
   * @returns {void}
   */
  initTools() {
    try { if (/** @type {any} */ (window).PDFTools) /** @type {any} */ (window).PDFTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).PdfAdvancedTools) /** @type {any} */ (window).PdfAdvancedTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).OCRTool) /** @type {any} */ (window).OCRTool.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).MarkdownTool) /** @type {any} */ (window).MarkdownTool.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).ImageTools) /** @type {any} */ (window).ImageTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).BgRemover) /** @type {any} */ (window).BgRemover.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).DevTools) /** @type {any} */ (window).DevTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).UtilityTools) /** @type {any} */ (window).UtilityTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).TextTools) /** @type {any} */ (window).TextTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).ProductivityTools) /** @type {any} */ (window).ProductivityTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).FinanceTools) /** @type {any} */ (window).FinanceTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).MarketingTools) /** @type {any} */ (window).MarketingTools.init(); } catch (e) { console.error(e); }
    try { if (/** @type {any} */ (window).WheelTool) /** @type {any} */ (window).WheelTool.init(); } catch (e) { console.error(e); }
  }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());
