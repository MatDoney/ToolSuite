/**
 * @file marketing-tools.js
 * @description Suite d'outils marketing et de gestion des réseaux sociaux 100% exécutés côté client (Vanilla JS).
 * Comprend un prévisualisateur de balises Open Graph et Twitter Cards avec générateur de balises HTML,
 * un constructeur d'URLs avec paramètres de tracking UTM pour outils d'analyse (Google Analytics, Matomo, etc.),
 * et un découpeur d'images en grilles panoramiques pour Instagram (3, 6 ou 9 carrés) avec export compressé ZIP ordonné.
 * @module MarketingTools
 */

/**
 * @typedef {Object} InstagramCroppedTile
 * @property {Blob} blob - Données binaires de la vignette découpée en JPEG.
 * @property {number} order - Ordre chronologique de publication sur Instagram (le post #1 se publiant en premier pour finir en bas à droite).
 * @property {string} filename - Nom de fichier séquentiel préconisé pour l'export.
 */

/**
 * Espace de nom principal pour les outils marketing et social media.
 * @namespace MarketingTools
 */
const MarketingTools = {
  /**
   * Initialise l'ensemble des modules d'outils marketing au démarrage de l'application.
   * @function init
   * @memberof MarketingTools
   * @returns {void}
   */
  init() {
    this.initMetaPreview();
    this.initUtmBuilder();
    this.initInstagramGrid();
  },

  /* ================= 1. APERÇU DE BALISES META ================= */
  /**
   * Initialise le simulateur d'aperçu de partage sur les réseaux sociaux (Facebook, Twitter/X, LinkedIn)
   * et le générateur de balises méta HTML correspondantes.
   * Met à jour en temps réel le DOM des aperçus visuels et le bloc de code HTML copiable.
   * @function initMetaPreview
   * @memberof MarketingTools
   * @returns {void}
   */
  initMetaPreview() {
    const titleInput = /** @type {HTMLInputElement|null} */ (document.getElementById('meta-title'));
    const descInput = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('meta-desc'));
    const urlInput = /** @type {HTMLInputElement|null} */ (document.getElementById('meta-url'));
    const imgInput = /** @type {HTMLInputElement|null} */ (document.getElementById('meta-img'));
    const sampleBtn = document.getElementById('meta-sample-btn');
    const copyHtmlBtn = document.getElementById('meta-copy-html-btn');

    if (!titleInput) return;

    /**
     * Rafraîchit les cartes d'aperçu social média et régénère le bloc de balises meta HTML.
     * @inner
     */
    const updatePreview = () => {
      const title = titleInput.value.trim() || 'Titre de la page partagée';
      const desc = descInput?.value.trim() || 'Description concise du contenu telle qu\'elle apparaîtra sur les réseaux sociaux.';
      let url = urlInput?.value.trim() || 'https://votre-site.com/article';
      const img = imgInput?.value.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop';

      let domain = 'votre-site.com';
      try {
        domain = new URL(url).hostname;
      } catch (e) {
        // En cas d'URL incomplète ou mal formée
      }

      // Mise à jour de l'ensemble des textes d'aperçu pour chaque réseau
      const setAll = (sel, val) => document.querySelectorAll(sel).forEach(el => el.textContent = val);
      setAll('.social-prev-title', title);
      setAll('.social-prev-desc', desc);
      setAll('.social-prev-domain', domain);

      // Mise à jour des visuels d'arrière-plan ou balises <img>
      document.querySelectorAll('.social-prev-img').forEach(el => {
        if (el.tagName === 'IMG') {
          /** @type {HTMLImageElement} */ (el).src = img;
        } else {
          /** @type {HTMLElement} */ (el).style.backgroundImage = `url("${img}")`;
        }
      });

      // Génération du code source HTML complet prêt à insérer dans le <head>
      const codeEl = document.getElementById('meta-generated-code');
      if (codeEl) {
        const html = `<!-- Balises Standards & Référencement -->
<title>${title}</title>
<meta name="description" content="${desc}">

<!-- Open Graph (Facebook, LinkedIn, Discord) -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${img}">

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">`;
        codeEl.textContent = html;
      }
    };

    [titleInput, descInput, urlInput, imgInput].forEach(inp => inp?.addEventListener('input', updatePreview));

    // Bouton de pré-remplissage avec des données de démonstration réalistes
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        titleInput.value = 'ToolSuite — Suite Complète de 30 Outils Web 100% Locaux';
        if (descInput) descInput.value = 'Manipulez vos PDF, compressez vos images, calculez vos devises et testez vos expressions régulières en direct sans aucun serveur.';
        if (urlInput) urlInput.value = 'https://toolsuite.dev/tools';
        if (imgInput) imgInput.value = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop';
        updatePreview();
      });
    }

    // Copie presse-papiers du code HTML généré
    if (copyHtmlBtn) {
      copyHtmlBtn.addEventListener('click', () => {
        const codeEl = document.getElementById('meta-generated-code');
        if (codeEl) {
          UI.copy(codeEl.textContent || '', copyHtmlBtn, 'Balises HTML copiées !');
        }
      });
    }

    updatePreview();
  },

  /* ================= 2. GÉNÉRATEUR DE LIENS UTM ================= */
  /**
   * Initialise le constructeur de paramètres UTM (Urchin Tracking Module).
   * Assemble en direct une URL enrichie pour le suivi des campagnes (source, medium, campaign, term, content).
   * Fournit des pastilles de raccourcis rapides pour les sources d'acquisition courantes (LinkedIn, Facebook, Email, CPC).
   * @function initUtmBuilder
   * @memberof MarketingTools
   * @returns {void}
   */
  initUtmBuilder() {
    const baseInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-base-url'));
    const sourceInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-source'));
    const mediumInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-medium'));
    const campaignInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-campaign'));
    const termInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-term'));
    const contentInput = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-content'));
    const outputEl = /** @type {HTMLInputElement|null} */ (document.getElementById('utm-output-url'));
    const copyBtn = document.getElementById('utm-copy-btn');
    const sampleBtn = document.getElementById('utm-sample-btn');

    if (!baseInput || !outputEl) return;

    /**
     * Analyse l'URL de base saisie et y concatène les paramètres UTM renseignés.
     * @inner
     */
    const generateUrl = () => {
      let rawBase = baseInput.value.trim();
      if (!rawBase) {
        outputEl.value = '';
        return;
      }

      // Préfixe automatiquement avec https:// si le protocole est omis
      if (!rawBase.startsWith('http://') && !rawBase.startsWith('https://')) {
        rawBase = 'https://' + rawBase;
      }

      try {
        const url = new URL(rawBase);

        /**
         * Définit ou supprime un paramètre de requête dans l'URL.
         * @param {string} key - Nom du paramètre d'URL (ex: 'utm_source').
         * @param {string|undefined} val - Valeur à assigner.
         */
        const setParam = (key, val) => {
          if (val && val.trim()) url.searchParams.set(key, val.trim());
          else url.searchParams.delete(key);
        };

        setParam('utm_source', sourceInput?.value);
        setParam('utm_medium', mediumInput?.value);
        setParam('utm_campaign', campaignInput?.value);
        setParam('utm_term', termInput?.value);
        setParam('utm_content', contentInput?.value);

        outputEl.value = url.toString();
      } catch (e) {
        outputEl.value = 'URL invalide';
      }
    };

    [baseInput, sourceInput, mediumInput, campaignInput, termInput, contentInput].forEach(inp => {
      inp?.addEventListener('input', generateUrl);
    });

    // Pastilles de raccourcis rapides pour renseigner instantanément la source ou le medium
    document.querySelectorAll('.utm-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const targetId = pill.getAttribute('data-target');
        const val = pill.getAttribute('data-val');
        const targetEl = /** @type {HTMLInputElement|null} */ (document.getElementById(targetId || ''));
        if (targetEl && val) {
          targetEl.value = val;
          generateUrl();
        }
      });
    });

    // Démonstration guidée
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        baseInput.value = 'https://mon-entreprise.com/lancement-produit';
        if (sourceInput) sourceInput.value = 'linkedin';
        if (mediumInput) mediumInput.value = 'cpc';
        if (campaignInput) campaignInput.value = 'promo_printemps_2026';
        if (termInput) termInput.value = 'outil_productivite';
        if (contentInput) contentInput.value = 'banniere_bleue';
        generateUrl();
      });
    }

    // Copie de l'URL finale dans le presse-papiers
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!outputEl.value || outputEl.value === 'URL invalide') {
          UI.toast('Aucune URL UTM valide à copier.', 'warning');
          return;
        }
        UI.copy(outputEl.value, copyBtn, 'Lien UTM copié !');
      });
    }

    generateUrl();
  },

  /* ================= 3. CRÉATEUR DE GRILLES INSTAGRAM ================= */
  /**
   * Initialise l'outil de découpe d'images pour grilles Instagram en disposition 3 colonnes (1x3, 2x3 ou 3x3 carrés).
   * Gère le centrage automatique, le découpage Canvas haute définition, la numérotation inversée
   * adaptée à l'algorithme d'affichage d'Instagram, ainsi que l'archivage ZIP structuré via JSZip.
   * @function initInstagramGrid
   * @memberof MarketingTools
   * @returns {void}
   */
  initInstagramGrid() {
    const layoutSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById('insta-layout'));
    const container = document.getElementById('insta-grid-tiles');
    const downloadZipBtn = /** @type {HTMLButtonElement|null} */ (document.getElementById('insta-download-zip-btn'));
    const sampleBtn = document.getElementById('insta-sample-btn');

    if (!layoutSelect || !container) return;

    /** @type {HTMLImageElement|null} Image source chargée en mémoire */
    let currentImg = null;
    /** @type {InstagramCroppedTile[]} Liste des vignettes carrées extraites */
    let croppedTiles = [];

    /**
     * Découpe l'image source en carrés parfaits selon la disposition choisie.
     * Calcule l'ordre de publication spécifique à Instagram : les nouveaux posts étant insérés en haut à gauche,
     * la première photo à publier doit obligatoirement être le carré situé en bas à droite de la fresque.
     * @inner
     * @param {HTMLImageElement} img - Image source chargée.
     */
    const processImage = (img) => {
      currentImg = img;
      const count = parseInt(layoutSelect.value, 10) || 9; // 3, 6 ou 9 carrés au total
      const cols = 3;
      const rows = count / cols; // 1, 2 ou 3 rangées

      container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      container.innerHTML = '';
      croppedTiles = [];

      // Calcul de la dimension de chaque carré basée sur la largeur de l'image
      const tileSize = Math.floor(img.width / cols);
      const totalWidth = tileSize * cols;
      const totalHeight = tileSize * rows;

      // Recadrage centré verticalement si l'image est plus haute que la grille nécessaire
      const offsetY = Math.max(0, Math.floor((img.height - totalHeight) / 2));

      let tileIdx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          tileIdx++;
          // Algorithme d'inversion d'ordre Instagram :
          // Le carré #1 est situé en bas à droite (r = rows-1, c = 2).
          const instaPublishOrder = count - tileIdx + 1;

          const canvas = document.createElement('canvas');
          canvas.width = tileSize;
          canvas.height = tileSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          // Découpage du sous-carré depuis l'image source
          ctx.drawImage(
            img,
            c * tileSize, offsetY + r * tileSize, tileSize, tileSize,
            0, 0, tileSize, tileSize
          );

          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

          // Construction de la carte visuelle dans l'interface
          const tileEl = document.createElement('div');
          tileEl.className = 'insta-tile';
          tileEl.title = `Carré #${instaPublishOrder} (Cliquez pour télécharger individuellement)`;
          tileEl.innerHTML = `
            <img src="${dataUrl}" alt="Carré ${instaPublishOrder}">
            <span class="insta-badge-order">#${instaPublishOrder}</span>
          `;

          // Téléchargement individuel au clic sur la miniature
          tileEl.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `insta_post_${instaPublishOrder.toString().padStart(2, '0')}.jpg`;
            link.href = dataUrl;
            link.click();
            UI.toast(`Image #${instaPublishOrder} téléchargée !`, 'success');
          });

          container.appendChild(tileEl);

          // Conversion asynchrone en Blob pour inclusion ultérieure dans le ZIP
          canvas.toBlob((blob) => {
            if (blob) {
              croppedTiles.push({
                blob,
                order: instaPublishOrder,
                filename: `insta_post_${instaPublishOrder.toString().padStart(2, '0')}.jpg`
              });
            }
          }, 'image/jpeg', 0.95);
        }
      }

      const workspaceEl = document.getElementById('insta-workspace');
      if (workspaceEl) workspaceEl.style.display = 'block';
      UI.toast(`Image découpée en ${count} carrés parfaits !`, 'success');
    };

    // Configuration de la zone de glisser-déposer de fichiers
    UI.setupDropzone('insta-dropzone', 'insta-input', (file) => {
      if (!file.type.startsWith('image/')) {
        UI.toast('Veuillez déposer une image valide.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = /** @type {string} */ (e.target?.result);
      };
      reader.readAsDataURL(file);
    });

    layoutSelect.addEventListener('change', () => {
      if (currentImg) processImage(currentImg);
    });

    // Générateur d'illustration d'exemple vectorielle sur Canvas
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dégradé d'arrière-plan moderne
        const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1200);

        // Motifs géométriques circulaires
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 10;
        for (let i = 100; i < 1200; i += 150) {
          ctx.beginPath();
          ctx.arc(600, 600, i / 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Typographie centrale
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TOOLSUITE 2026', 600, 580);
        ctx.font = '36px sans-serif';
        ctx.fillText('Grille Instagram Parfaite', 600, 640);

        const img = new Image();
        img.onload = () => processImage(img);
        img.src = canvas.toDataURL('image/jpeg');
      });
    }

    // Export groupé de tous les carrés au format ZIP via la bibliothèque JSZip
    if (downloadZipBtn) {
      downloadZipBtn.addEventListener('click', async () => {
        if (!croppedTiles.length || typeof JSZip === 'undefined') {
          UI.toast('Erreur lors de la création de l\'archive ZIP.', 'error');
          return;
        }

        downloadZipBtn.disabled = true;
        downloadZipBtn.textContent = 'Création du ZIP...';

        try {
          // @ts-ignore JSZip provient du vendor bundle
          const zip = new JSZip();
          croppedTiles.sort((a, b) => a.order - b.order);

          croppedTiles.forEach(tile => {
            zip.file(tile.filename, tile.blob);
          });

          // Ajout d'une notice explicative pour l'utilisateur
          zip.file('ORDRE_DE_PUBLICATION.txt', `Ordre de publication pour votre grille Instagram :
Postez les images dans l'ordre croissant de leurs noms :
- insta_post_01.jpg en premier
- insta_post_02.jpg en deuxième
...
L'image finale se reconstituera parfaitement sur votre profil Instagram !`);

          const content = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = `instagram_grid_${croppedTiles.length}_photos.zip`;
          link.click();
          UI.toast('Archive ZIP téléchargée avec succès !', 'success');
        } catch (err) {
          console.error(err);
          UI.toast('Erreur de génération ZIP.', 'error');
        } finally {
          downloadZipBtn.disabled = false;
          downloadZipBtn.textContent = '📦 Télécharger tous les carrés (ZIP)';
        }
      });
    }
  }
};

window.MarketingTools = MarketingTools;
