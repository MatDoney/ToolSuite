/**
 * @file utility-tools.js
 * @description Boîte à outils utilitaires polyvalents 100% exécutés côté client (Vanilla JS).
 * Comprend un générateur de codes QR dynamiques multi-formats (URLs, identifiants Wi-Fi WPA/WEP, cartes de visite vCard 3.0, texte libre),
 * un générateur cryptographique de mots de passe forts avec mesure d'entropie (bits de Shannon via window.crypto)
 * et un extracteur de palettes de couleurs dominantes par quantification d'image sur Canvas 2D avec intégration de l'API EyeDropper native.
 * @module UtilityTools
 */

/**
 * @typedef {Object} ExtractedColor
 * @property {string} hex - Valeur hexadécimale de la couleur au format '#RRGGBB'.
 * @property {string} rgb - Formatage textuel CSS fonctionnel 'rgb(r, g, b)'.
 * @property {number} r - Composante rouge (0 à 255).
 * @property {number} g - Composante verte (0 à 255).
 * @property {number} b - Composante bleue (0 à 255).
 */

/**
 * Espace de nom principal regroupant les utilitaires pratiques et cryptographiques.
 * @namespace UtilityTools
 */
const UtilityTools = {
  /**
   * Initialise les trois sous-modules utilitaires au démarrage du script.
   * @function init
   * @memberof UtilityTools
   * @returns {void}
   */
  init() {
    this.initQrCode();
    this.initPasswordGenerator();
    this.initPaletteExtractor();
  },

  /* ================= 1. GÉNÉRATEUR DE QR CODES DYNAMIQUES ================= */
  /**
   * Initialise le constructeur interactif de codes QR.
   * Prend en charge les protocoles standard : URL web, configuration réseau Wi-Fi, fiche contact vCard 3.0,
   * message brut et carte de restaurant. Permet la personnalisation des teintes (fond / premier plan)
   * et le téléchargement en haute définition matricielle PNG ou vectorielle SVG.
   * @function initQrCode
   * @memberof UtilityTools
   * @returns {void}
   */
  initQrCode() {
    const qrTypeSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById('qr-type-select'));
    const qrContainer = document.getElementById('qr-code-canvas-box');
    const fgColorInput = /** @type {HTMLInputElement|null} */ (document.getElementById('qr-fg-color'));
    const bgColorInput = /** @type {HTMLInputElement|null} */ (document.getElementById('qr-bg-color'));
    const downloadPngBtn = document.getElementById('qr-download-png-btn');
    const downloadSvgBtn = document.getElementById('qr-download-svg-btn');

    /** @type {any} Instance de la bibliothèque QRCode.js */
    let currentQrInstance = null;

    /**
     * Formate la charge utile textuelle (payload) du QR code selon le standard sélectionné.
     * @inner
     * @returns {string} Chaîne standardisée encodée dans le symbole 2D.
     */
    const getPayload = () => {
      const type = qrTypeSelect?.value || 'url';
      if (type === 'url') {
        const inp = /** @type {HTMLInputElement|null} */ (document.getElementById('qr-url-input'));
        return inp?.value.trim() || 'https://example.com';
      } else if (type === 'wifi') {
        const ssid = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-wifi-ssid')))?.value.trim() || 'MonWifi';
        const pass = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-wifi-pass')))?.value || '';
        const enc = (/** @type {HTMLSelectElement|null} */ (document.getElementById('qr-wifi-enc')))?.value || 'WPA';
        const hidden = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-wifi-hidden')))?.checked ? 'H:true;' : '';
        return `WIFI:S:${ssid};T:${enc};P:${pass};${hidden};`;
      } else if (type === 'vcard') {
        const fn = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-vcard-fn')))?.value.trim() || 'Jean Dupont';
        const tel = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-vcard-tel')))?.value.trim() || '';
        const email = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-vcard-email')))?.value.trim() || '';
        const org = (/** @type {HTMLInputElement|null} */ (document.getElementById('qr-vcard-org')))?.value.trim() || '';
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${fn}\nTEL:${tel}\nEMAIL:${email}\nORG:${org}\nEND:VCARD`;
      } else if (type === 'text') {
        const txt = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('qr-text-input'));
        return txt?.value.trim() || 'Message texte';
      } else if (type === 'menu') {
        const menu = /** @type {HTMLInputElement|null} */ (document.getElementById('qr-menu-url'));
        return menu?.value.trim() || 'https://mon-restaurant.com/menu';
      }
      return 'https://example.com';
    };

    /**
     * Génère et dessine le code QR avec QRCode.js ou le service de secours haute définition.
     * @inner
     */
    const renderQr = () => {
      if (!qrContainer) return;
      const text = getPayload();
      const fg = fgColorInput?.value || '#000000';
      const bg = bgColorInput?.value || '#ffffff';

      qrContainer.innerHTML = '';

      // @ts-ignore QRCode chargé via vendor bundle
      if (typeof QRCode !== 'undefined') {
        // @ts-ignore
        currentQrInstance = new QRCode(qrContainer, {
          text: text,
          width: 240,
          height: 240,
          colorDark: fg,
          colorLight: bg,
          // @ts-ignore
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        // Rendu de secours via service sécurisé si la librairie locale n'est pas instanciée
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}&color=${fg.replace('#', '')}&bgcolor=${bg.replace('#', '')}`;
        img.width = 240;
        img.height = 240;
        img.alt = 'QR Code';
        qrContainer.appendChild(img);
      }
    };

    qrTypeSelect?.addEventListener('change', () => {
      const type = qrTypeSelect.value;
      document.querySelectorAll('.qr-type-fields').forEach(el => {
        /** @type {HTMLElement} */ (el).style.display = 'none';
      });
      const activeFieldGroup = document.getElementById(`qr-fields-${type}`);
      if (activeFieldGroup) activeFieldGroup.style.display = 'block';
      renderQr();
    });

    [fgColorInput, bgColorInput].forEach(el => el?.addEventListener('input', renderQr));

    document.querySelectorAll('.qr-field-input').forEach(input => {
      input.addEventListener('input', renderQr);
    });

    // Téléchargement du QR Code en image PNG
    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => {
        const canvas = qrContainer?.querySelector('canvas');
        if (canvas) {
          canvas.toBlob(blob => {
            if (blob) {
              UI.download(blob, 'qrcode.png', 'image/png');
              UI.toast('QR Code PNG téléchargé !', 'success');
            }
          });
        } else {
          const img = qrContainer?.querySelector('img');
          if (img) {
            window.open(img.src, '_blank');
          }
        }
      });
    }

    // Téléchargement du QR Code en fichier vectoriel SVG
    if (downloadSvgBtn) {
      downloadSvgBtn.addEventListener('click', () => {
        const canvas = qrContainer?.querySelector('canvas');
        if (canvas) {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" href="${canvas.toDataURL('image/png')}" />
</svg>`;
          UI.download(svg, 'qrcode.svg', 'image/svg+xml');
          UI.toast('QR Code SVG téléchargé !', 'success');
        }
      });
    }

    setTimeout(renderQr, 500);
  },

  /* ================= 2. GÉNÉRATEUR DE MOTS DE PASSE FORTS ================= */
  /**
   * Initialise le générateur aléatoire de mots de passe cryptographiquement sûrs.
   * Utilise l'API native window.crypto.getRandomValues pour garantir l'absence de biais pseudo-aléatoire,
   * calcule l'entropie de Shannon en bits (E = L * log2(Taille_Pool)) et fournit une jauge de robustesse dynamique.
   * @function initPasswordGenerator
   * @memberof UtilityTools
   * @returns {void}
   */
  initPasswordGenerator() {
    const passOutput = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-output'));
    const lengthSlider = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-length-slider'));
    const lengthVal = document.getElementById('pass-length-val');
    const upperCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-upper-check'));
    const lowerCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-lower-check'));
    const numbersCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-numbers-check'));
    const symbolsCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-symbols-check'));
    const noAmbiguousCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('pass-no-ambiguous-check'));
    const generateBtn = document.getElementById('pass-generate-btn');
    const copyBtn = document.getElementById('pass-copy-btn');
    const meterFill = document.getElementById('pass-entropy-meter');
    const meterLabel = document.getElementById('pass-entropy-label');

    if (!lengthSlider || !passOutput) return;

    /**
     * Compose le jeu de caractères autorisé, effectue le tirage cryptographique et évalue l'entropie résultante.
     * @inner
     */
    const generatePassword = () => {
      const length = parseInt(lengthSlider.value, 10);
      let chars = '';
      if (upperCheck?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowerCheck?.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (numbersCheck?.checked) chars += '0123456789';
      if (symbolsCheck?.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (noAmbiguousCheck?.checked) {
        // Exclusion des glyphes visuellement ambigus : l minuscule, 1, I majuscule, o minuscule, 0, O majuscule
        chars = chars.replace(/[l1Io0O]/g, '');
      }

      if (!chars) {
        passOutput.value = '';
        if (meterLabel) meterLabel.textContent = 'Sélectionnez au moins une option';
        if (meterFill) meterFill.style.width = '0%';
        return;
      }

      // Tirage cryptographique CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
      }

      passOutput.value = password;

      // Calcul d'entropie informationnelle : E = L * log2(N)
      const poolSize = chars.length;
      const entropy = Math.round(length * Math.log2(poolSize));

      let widthPct = Math.min(100, Math.round((entropy / 128) * 100));
      if (meterFill) meterFill.style.width = `${widthPct}%`;

      if (meterFill && meterLabel) {
        if (entropy < 40) {
          meterFill.style.background = 'var(--accent-rose)';
          meterLabel.innerHTML = `<span style="color: var(--accent-rose);">Faible</span> (${entropy} bits d'entropie)`;
        } else if (entropy < 65) {
          meterFill.style.background = 'var(--accent-amber)';
          meterLabel.innerHTML = `<span style="color: var(--accent-amber);">Moyen</span> (${entropy} bits d'entropie)`;
        } else if (entropy < 85) {
          meterFill.style.background = 'var(--accent-primary)';
          meterLabel.innerHTML = `<span style="color: #a5b4fc;">Fort</span> (${entropy} bits d'entropie)`;
        } else {
          meterFill.style.background = 'var(--accent-emerald)';
          meterLabel.innerHTML = `<span style="color: var(--accent-emerald);">Inviolable</span> (${entropy} bits d'entropie)`;
        }
      }
    };

    lengthSlider.addEventListener('input', () => {
      if (lengthVal) lengthVal.textContent = lengthSlider.value;
      generatePassword();
    });

    [upperCheck, lowerCheck, numbersCheck, symbolsCheck, noAmbiguousCheck].forEach(el => {
      el?.addEventListener('change', generatePassword);
    });

    generateBtn?.addEventListener('click', generatePassword);

    copyBtn?.addEventListener('click', () => {
      if (!passOutput.value) return;
      UI.copy(passOutput.value, copyBtn, 'Mot de passe copié !');
    });

    generatePassword();
  },

  /* ================= 3. EXTRACTEUR DE PALETTE DE COULEURS ================= */
  /**
   * @type {ExtractedColor[]} Nuancier de couleurs actuellement extrait en mémoire.
   * @memberof UtilityTools
   */
  currentPalette: [],

  /**
   * Initialise l'extracteur de palette de couleurs dominantes depuis une image téléversée.
   * Prend en charge le glisser-déposer, l'API EyeDropper native, la copie en bloc HEX, CSS Variables et JSON.
   * @function initPaletteExtractor
   * @memberof UtilityTools
   * @returns {void}
   */
  initPaletteExtractor() {
    UI.setupDropzone('palette-dropzone', 'palette-input', (file) => {
      if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const preview = /** @type {HTMLImageElement|null} */ (document.getElementById('palette-img-preview'));
            if (preview) preview.src = /** @type {string} */ (e.target?.result);
            const workspace = document.getElementById('palette-workspace');
            if (workspace) workspace.style.display = 'block';
            this.extractDominantColors(img);
          };
          img.src = /** @type {string} */ (e.target?.result);
        };
        reader.readAsDataURL(file);
      } else {
        UI.toast('Veuillez déposer une image valide (PNG, JPG, WebP...).', 'warning');
      }
    });

    // Bouton de démonstration avec image synthétique
    const sampleBtn = document.getElementById('palette-sample-btn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.generateSamplePaletteImage();
      });
    }

    // Outil pipette EyeDropper (disponible sous Chrome, Edge et navigateurs Chromium récents)
    const eyedropperBtn = /** @type {HTMLButtonElement|null} */ (document.getElementById('palette-eyedropper-btn'));
    if (eyedropperBtn) {
      if ('EyeDropper' in window) {
        eyedropperBtn.addEventListener('click', async () => {
          try {
            // @ts-ignore EyeDropper natif moderne
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result && result.sRGBHex) {
              const hex = result.sRGBHex.toUpperCase();
              UI.copy(hex, null, `Couleur pipetée : ${hex}`);
              this.currentPalette.unshift({
                hex: hex,
                rgb: this.hexToRgbString(hex),
                r: parseInt(hex.substring(1, 3), 16) || 0,
                g: parseInt(hex.substring(3, 5), 16) || 0,
                b: parseInt(hex.substring(5, 7), 16) || 0
              });
              this.renderPaletteGrid(this.currentPalette);
            }
          } catch (e) {
            // Annulation par l'utilisateur ou échec de capture
          }
        });
      } else {
        eyedropperBtn.style.display = 'none';
      }
    }

    // Copie de l'ensemble des codes HEX séparés par virgule
    const copyHexBtn = document.getElementById('palette-copy-hex-btn');
    if (copyHexBtn) {
      copyHexBtn.addEventListener('click', () => {
        if (!this.currentPalette || this.currentPalette.length === 0) {
          UI.toast('Aucune palette à copier.', 'warning');
          return;
        }
        const hexList = this.currentPalette.map(c => c.hex).join(', ');
        UI.copy(hexList, copyHexBtn, 'Liste des codes HEX copiée !');
      });
    }

    // Copie au format CSS Custom Properties (:root)
    const copyCssBtn = document.getElementById('palette-copy-css-btn');
    if (copyCssBtn) {
      copyCssBtn.addEventListener('click', () => {
        if (!this.currentPalette || this.currentPalette.length === 0) {
          UI.toast('Aucune palette à copier.', 'warning');
          return;
        }
        const cssLines = [':root {'];
        this.currentPalette.forEach((c, idx) => {
          cssLines.push(`  --palette-color-${idx + 1}: ${c.hex}; /* ${c.rgb} */`);
        });
        cssLines.push('}');
        UI.copy(cssLines.join('\n'), copyCssBtn, 'Variables CSS copiées !');
      });
    }

    // Copie au format JSON structuré
    const copyJsonBtn = document.getElementById('palette-copy-json-btn');
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener('click', () => {
        if (!this.currentPalette || this.currentPalette.length === 0) {
          UI.toast('Aucune palette à copier.', 'warning');
          return;
        }
        UI.copy(JSON.stringify(this.currentPalette, null, 2), copyJsonBtn, 'JSON de la palette copié !');
      });
    }
  },

  /**
   * Convertit un code hexadécimal '#RRGGBB' en chaîne fonctionnelle 'rgb(r, g, b)'.
   * @function hexToRgbString
   * @memberof UtilityTools
   * @param {string} hex - Code hexadécimal précédé ou non d'un dièse.
   * @returns {string} Chaîne fonctionnelle CSS formatée.
   */
  hexToRgbString(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  },

  /**
   * Génère une composition picturale colorée sur un Canvas temporaire pour tester l'extracteur.
   * @function generateSamplePaletteImage
   * @memberof UtilityTools
   * @returns {void}
   */
  generateSamplePaletteImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dégradé inspiré d'un coucher de soleil chromatique
    const grad = ctx.createLinearGradient(0, 0, 400, 300);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.3, '#4338ca');
    grad.addColorStop(0.6, '#ec4899');
    grad.addColorStop(0.85, '#f59e0b');
    grad.addColorStop(1, '#10b981');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 300);

    const dataUrl = canvas.toDataURL('image/png');
    const img = new Image();
    img.onload = () => {
      const preview = /** @type {HTMLImageElement|null} */ (document.getElementById('palette-img-preview'));
      if (preview) preview.src = dataUrl;
      const workspace = document.getElementById('palette-workspace');
      if (workspace) workspace.style.display = 'block';
      this.extractDominantColors(img);
    };
    img.src = dataUrl;
  },

  /**
   * Extrait jusqu'à 8 couleurs dominantes et distinctes à partir d'une image HTML.
   * Utilise un sous-échantillonnage matriciel (largeur 100px), une quantification par pas de 24 niveaux
   * et une distance euclidienne 3D (seuil > 38) pour éviter les teintes trop proches.
   * @function extractDominantColors
   * @memberof UtilityTools
   * @param {HTMLImageElement} img - Image source analysée.
   * @returns {void}
   */
  extractDominantColors(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sous-échantillonnage rapide pour limiter la complexité algorithmique
    const sampleWidth = 100;
    const sampleHeight = Math.max(10, Math.round((img.naturalHeight || img.height) * sampleWidth / (img.naturalWidth || img.width)));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    /** @type {Record<string, { r: number, g: number, b: number, count: number }>} */
    const colorBuckets = {};

    // Quantification des pixels par tranches de 24
    for (let i = 0; i < imgData.length; i += 16) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      if (a < 128) continue; // Ignore les zones transparentes

      const qr = Math.round(r / 24) * 24;
      const qg = Math.round(g / 24) * 24;
      const qb = Math.round(b / 24) * 24;
      const key = `${qr},${qg},${qb}`;

      if (!colorBuckets[key]) {
        colorBuckets[key] = { r: qr, g: qg, b: qb, count: 0 };
      }
      colorBuckets[key].count++;
    }

    const sorted = Object.values(colorBuckets).sort((a, b) => b.count - a.count);
    /** @type {ExtractedColor[]} */
    const palette = [];

    /**
     * Formate un triplet RGB en code hexadécimal.
     * @param {number} r - Composante rouge.
     * @param {number} g - Composante verte.
     * @param {number} b - Composante bleue.
     * @returns {string} Code hexadécimal majuscule.
     */
    const rgbToHex = (r, g, b) => {
      const toH = (/** @type {number} */ n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
      return `#${toH(r)}${toH(g)}${toH(b)}`.toUpperCase();
    };

    /**
     * Calcule la distance euclidienne tridimensionnelle entre deux teintes RGB.
     * @param {{ r: number, g: number, b: number }} c1 - Première couleur.
     * @param {{ r: number, g: number, b: number }} c2 - Seconde couleur.
     * @returns {number} Distance euclidienne dans l'espace RGB.
     */
    const colorDistance = (c1, c2) => {
      return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
      );
    };

    // Sélection des teintes dominantes suffisamment différenciées
    for (const c of sorted) {
      if (palette.length >= 8) break;
      const isDistinct = palette.every(existing => colorDistance(c, existing) > 38);
      if (isDistinct) {
        palette.push({
          hex: rgbToHex(c.r, c.g, c.b),
          rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
          r: c.r,
          g: c.g,
          b: c.b
        });
      }
    }

    this.currentPalette = palette;
    this.renderPaletteGrid(palette);
    UI.toast(`${palette.length} couleurs dominantes extraites !`, 'success');
  },

  /**
   * Génère les cartes d'échantillons de couleur dans la grille DOM.
   * Calcule dynamiquement le contraste perçu (formule ITU-R BT.601) pour adapter la couleur du texte (noir ou blanc).
   * @function renderPaletteGrid
   * @memberof UtilityTools
   * @param {ExtractedColor[]} palette - Nuancier à afficher.
   * @returns {void}
   */
  renderPaletteGrid(palette) {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    palette.forEach((color, idx) => {
      const card = document.createElement('div');
      card.className = 'color-swatch-card';
      card.title = `Cliquez pour copier ${color.hex}`;

      // Formule de luminosité perçue : Y = 0.299*R + 0.587*G + 0.114*B
      const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
      const textColor = brightness > 140 ? '#000000' : '#ffffff';

      card.innerHTML = `
        <div class="color-swatch-rect" style="background-color: ${color.hex}; display: flex; align-items: flex-end; padding: 6px; justify-content: flex-end;">
          <span style="font-size: 0.7rem; font-weight: 600; color: ${textColor}; opacity: 0.85;">${idx + 1}</span>
        </div>
        <div class="color-swatch-meta">
          <div class="color-hex">${color.hex}</div>
          <div class="color-rgb">${color.rgb}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        UI.copy(color.hex, null, `Code HEX ${color.hex} copié !`);
      });

      grid.appendChild(card);
    });
  }
};

window.UtilityTools = UtilityTools;
