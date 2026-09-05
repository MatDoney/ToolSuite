/**
 * Background Remover - Suppresseur d'arrière-plan interactif
 * Pure Client-side Canvas Magic Wand, Color-Keying & Alpha Feathering
 */

const BgRemover = {
  canvas: null,
  ctx: null,
  originalImageData: null,
  history: [],
  currentMode: 'wand', // 'wand' or 'eraser' or 'restore'
  brushSize: 25,
  tolerance: 30,

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

    // Tolerance slider
    const tolSlider = document.getElementById('bg-tolerance-slider');
    const tolVal = document.getElementById('bg-tolerance-val');
    if (tolSlider && tolVal) {
      tolSlider.addEventListener('input', () => {
        this.tolerance = parseInt(tolSlider.value, 10);
        tolVal.textContent = `${this.tolerance}%`;
      });
    }

    // Brush size slider
    const brushSlider = document.getElementById('bg-brush-size-slider');
    const brushVal = document.getElementById('bg-brush-size-val');
    if (brushSlider && brushVal) {
      brushSlider.addEventListener('input', () => {
        this.brushSize = parseInt(brushSlider.value, 10);
        brushVal.textContent = `${this.brushSize}px`;
      });
    }

    // Mode buttons
    const wandBtn = document.getElementById('bg-mode-wand-btn');
    const eraserBtn = document.getElementById('bg-mode-eraser-btn');
    const restoreBtn = document.getElementById('bg-mode-restore-btn');

    if (wandBtn) wandBtn.onclick = () => this.setMode('wand');
    if (eraserBtn) eraserBtn.onclick = () => this.setMode('eraser');
    if (restoreBtn) restoreBtn.onclick = () => this.setMode('restore');

    // Auto remove corners button (detects background from 4 corners)
    const autoCornersBtn = document.getElementById('bg-auto-remove-btn');
    if (autoCornersBtn) {
      autoCornersBtn.onclick = () => this.autoDetectAndRemove();
    }

    // Reset button
    const resetBtn = document.getElementById('bg-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => this.resetCanvas();
    }

    // Download PNG
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

  loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Constrain max canvas size for smooth performance while keeping crisp detail
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

  saveHistory() {
    if (!this.canvas) return;
    const data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(data);
    if (this.history.length > 8) this.history.shift();
  },

  resetCanvas() {
    if (!this.originalImageData) return;
    this.ctx.putImageData(this.originalImageData, 0, 0);
    this.saveHistory();
    UI.toast('Image réinitialisée.', 'info');
  },

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

    if (targetA === 0) return; // already transparent

    // Tolerance range 0..255
    const tol = (this.tolerance / 100) * 255;

    // Color distance function
    const colorDist = (r, g, b) => {
      return Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );
    };

    // Global color keying with soft alpha feathering
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const d = colorDist(data[i], data[i + 1], data[i + 2]);
      if (d <= tol) {
        data[i + 3] = 0; // complete transparency
      } else if (d <= tol + 15) {
        // Soft feather border
        const alphaFactor = (d - tol) / 15;
        data[i + 3] = Math.round(data[i + 3] * alphaFactor);
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
    this.saveHistory();
    UI.toast('Arrière-plan retiré.', 'success');
  },

  autoDetectAndRemove() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Samples 4 corners
    this.magicWandRemove(2, 2);
    this.magicWandRemove(w - 3, 2);
    this.magicWandRemove(2, h - 3);
    this.magicWandRemove(w - 3, h - 3);
  },

  paintAt(pos) {
    this.ctx.save();
    if (this.currentMode === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.currentMode === 'restore' && this.originalImageData) {
      // Restore from original image data in that circle
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
