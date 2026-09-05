/**
 * OCR Tool - Extracteur de texte
 * Uses Tesseract.js (loaded via CDN)
 */

const OCRTool = {
  currentImage: null,

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
