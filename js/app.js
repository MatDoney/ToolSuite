/**
 * ToolSuite - Core Application Router & Search System
 * Manages Dashboard, 30 Tools, Fast Search (Ctrl+K), and Views
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

const App = {
  activeCategory: 'all',
  currentToolId: null,

  init() {
    UI.initTheme();
    this.renderDashboardCards();
    this.initNavigation();
    this.initQuickSearch();
    this.initTools();

    // Check URL hash for direct tool linking (ex: #tool-qrcode)
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  },

  handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    if (hash && TOOLS_CATALOG.some(t => t.id === hash)) {
      this.openTool(hash);
    } else {
      this.showDashboard();
    }
  },

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

  initNavigation() {
    // Category filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.renderDashboardCards();
      });
    });

    // Sidebar navigation links
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
          const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
          if (targetBtn) targetBtn.click();
        }

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close mobile sidebar if open
        document.getElementById('app-sidebar')?.classList.remove('open');
      });
    });

    // Back to dashboard buttons
    document.querySelectorAll('.back-to-dash-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '';
        this.showDashboard();
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  },

  showDashboard() {
    this.currentToolId = null;
    document.getElementById('dashboard-view').style.display = 'block';
    document.querySelectorAll('.tool-view-wrapper').forEach(view => view.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openTool(toolId) {
    const tool = TOOLS_CATALOG.find(t => t.id === toolId);
    if (!tool) return;

    this.currentToolId = toolId;
    window.location.hash = toolId;

    document.getElementById('dashboard-view').style.display = 'none';
    document.querySelectorAll('.tool-view-wrapper').forEach(view => view.classList.remove('active'));

    const targetView = document.getElementById(`view-${toolId}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  initQuickSearch() {
    const modalBackdrop = document.getElementById('search-modal-backdrop');
    const searchInput = document.getElementById('search-modal-input');
    const searchResults = document.getElementById('search-modal-results');
    const searchTrigger = document.getElementById('search-trigger-btn');

    let selectedIndex = 0;
    let filteredTools = [...TOOLS_CATALOG];

    const openSearch = () => {
      modalBackdrop.classList.add('open');
      searchInput.value = '';
      selectedIndex = 0;
      renderResults();
      setTimeout(() => searchInput.focus(), 50);
    };

    const closeSearch = () => {
      modalBackdrop.classList.remove('open');
    };

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
    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSearch();
    });

    searchInput?.addEventListener('input', () => {
      selectedIndex = 0;
      renderResults();
    });

    // Keyboard Shortcuts (Ctrl + K or /)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
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

    this.selectSearchResult = (toolId) => {
      closeSearch();
      this.openTool(toolId);
    };
  },

  initTools() {
    // Initialize all tool modules once
    try { if (window.PDFTools) PDFTools.init(); } catch (e) { console.error(e); }
    try { if (window.OCRTool) OCRTool.init(); } catch (e) { console.error(e); }
    try { if (window.MarkdownTool) MarkdownTool.init(); } catch (e) { console.error(e); }
    try { if (window.ImageTools) ImageTools.init(); } catch (e) { console.error(e); }
    try { if (window.BgRemover) BgRemover.init(); } catch (e) { console.error(e); }
    try { if (window.DevTools) DevTools.init(); } catch (e) { console.error(e); }
    try { if (window.UtilityTools) UtilityTools.init(); } catch (e) { console.error(e); }
    try { if (window.TextTools) TextTools.init(); } catch (e) { console.error(e); }
    try { if (window.ProductivityTools) ProductivityTools.init(); } catch (e) { console.error(e); }
    try { if (window.FinanceTools) FinanceTools.init(); } catch (e) { console.error(e); }
    try { if (window.MarketingTools) MarketingTools.init(); } catch (e) { console.error(e); }
    try { if (window.WheelTool) WheelTool.init(); } catch (e) { console.error(e); }
  }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());
