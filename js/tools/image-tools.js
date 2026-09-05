/**
 * @file image-tools.js
 * @module ImageTools
 * @description Suite d'outils de traitement d'images 100% côté client (Canvas HTML5 & JSZip).
 * Comprend un convertisseur de formats multi-extensions (PNG, JPEG, WebP, AVIF, SVG),
 * un compresseur d'images avec estimation de gain d'espace en temps réel,
 * et un générateur complet de pack de favicons multi-résolutions (16x16 à 512x512) packagé en archive ZIP avec son `site.webmanifest`.
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

/**
 * @namespace ImageTools
 * @description Contrôleur des outils de manipulation, compression et génération de formats graphiques.
 */
const ImageTools = {
  /**
   * Initialise les 3 sous-modules d'outils d'image (convertisseur, compresseur, favicons).
   *
   * @function init
   * @memberof ImageTools
   * @returns {void}
   */
  init() {
    this.initConverter();
    this.initCompressor();
    this.initFavicon();
  },

  /* ================= 1. CONVERTISSEUR DE FORMATS ================= */

  /**
   * Initialise la vue de conversion de formats d'image : écouteur de glisser-déposer,
   * lecture des dimensions de l'image source, gestion du fond blanc pour JPEG (éviter les fonds noirs sur transparence),
   * encapsulation SVG et téléchargement dynamique dans le format ciblé.
   *
   * @function initConverter
   * @memberof ImageTools
   * @returns {void}
   */
  initConverter() {
    let sourceImage = null;
    let sourceFileName = 'image';

    UI.setupDropzone('img-convert-dropzone', 'img-convert-input', (file) => {
      if (file.type.startsWith('image/')) {
        sourceFileName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            sourceImage = img;
            document.getElementById('img-convert-preview').src = e.target.result;
            document.getElementById('img-convert-info').textContent = `${file.name} (${img.width}x${img.height}px - ${UI.formatBytes(file.size)})`;
            document.getElementById('img-convert-options').style.display = 'block';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        UI.toast('Veuillez sélectionner une image valide.', 'warning');
      }
    });

    const convertBtn = document.getElementById('img-convert-action-btn');
    if (convertBtn) {
      convertBtn.addEventListener('click', () => {
        if (!sourceImage) return;

        const targetFormat = document.getElementById('img-convert-format-select').value;
        const canvas = document.createElement('canvas');
        canvas.width = sourceImage.naturalWidth || sourceImage.width;
        canvas.height = sourceImage.naturalHeight || sourceImage.height;
        const ctx = canvas.getContext('2d');

        // Fond blanc si conversion vers JPEG pour éviter l'apparition d'un fond noir sur transparence
        if (targetFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(sourceImage, 0, 0);

        if (targetFormat === 'svg') {
          // Encapsulation propre dans un conteneur SVG vectoriel
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" href="${canvas.toDataURL('image/png')}" />
</svg>`;
          UI.download(svgContent, `${sourceFileName}.svg`, 'image/svg+xml');
          UI.toast('Image convertie et téléchargée en SVG !', 'success');
          return;
        }

        const mime = `image/${targetFormat}`;
        canvas.toBlob((blob) => {
          if (blob) {
            UI.download(blob, `${sourceFileName}.${targetFormat}`, mime);
            UI.toast(`Image convertie et téléchargée en .${targetFormat} !`, 'success');
          }
        }, mime, 0.92);
      });
    }
  },

  /* ================= 2. COMPRESSEUR D'IMAGES ================= */

  /**
   * Initialise le compresseur d'images : réglages de qualité (0 à 100%), mise à l'échelle (scale factor),
   * zone de dépôt d'image et déclenchement réactif du calcul de compression.
   *
   * @function initCompressor
   * @memberof ImageTools
   * @returns {void}
   */
  initCompressor() {
    let originalImage = null;
    let originalSize = 0;
    let originalFileName = 'image';

    const qualitySlider = document.getElementById('img-compress-quality-slider');
    const qualityVal = document.getElementById('img-compress-quality-val');
    const scaleSelect = document.getElementById('img-compress-scale-select');

    if (qualitySlider && qualityVal) {
      qualitySlider.addEventListener('input', () => {
        qualityVal.textContent = `${qualitySlider.value}%`;
        this.runCompression(originalImage, originalSize, originalFileName);
      });
    }

    if (scaleSelect) {
      scaleSelect.addEventListener('change', () => {
        this.runCompression(originalImage, originalSize, originalFileName);
      });
    }

    UI.setupDropzone('img-compress-dropzone', 'img-compress-input', (file) => {
      if (file.type.startsWith('image/')) {
        originalSize = file.size;
        originalFileName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            originalImage = img;
            document.getElementById('img-compress-orig-img').src = e.target.result;
            document.getElementById('img-compress-orig-info').textContent = `${img.width}x${img.height}px • ${UI.formatBytes(originalSize)}`;
            document.getElementById('img-compress-workspace').style.display = 'block';
            this.runCompression(originalImage, originalSize, originalFileName);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        UI.toast('Veuillez sélectionner un fichier image valide.', 'warning');
      }
    });
  },

  /**
   * Exécute l'algorithme de compression réactive sur l'image fournie via encodage WebP.
   * Calcule le pourcentage de réduction et le volume d'octets économisés en temps réel.
   *
   * @function runCompression
   * @memberof ImageTools
   * @param {HTMLImageElement|null} img - Élément image source chargé.
   * @param {number} origSize - Taille en octets du fichier image d'origine.
   * @param {string} fileName - Nom d'origine du fichier pour la nomenclature d'export.
   * @returns {void}
   */
  runCompression(img, origSize, fileName) {
    if (!img) return;

    const quality = parseInt(document.getElementById('img-compress-quality-slider').value, 10) / 100;
    const scale = parseFloat(document.getElementById('img-compress-scale-select').value) || 1;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Encodage en WebP moderne pour un ratio compression/fidélité optimal
    const mimeType = 'image/webp';
    canvas.toBlob((blob) => {
      if (!blob) return;

      const compImgEl = document.getElementById('img-compress-comp-img');
      const compInfoEl = document.getElementById('img-compress-comp-info');
      const savingsEl = document.getElementById('img-compress-savings');
      const downloadBtn = document.getElementById('img-compress-download-btn');

      const url = URL.createObjectURL(blob);
      compImgEl.src = url;

      const newSize = blob.size;
      const diff = origSize - newSize;
      const pct = Math.round((diff / origSize) * 100);

      compInfoEl.textContent = `${canvas.width}x${canvas.height}px • ${UI.formatBytes(newSize)}`;

      if (pct > 0) {
        savingsEl.className = 'saving-badge';
        savingsEl.textContent = `🎉 -${pct}% d'espace économisé (${UI.formatBytes(diff)})`;
      } else {
        savingsEl.className = 'saving-badge';
        savingsEl.style.borderColor = 'var(--text-muted)';
        savingsEl.style.color = 'var(--text-muted)';
        savingsEl.textContent = `Qualité maximale (${UI.formatBytes(newSize)})`;
      }

      downloadBtn.onclick = () => {
        const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || 'image';
        UI.download(blob, `${baseName}_optimisee.webp`, 'image/webp');
        UI.toast('Image compressée téléchargée !', 'success');
      };
    }, mimeType, quality);
  },

  /* ================= 3. GÉNÉRATEUR DE FAVICON ================= */

  /**
   * Initialise le générateur de pack de favicons : définition des résolutions cibles,
   * zone de dépôt de logo, et copie dans le presse-papier des balises HTML `<link rel="icon">`.
   *
   * @function initFavicon
   * @memberof ImageTools
   * @returns {void}
   */
  initFavicon() {
    let sourceLogo = null;
    const sizes = [
      { size: 16, name: 'favicon-16x16.png' },
      { size: 32, name: 'favicon-32x32.png' },
      { size: 48, name: 'favicon-48x48.png' },
      { size: 180, name: 'apple-touch-icon.png' },
      { size: 192, name: 'android-chrome-192x192.png' },
      { size: 512, name: 'android-chrome-512x512.png' }
    ];

    UI.setupDropzone('favicon-dropzone', 'favicon-input', (file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            sourceLogo = img;
            this.generateFaviconPack(sourceLogo, sizes);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        UI.toast('Veuillez sélectionner un logo ou une image.', 'warning');
      }
    });

    const copyHeadBtn = document.getElementById('favicon-copy-head-btn');
    if (copyHeadBtn) {
      copyHeadBtn.addEventListener('click', () => {
        const snippet = document.getElementById('favicon-head-snippet').value;
        UI.copy(snippet, copyHeadBtn, 'Code HTML copié !');
      });
    }
  },

  /**
   * Génère la grille de prévisualisation des favicons, crée les blobs PNG haute fidélité
   * pour chaque taille et configure le téléchargement de l'archive ZIP finale via JSZip.
   *
   * @function generateFaviconPack
   * @memberof ImageTools
   * @param {HTMLImageElement} img - Logo source servant de matrice.
   * @param {Array<{size: number, name: string}>} sizes - Liste des formats et noms de fichiers cibles.
   * @returns {void}
   */
  generateFaviconPack(img, sizes) {
    const grid = document.getElementById('favicon-grid');
    grid.innerHTML = '';
    const generatedBlobs = [];

    sizes.forEach(spec => {
      const canvas = document.createElement('canvas');
      canvas.width = spec.size;
      canvas.height = spec.size;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, spec.size, spec.size);

      const card = document.createElement('div');
      card.className = 'favicon-card';

      // Canvas d'affichage visuel sur la grille de bord
      const displayCanvas = document.createElement('canvas');
      displayCanvas.width = Math.min(spec.size, 64);
      displayCanvas.height = Math.min(spec.size, 64);
      displayCanvas.style.width = '48px';
      displayCanvas.style.height = '48px';
      const dctx = displayCanvas.getContext('2d');
      dctx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);

      card.appendChild(displayCanvas);

      const label = document.createElement('div');
      label.className = 'favicon-size-label';
      label.textContent = `${spec.size}x${spec.size} (${spec.name})`;
      card.appendChild(label);

      grid.appendChild(card);

      canvas.toBlob(blob => {
        generatedBlobs.push({ name: spec.name, blob });
      }, 'image/png');
    });

    const snippet = `<!-- Favicon & Touch Icons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

    document.getElementById('favicon-head-snippet').value = snippet;
    document.getElementById('favicon-workspace').style.display = 'block';

    const downloadZipBtn = document.getElementById('favicon-download-zip-btn');
    downloadZipBtn.onclick = async () => {
      if (typeof JSZip === 'undefined') {
        UI.toast('La bibliothèque JSZip n\'a pas pu être chargée.', 'error');
        return;
      }

      const zip = new JSZip();
      generatedBlobs.forEach(item => {
        zip.file(item.name, item.blob);
      });

      // Ajout du fichier de manifeste Web standard pour PWA et Android
      const manifest = {
        name: "Application Web",
        short_name: "App",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        theme_color: "#090d16",
        background_color: "#090d16",
        display: "standalone"
      };
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));
      zip.file('favicon-tags.html', snippet);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      UI.download(zipBlob, 'pack_favicons_complet.zip', 'application/zip');
      UI.toast('Archive ZIP des favicons téléchargée !', 'success');
    };
  }
};

window.ImageTools = ImageTools;
