/**
 * @file ocr-tool.js
 * @module OCRTool
 * @description Outil d'extraction de texte (OCR - Reconnaissance Optique de Caractères).
 * Utilise la bibliothèque WebAssembly Tesseract.js pour extraire le texte présent dans une image
 * (PNG, JPEG, WebP) directement dans le navigateur de l'utilisateur, avec support multilingue (français, anglais, etc.).
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

/**
 * @namespace OCRTool
 * @description Contrôleur de l'outil de reconnaissance optique de caractères (OCR).
 */
const OCRTool = {
  /**
   * Données base64 ou URL de l'image actuellement chargée en mémoire pour l'analyse OCR.
   * @type {string|null}
   */
  currentImage: null,

  /**
   * Initialise les écouteurs d'événements de la vue OCR : zone de dépôt d'image,
   * bouton de lancement, copie dans le presse-papier et téléchargement du texte brut extrait.
   *
   * @function init
   * @memberof OCRTool
   * @returns {void}
   */
  init() {
    UI.setupDropzone('ocr-dropzone', 'ocr-input', (file) => {
      if (file.type.startsWith('image/')) {
        this.loadImage(file);
      } else {
        UI.toast('Veuillez déposer une image valide (PNG, JPG, WebP, etc.)', 'warning');
      }
    });

    const startBtn = document.getElementById('ocr-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.recognize());
    }

    const copyBtn = document.getElementById('ocr-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = document.getElementById('ocr-result-text').value;
        if (!text) {
          UI.toast('Aucun texte à copier', 'warning');
          return;
        }
        UI.copy(text, copyBtn, 'Texte OCR copié !');
      });
    }

    const downloadBtn = document.getElementById('ocr-download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const text = document.getElementById('ocr-result-text').value;
        if (!text) return;
        UI.download(text, 'texte_extrait_ocr.txt', 'text/plain');
        UI.toast('Fichier texte téléchargé !', 'success');
      });
    }
  },

  /**
   * Lit et charge le fichier image déposé sous forme de Data URL pour l'affichage de l'aperçu
   * et l'injection dans le moteur Tesseract.
   *
   * @function loadImage
   * @memberof OCRTool
   * @param {File} file - Fichier image sélectionné par l'utilisateur.
   * @returns {void}
   */
  loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImage = e.target.result;
      const previewImg = document.getElementById('ocr-preview-img');
      previewImg.src = this.currentImage;
      document.getElementById('ocr-preview-wrapper').style.display = 'block';
      document.getElementById('ocr-start-btn').disabled = false;
      UI.toast('Image chargée, prête pour l\'extraction.', 'info');
    };
    reader.readAsDataURL(file);
  },

  /**
   * Exécute l'analyse OCR sur l'image chargée en instanciant un worker Tesseract.js.
   * Met à jour la barre de progression en temps réel et remplit la zone de résultat avec le texte reconnu.
   *
   * @async
   * @function recognize
   * @memberof OCRTool
   * @returns {Promise<void>}
   * @throws {Error} Si la bibliothèque Tesseract n'est pas disponible ou si le worker échoue.
   */
  async recognize() {
    if (!this.currentImage) return;

    const startBtn = document.getElementById('ocr-start-btn');
    const origText = startBtn.innerHTML;
    startBtn.innerHTML = `<span class="spinner"></span> Reconnaissance en cours...`;
    startBtn.disabled = true;

    const progressContainer = document.getElementById('ocr-progress-container');
    const progressBar = document.getElementById('ocr-progress-bar');
    const progressStatus = document.getElementById('ocr-progress-status');
    const resultText = document.getElementById('ocr-result-text');

    progressContainer.style.display = 'block';
    resultText.value = '';

    const lang = document.getElementById('ocr-lang-select').value || 'fra';

    try {
      if (typeof Tesseract === 'undefined') {
        throw new Error("La bibliothèque Tesseract.js n'a pas pu être chargée.");
      }

      const worker = await Tesseract.createWorker(lang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            progressBar.style.width = `${pct}%`;
            progressStatus.textContent = `Reconnaissance des caractères : ${pct}%`;
          } else {
            progressStatus.textContent = m.status;
          }
        }
      });

      const ret = await worker.recognize(this.currentImage);
      resultText.value = ret.data.text;
      await worker.terminate();

      progressStatus.textContent = 'Extraction terminée avec succès !';
      UI.toast('Texte extrait avec succès !', 'success');
    } catch (err) {
      console.error('OCR Error:', err);
      UI.toast(`Erreur OCR : ${err.message}`, 'error');
      progressStatus.textContent = 'Erreur lors de la reconnaissance';
    } finally {
      startBtn.innerHTML = origText;
      startBtn.disabled = false;
    }
  }
};

window.OCRTool = OCRTool;
