/**
 * @file bg-remover.js
 * @module BgRemover
 * @description Outil de suppression d'arrière-plan interactif et détourage d'images (100% côté client).
 * Implémente un algorithme de baguette magique (color-keying par distance euclidienne RGB avec lissage alpha),
 * un outil gomme circulaire (destination-out) et un pinceau de restauration depuis les données brutes d'origine.
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

/**
 * @namespace BgRemover
 * @description Contrôleur de l'espace de travail de détourage d'images sur Canvas HTML5.
 */
const BgRemover = {
  /**
   * Élément canvas HTML principal affichant l'image en cours d'édition.
   * @type {HTMLCanvasElement|null}
   */
  canvas: null,

  /**
   * Contexte 2D du canvas optimisé pour les lectures fréquentes (`willReadFrequently: true`).
   * @type {CanvasRenderingContext2D|null}
   */
  ctx: null,

  /**
   * Copie originale des données de pixels (ImageData) pour permettre la réinitialisation et la restauration locale.
   * @type {ImageData|null}
   */
  originalImageData: null,

  /**
   * Historique d'états ImageData (tampon circulaire d'annulation).
   * @type {ImageData[]}
   */
  history: [],

  /**
   * Mode d'édition actif : baguette magique ('wand'), gomme manuelle ('eraser') ou restauration ('restore').
   * @type {('wand'|'eraser'|'restore')}
   */
  currentMode: 'wand',

  /**
   * Diamètre en pixels du pinceau de gommage ou de restauration.
   * @type {number}
   */
  brushSize: 25,

  /**
   * Tolérance de couleur de la baguette magique exprimée en pourcentage (0 à 100%).
   * @type {number}
   */
  tolerance: 30,

  /**
   * Initialise les éléments de l'interface, les curseurs de réglage (tolérance, taille du pinceau),
   * les boutons de mode, la zone de dépôt et les écouteurs de souris sur le canvas.
   *
   * @function init
   * @memberof BgRemover
   * @returns {void}
   */
  init() {
    this.canvas = document.getElementById('bg-remover-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    UI.setupDropzone('bg-remover-dropzone', 'bg-remover-input', (file) => {
      if (file.type.startsWith('image/')) {
        this.loadImage(file);
      } else {
        UI.toast('Veuillez sélectionner une image.', 'warning');
      }
    });

    // Curseur de tolérance de sélection de couleur
    const tolSlider = document.getElementById('bg-tolerance-slider');
    const tolVal = document.getElementById('bg-tolerance-val');
    if (tolSlider && tolVal) {
      tolSlider.addEventListener('input', () => {
        this.tolerance = parseInt(tolSlider.value, 10);
        tolVal.textContent = `${this.tolerance}%`;
      });
    }

    // Curseur de taille du pinceau / gomme
    const brushSlider = document.getElementById('bg-brush-size-slider');
    const brushVal = document.getElementById('bg-brush-size-val');
    if (brushSlider && brushVal) {
      brushSlider.addEventListener('input', () => {
        this.brushSize = parseInt(brushSlider.value, 10);
        brushVal.textContent = `${this.brushSize}px`;
      });
    }

    // Boutons de sélection du mode d'édition
    const wandBtn = document.getElementById('bg-mode-wand-btn');
    const eraserBtn = document.getElementById('bg-mode-eraser-btn');
    const restoreBtn = document.getElementById('bg-mode-restore-btn');

    if (wandBtn) wandBtn.onclick = () => this.setMode('wand');
    if (eraserBtn) eraserBtn.onclick = () => this.setMode('eraser');
    if (restoreBtn) restoreBtn.onclick = () => this.setMode('restore');

    // Détection et suppression automatique de l'arrière-plan à partir des 4 coins
    const autoCornersBtn = document.getElementById('bg-auto-remove-btn');
    if (autoCornersBtn) {
      autoCornersBtn.onclick = () => this.autoDetectAndRemove();
    }

    // Bouton de réinitialisation à l'image source d'origine
    const resetBtn = document.getElementById('bg-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => this.resetCanvas();
    }

    // Export en image PNG avec transparence
    const downloadBtn = document.getElementById('bg-download-btn');
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        if (!this.canvas) return;
        this.canvas.toBlob((blob) => {
          if (blob) {
            UI.download(blob, 'image_detouree_sans_fond.png', 'image/png');
            UI.toast('Image détourée téléchargée !', 'success');
          }
        }, 'image/png');
      };
    }

    this.setupCanvasEvents();
  },

  /**
   * Définit le mode d'interaction actif et adapte la visibilité des contrôles de pinceau.
   *
   * @function setMode
   * @memberof BgRemover
   * @param {('wand'|'eraser'|'restore')} mode - Nouveau mode d'édition à activer.
   * @returns {void}
   */
  setMode(mode) {
    this.currentMode = mode;
    ['wand', 'eraser', 'restore'].forEach(m => {
      const btn = document.getElementById(`bg-mode-${m}-btn`);
      if (btn) {
        if (m === mode) {
          btn.classList.add('btn-primary');
          btn.classList.remove('btn-secondary');
        } else {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        }
      }
    });

    const brushGroup = document.getElementById('bg-brush-controls-group');
    if (brushGroup) {
      brushGroup.style.display = (mode === 'eraser' || mode === 'restore') ? 'flex' : 'none';
    }
  },

  /**
   * Charge une image locale, la redimensionne proportionnellement si elle dépasse la limite
   * de performance de 1200px, et stocke son calque brut d'origine.
   *
   * @function loadImage
   * @memberof BgRemover
   * @param {File} file - Fichier image déposé par l'utilisateur.
   * @returns {void}
   */
  loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionnement de confort pour garantir un calcul 60 FPS sur ImageData
        const maxDim = 1200;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(img, 0, 0, width, height);

        this.originalImageData = this.ctx.getImageData(0, 0, width, height);
        this.saveHistory();

        document.getElementById('bg-remover-workspace').style.display = 'block';
        UI.toast('Image chargée. Cliquez sur le fond pour le supprimer ou utilisez la détection auto !', 'info', 4500);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  /**
   * Enregistre l'état actuel du canvas dans l'historique d'annulation (maximum 8 étapes).
   *
   * @function saveHistory
   * @memberof BgRemover
   * @returns {void}
   */
  saveHistory() {
    if (!this.canvas) return;
    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(data);
    if (this.history.length > 8) this.history.shift();
  },

  /**
   * Restaure l'état initial de l'image en rechargeant la copie `originalImageData`.
   *
   * @function resetCanvas
   * @memberof BgRemover
   * @returns {void}
   */
  resetCanvas() {
    if (!this.originalImageData) return;
    this.ctx.putImageData(this.originalImageData, 0, 0);
    this.saveHistory();
    UI.toast('Image réinitialisée.', 'info');
  },

  /**
   * Attache les écouteurs d'événements souris (clic baguette magique, tracé continu à la gomme ou au pinceau).
   *
   * @function setupCanvasEvents
   * @memberof BgRemover
   * @returns {void}
   */
  setupCanvasEvents() {
    let isDrawing = false;

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: Math.floor((e.clientX - rect.left) * scaleX),
        y: Math.floor((e.clientY - rect.top) * scaleY)
      };
    };

    this.canvas.addEventListener('click', (e) => {
      if (this.currentMode === 'wand') {
        const pos = getPos(e);
        this.magicWandRemove(pos.x, pos.y);
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.currentMode === 'eraser' || this.currentMode === 'restore') {
        isDrawing = true;
        this.paintAt(getPos(e));
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDrawing && (this.currentMode === 'eraser' || this.currentMode === 'restore')) {
        this.paintAt(getPos(e));
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDrawing) {
        isDrawing = false;
        this.saveHistory();
      }
    });
  },

  /**
   * Supprime l'arrière-plan par échantillonnage de couleur au point `(startX, startY)`.
   * Calcule la distance euclidienne tridimensionnelle dans l'espace RGB :
   *   `dist = sqrt((r - r0)^2 + (g - g0)^2 + (b - b0)^2)`
   * et applique un fondu alpha progressif (alpha feathering) sur la bordure de tolérance pour éviter les crénelages.
   *
   * @function magicWandRemove
   * @memberof BgRemover
   * @param {number} startX - Coordonnée X du pixel cliqué sur le canvas.
   * @param {number} startY - Coordonnée Y du pixel cliqué sur le canvas.
   * @returns {void}
   */
  magicWandRemove(startX, startY) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const imgData = this.ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    if (targetA === 0) return; // Pixel déjà transparent

    // Échelle de tolérance 0..255
    const tol = (this.tolerance / 100) * 255;

    // Calcul de distance euclidienne de couleur
    const colorDist = (r, g, b) => {
      return Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );
    };

    // Parcours des pixels avec lissage alpha sur la transition de bordure
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const d = colorDist(data[i], data[i + 1], data[i + 2]);
      if (d <= tol) {
        data[i + 3] = 0; // Transparence totale
      } else if (d <= tol + 15) {
        // Fondu progressif (anti-crénelage)
        const alphaFactor = (d - tol) / 15;
        data[i + 3] = Math.round(data[i + 3] * alphaFactor);
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
    this.saveHistory();
    UI.toast('Arrière-plan retiré.', 'success');
  },

  /**
   * Échantillonne automatiquement les couleurs des 4 coins de l'image (zones typiques d'arrière-plan)
   * et applique successivement la suppression de couleur.
   *
   * @function autoDetectAndRemove
   * @memberof BgRemover
   * @returns {void}
   */
  autoDetectAndRemove() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Échantillonnage des 4 coins
    this.magicWandRemove(2, 2);
    this.magicWandRemove(w - 3, 2);
    this.magicWandRemove(2, h - 3);
    this.magicWandRemove(w - 3, h - 3);
  },

  /**
   * Applique le pinceau circulaire à la position indiquée selon le mode actif :
   * - `eraser` : découpe transparente avec `destination-out`.
   * - `restore` : réinjecte les canaux RGBA de `originalImageData` pour tous les pixels dans le rayon.
   *
   * @function paintAt
   * @memberof BgRemover
   * @param {{x: number, y: number}} pos - Coordonnées du centre du pinceau.
   * @returns {void}
   */
  paintAt(pos) {
    this.ctx.save();
    if (this.currentMode === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentMode === 'restore' && this.originalImageData) {
      // Restauration circulaire à partir des données sources d'origine
      const r = Math.round(this.brushSize / 2);
      const minX = Math.max(0, pos.x - r);
      const minY = Math.max(0, pos.y - r);
      const maxX = Math.min(this.canvas.width, pos.x + r);
      const maxY = Math.min(this.canvas.height, pos.y + r);

      const currentData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
          if (Math.hypot(x - pos.x, y - pos.y) <= r) {
            const idx = (y * this.canvas.width + x) * 4;
            currentData.data[idx] = this.originalImageData.data[idx];
            currentData.data[idx + 1] = this.originalImageData.data[idx + 1];
            currentData.data[idx + 2] = this.originalImageData.data[idx + 2];
            currentData.data[idx + 3] = this.originalImageData.data[idx + 3];
          }
        }
      }
      this.ctx.putImageData(currentData, 0, 0);
    }
    this.ctx.restore();
  }
};

window.BgRemover = BgRemover;
