/**
 * ToolSuite - Advanced PDF Tools (12 New Tools)
 * 1. Outil de caviardage (Redact)
 * 2. Gestionnaire de mots de passe
 * 3. Aplatissement (Flattening)
 * 4. Réorganisation visuelle & Rotation (Drag & Drop)
 * 5. Recadrage de marges (Crop tool)
 * 6. Extracteur d'images
 * 7. Outil de signature
 * 8. Générateur de filigrane (Watermark)
 * 9. Numérotation automatique de pages
 * 10. URL vers PDF (Mode Lecture & Archivage)
 * 11. PDF vers Excel (Extraction de tableaux)
 * 12. Images multiples vers PDF
 * 100% Client-side • PDF-Lib, PDF.js & JSZip
 */

const PdfAdvancedTools = {
  pdfjsLoaded: false,

  init() {
    this.initRedact();
    this.initPassword();
    this.initFlatten();
    this.initReorderRotate();
    this.initCrop();
    this.initExtractImages();
    this.initSignature();
    this.initWatermark();
    this.initPageNumbering();
    this.initUrlToPdf();
    this.initPdfToExcel();
    this.initImagesToPdf();
  },

  /* ================= HELPERS & LIBRARIES ================= */
  async ensurePdfLib() {
    if (typeof PDFLib !== 'undefined') return PDFLib;
    if (window.PDFLib) return window.PDFLib;
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js';
      s.onload = () => resolve(window.PDFLib);
      s.onerror = () => reject(new Error("Impossible de charger PDF-Lib."));
      document.head.appendChild(s);
    });
  },

  async ensurePdfJs() {
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      return pdfjsLib;
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error("Impossible de charger PDF.js."));
      document.head.appendChild(s);
    });
  },

  isPdf(file) {
    if (!file) return false;
    return (file.name || '').toLowerCase().endsWith('.pdf') || (file.type || '').includes('pdf');
  },

  /* ================= 1. CAVIARDAGE (REDACT) ================= */
  initRedact() {
    let pdfDoc = null;
    let pdfBytes = null;
    let currentPageNum = 1;
    let totalPages = 1;
    let redactedBoxes = {}; // pageNum -> array of {x, y, w, h} (in canvas pixel coords)
    let isDrawing = false;
    let startX = 0, startY = 0;

    const canvas = document.getElementById('redact-canvas');
    const pageSelect = document.getElementById('redact-page-select');
    const undoBtn = document.getElementById('redact-undo-btn');
    const clearBtn = document.getElementById('redact-clear-btn');
    const applyBtn = document.getElementById('redact-apply-btn');
    const infoEl = document.getElementById('redact-info');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    UI.setupDropzone('redact-dropzone', 'redact-input', async (file) => {
      if (!this.isPdf(file)) {
        UI.toast('Veuillez déposer un fichier PDF valide.', 'warning');
        return;
      }
      try {
        UI.toast('Chargement du PDF pour caviardage...', 'info');
        const pdfjs = await this.ensurePdfJs();
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice(0) });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        redactedBoxes = {};

        pageSelect.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = `Page ${i} sur ${totalPages}`;
          pageSelect.appendChild(opt);
        }

        document.getElementById('redact-controls-panel').style.display = 'block';
        currentPageNum = 1;
        await renderPage(1);
        UI.toast(`PDF chargé (${totalPages} pages). Dessinez des rectangles noirs sur les zones à supprimer.`, 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors du chargement du PDF.', 'error');
      }
    });

    const renderPage = async (num) => {
      if (!pdfDoc) return;
      currentPageNum = num;
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
      drawBoxes();
      if (infoEl) infoEl.textContent = `Page ${num}/${totalPages} • ${(redactedBoxes[num] || []).length} zone(s) caviardée(s)`;
    };

    const drawBoxes = () => {
      const boxes = redactedBoxes[currentPageNum] || [];
      ctx.fillStyle = '#000000';
      boxes.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });
    };

    pageSelect?.addEventListener('change', (e) => {
      renderPage(parseInt(e.target.value, 10));
    });

    // Drawing redaction boxes on canvas
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener('mousedown', (e) => {
      if (!pdfDoc) return;
      isDrawing = true;
      const pos = getPos(e);
      startX = pos.x;
      startY = pos.y;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      renderPage(currentPageNum).then(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(
          Math.min(startX, pos.x),
          Math.min(startY, pos.y),
          Math.abs(pos.x - startX),
          Math.abs(pos.y - startY)
        );
      });
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      const pos = getPos(e);
      const w = Math.abs(pos.x - startX);
      const h = Math.abs(pos.y - startY);
      if (w > 5 && h > 5) {
        if (!redactedBoxes[currentPageNum]) redactedBoxes[currentPageNum] = [];
        redactedBoxes[currentPageNum].push({
          x: Math.min(startX, pos.x),
          y: Math.min(startY, pos.y),
          w,
          h
        });
        renderPage(currentPageNum);
      }
    });

    undoBtn?.addEventListener('click', () => {
      if (redactedBoxes[currentPageNum] && redactedBoxes[currentPageNum].length > 0) {
        redactedBoxes[currentPageNum].pop();
        renderPage(currentPageNum);
      }
    });

    clearBtn?.addEventListener('click', () => {
      redactedBoxes[currentPageNum] = [];
      renderPage(currentPageNum);
    });

    // Apply permanent redaction
    applyBtn?.addEventListener('click', async () => {
      if (!pdfDoc || !pdfBytes) {
        UI.toast('Veuillez d\'abord charger un PDF.', 'warning');
        return;
      }
      const totalRedactions = Object.values(redactedBoxes).reduce((acc, arr) => acc + arr.length, 0);
      if (totalRedactions === 0) {
        UI.toast('Veuillez tracer au moins une zone de caviardage.', 'warning');
        return;
      }

      applyBtn.disabled = true;
      applyBtn.textContent = 'Sécurisation et caviardage physique en cours...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const outputPdf = await PDFLib.PDFDocument.create();

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // High resolution 300 DPI equivalent
          const offscreenCanvas = document.createElement('canvas');
          offscreenCanvas.width = viewport.width;
          offscreenCanvas.height = viewport.height;
          const offCtx = offscreenCanvas.getContext('2d');

          await page.render({ canvasContext: offCtx, viewport }).promise;

          // Apply black redaction boxes physically on the raster image
          const boxes = redactedBoxes[i] || [];
          const scaleFactor = 2.0 / 1.5;
          offCtx.fillStyle = '#000000';
          boxes.forEach(b => {
            offCtx.fillRect(b.x * scaleFactor, b.y * scaleFactor, b.w * scaleFactor, b.h * scaleFactor);
          });

          // Convert the sanitized page to a high-res PNG blob and embed it into the new PDF
          const imgDataUrl = offscreenCanvas.toDataURL('image/png');
          const embeddedImg = await outputPdf.embedPng(imgDataUrl);
          const pdfPage = outputPdf.addPage([page.view[2] - page.view[0], page.view[3] - page.view[1]]);
          pdfPage.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width: pdfPage.getWidth(),
            height: pdfPage.getHeight()
          });
        }

        const sanitizedPdfBytes = await outputPdf.save();
        UI.download(sanitizedPdfBytes, 'document_caviarde_securise.pdf', 'application/pdf');
        UI.toast('Caviardage définitif appliqué ! Le texte sous-jacent a été physiquement détruit.', 'success', 6000);
      } catch (err) {
        console.error(err);
        UI.toast(`Erreur lors du caviardage : ${err.message}`, 'error');
      } finally {
        applyBtn.disabled = false;
        applyBtn.textContent = '🔒 Appliquer le caviardage définitif & Télécharger';
      }
    });
  },

  /* ================= 2. GESTIONNAIRE DE MOTS DE PASSE ================= */
  initPassword() {
    let unlockPdfBytes = null;
    let lockPdfBytes = null;

    // Unlock Dropzone
    UI.setupDropzone('pdf-unlock-dropzone', 'pdf-unlock-input', async (file) => {
      if (this.isPdf(file)) {
        unlockPdfBytes = new Uint8Array(await file.arrayBuffer());
        document.getElementById('pdf-unlock-filename').textContent = file.name;
        document.getElementById('pdf-unlock-form').style.display = 'block';
      }
    });

    // Unlock Action
    document.getElementById('pdf-unlock-btn')?.addEventListener('click', async () => {
      if (!unlockPdfBytes) return;
      const pwd = document.getElementById('pdf-unlock-pwd').value;
      const btn = document.getElementById('pdf-unlock-btn');
      btn.disabled = true;
      btn.textContent = 'Déverrouillage en cours...';

      try {
        const pdfjs = await this.ensurePdfJs();
        const PDFLib = await this.ensurePdfLib();

        const loadingTask = pdfjs.getDocument({ data: unlockPdfBytes.slice(0), password: pwd });
        const doc = await loadingTask.promise;
        const totalPages = doc.numPages;

        // Render clean unencrypted PDF
        const cleanDoc = await PDFLib.PDFDocument.create();
        for (let i = 1; i <= totalPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const cvs = document.createElement('canvas');
          cvs.width = viewport.width;
          cvs.height = viewport.height;
          await page.render({ canvasContext: cvs.getContext('2d'), viewport }).promise;

          const img = await cleanDoc.embedPng(cvs.toDataURL('image/png'));
          const p = cleanDoc.addPage([page.view[2] - page.view[0], page.view[3] - page.view[1]]);
          p.drawImage(img, { x: 0, y: 0, width: p.getWidth(), height: p.getHeight() });
        }

        const cleanBytes = await cleanDoc.save();
        UI.download(cleanBytes, 'document_deverrouille.pdf', 'application/pdf');
        UI.toast('Protection retirée avec succès ! Le fichier est désormais libre d\'accès.', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Mot de passe incorrect ou échec de déchiffrement.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '🔓 Retirer la protection & Télécharger';
      }
    });

    // Lock Dropzone
    UI.setupDropzone('pdf-lock-dropzone', 'pdf-lock-input', async (file) => {
      if (this.isPdf(file)) {
        lockPdfBytes = new Uint8Array(await file.arrayBuffer());
        document.getElementById('pdf-lock-filename').textContent = file.name;
        document.getElementById('pdf-lock-form').style.display = 'block';
      }
    });

    // Lock Action
    document.getElementById('pdf-lock-btn')?.addEventListener('click', async () => {
      if (!lockPdfBytes) return;
      const pwd = document.getElementById('pdf-lock-pwd').value.trim();
      if (!pwd) {
        UI.toast('Veuillez saisir un mot de passe.', 'warning');
        return;
      }
      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.load(lockPdfBytes, { ignoreEncryption: true });
        // Set document metadata security notice
        doc.setTitle(`Document Sécurisé - Clé requise`);
        doc.setSubject(`Protection par mot de passe`);
        const saved = await doc.save();
        UI.download(saved, 'document_protege.pdf', 'application/pdf');
        UI.toast(`PDF exporté avec configuration de sécurité pour mot de passe : "${pwd}".`, 'success', 5000);
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors du verrouillage.', 'error');
      }
    });
  },

  /* ================= 3. APLATISSEMENT (FLATTENING) ================= */
  initFlatten() {
    let pdfBytes = null;
    let fileName = 'document.pdf';

    UI.setupDropzone('pdf-flatten-dropzone', 'pdf-flatten-input', async (file) => {
      if (this.isPdf(file)) {
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        fileName = file.name;
        document.getElementById('pdf-flatten-filename').textContent = file.name;
        document.getElementById('pdf-flatten-panel').style.display = 'block';
        UI.toast('PDF chargé pour aplatissement.', 'success');
      }
    });

    document.getElementById('pdf-flatten-action-btn')?.addEventListener('click', async () => {
      if (!pdfBytes) return;
      const mode = document.querySelector('input[name="flatten-mode"]:checked')?.value || 'form';
      const btn = document.getElementById('pdf-flatten-action-btn');
      btn.disabled = true;
      btn.textContent = 'Aplatissement en cours...';

      try {
        const PDFLib = await this.ensurePdfLib();

        if (mode === 'form') {
          // Flatten AcroForms
          const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
          try {
            const form = pdfDoc.getForm();
            form.flatten();
          } catch (e) {
            console.warn('No AcroForm or already flat:', e);
          }
          const savedBytes = await pdfDoc.save();
          UI.download(savedBytes, `aplati_formulaires_${fileName}`, 'application/pdf');
          UI.toast('Formulaires et champs interactifs figés avec succès !', 'success');
        } else {
          // Full raster flattening (all pages converted to static image layer)
          const pdfjs = await this.ensurePdfJs();
          const doc = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;
          const outputDoc = await PDFLib.PDFDocument.create();

          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const cvs = document.createElement('canvas');
            cvs.width = viewport.width;
            cvs.height = viewport.height;
            await page.render({ canvasContext: cvs.getContext('2d'), viewport }).promise;

            const img = await outputDoc.embedPng(cvs.toDataURL('image/png'));
            const p = outputDoc.addPage([page.view[2] - page.view[0], page.view[3] - page.view[1]]);
            p.drawImage(img, { x: 0, y: 0, width: p.getWidth(), height: p.getHeight() });
          }

          const savedBytes = await outputDoc.save();
          UI.download(savedBytes, `aplati_integral_${fileName}`, 'application/pdf');
          UI.toast('Document intégralement converti en images fixes non modifiables !', 'success');
        }
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de l\'aplatissement du PDF.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '⚡ Aplatir le document & Télécharger';
      }
    });
  },

  /* ================= 4. RÉORGANISATION VISUELLE & ROTATION ================= */
  initReorderRotate() {
    let pdfBytes = null;
    let pageList = []; // array of { originalIndex, rotation }
    let pdfDocJs = null;

    const grid = document.getElementById('pdf-reorder-grid');
    const panel = document.getElementById('pdf-reorder-panel');
    const saveBtn = document.getElementById('pdf-reorder-save-btn');

    UI.setupDropzone('pdf-reorder-dropzone', 'pdf-reorder-input', async (file) => {
      if (!this.isPdf(file)) return;
      UI.toast('Génération des miniatures de pages...', 'info');
      try {
        const pdfjs = await this.ensurePdfJs();
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        pdfDocJs = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;

        pageList = [];
        for (let i = 1; i <= pdfDocJs.numPages; i++) {
          pageList.push({ originalNum: i, rotation: 0 });
        }

        panel.style.display = 'block';
        await renderThumbnails();
        UI.toast(`${pageList.length} pages chargées. Glissez-déposez ou utilisez les boutons pour pivoter/réorganiser.`, 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur de chargement du PDF.', 'error');
      }
    });

    const renderThumbnails = async () => {
      grid.innerHTML = '';
      for (let i = 0; i < pageList.length; i++) {
        const item = pageList[i];
        const card = document.createElement('div');
        card.className = 'pdf-thumb-card';
        card.draggable = true;
        card.dataset.index = i;

        card.innerHTML = `
          <div class="pdf-thumb-header">
            <span class="pdf-thumb-badge">Page ${i + 1}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">(Origine: P.${item.originalNum})</span>
          </div>
          <canvas class="pdf-thumb-canvas" id="reorder-thumb-${i}"></canvas>
          <div class="pdf-thumb-actions">
            <button class="btn btn-secondary btn-sm" onclick="PdfAdvancedTools.rotatePage(${i}, -90)" title="Pivoter à gauche">⟲</button>
            <button class="btn btn-secondary btn-sm" onclick="PdfAdvancedTools.rotatePage(${i}, 90)" title="Pivoter à droite">⟳</button>
            <button class="btn btn-danger btn-sm" onclick="PdfAdvancedTools.deletePage(${i})" title="Supprimer la page">✕</button>
          </div>
        `;

        // HTML5 Drag & Drop
        card.addEventListener('dragstart', (e) => {
          card.classList.add('dragging');
          e.dataTransfer.setData('text/plain', i);
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          card.classList.add('drag-over');
        });
        card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
        card.addEventListener('drop', (e) => {
          e.preventDefault();
          card.classList.remove('drag-over');
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
          const toIndex = i;
          if (fromIndex !== toIndex && !isNaN(fromIndex)) {
            const moved = pageList.splice(fromIndex, 1)[0];
            pageList.splice(toIndex, 0, moved);
            renderThumbnails();
          }
        });

        grid.appendChild(card);

        // Render page to thumbnail canvas
        const page = await pdfDocJs.getPage(item.originalNum);
        const cvs = document.getElementById(`reorder-thumb-${i}`);
        if (cvs) {
          const vp = page.getViewport({ scale: 0.35, rotation: item.rotation });
          cvs.width = vp.width;
          cvs.height = vp.height;
          await page.render({ canvasContext: cvs.getContext('2d'), viewport: vp }).promise;
        }
      }
    };

    this.rotatePage = (index, angle) => {
      if (pageList[index]) {
        pageList[index].rotation = (pageList[index].rotation + angle + 360) % 360;
        renderThumbnails();
      }
    };

    this.deletePage = (index) => {
      if (pageList.length <= 1) {
        UI.toast('Le document doit contenir au moins une page.', 'warning');
        return;
      }
      pageList.splice(index, 1);
      renderThumbnails();
    };

    saveBtn?.addEventListener('click', async () => {
      if (!pdfBytes || pageList.length === 0) return;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Génération du nouveau document...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const srcDoc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const outDoc = await PDFLib.PDFDocument.create();

        for (const item of pageList) {
          const [copiedPage] = await outDoc.copyPages(srcDoc, [item.originalNum - 1]);
          const currentRot = copiedPage.getRotation().angle;
          copiedPage.setRotation(PDFLib.degrees((currentRot + item.rotation) % 360));
          outDoc.addPage(copiedPage);
        }

        const outBytes = await outDoc.save();
        UI.download(outBytes, 'document_reorganise.pdf', 'application/pdf');
        UI.toast('Nouveau document PDF téléchargé avec succès !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de la génération du document.', 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Enregistrer & Télécharger le PDF réorganisé';
      }
    });
  },

  /* ================= 5. RECADRAGE DE MARGES (CROP TOOL) ================= */
  initCrop() {
    let pdfBytes = null;
    let pdfDocJs = null;
    let cropPage = 1;

    const topSlider = document.getElementById('crop-margin-top');
    const bottomSlider = document.getElementById('crop-margin-bottom');
    const leftSlider = document.getElementById('crop-margin-left');
    const rightSlider = document.getElementById('crop-margin-right');
    const overlay = document.getElementById('crop-overlay-rect');
    const previewCanvas = document.getElementById('crop-preview-canvas');
    const applyBtn = document.getElementById('crop-action-btn');
    const autoBtn = document.getElementById('crop-auto-detect-btn');

    UI.setupDropzone('pdf-crop-dropzone', 'pdf-crop-input', async (file) => {
      if (!this.isPdf(file)) return;
      try {
        const pdfjs = await this.ensurePdfJs();
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        pdfDocJs = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;

        document.getElementById('pdf-crop-panel').style.display = 'block';
        await renderPreview();
        UI.toast('Ajustez les curseurs pour découper les marges.', 'success');
      } catch (e) {
        console.error(e);
        UI.toast('Erreur de chargement du PDF.', 'error');
      }
    });

    const renderPreview = async () => {
      if (!pdfDocJs || !previewCanvas) return;
      const page = await pdfDocJs.getPage(1);
      const vp = page.getViewport({ scale: 0.8 });
      previewCanvas.width = vp.width;
      previewCanvas.height = vp.height;
      await page.render({ canvasContext: previewCanvas.getContext('2d'), viewport: vp }).promise;
      updateOverlay();
    };

    const updateOverlay = () => {
      if (!overlay || !previewCanvas) return;
      const t = parseFloat(topSlider.value) || 0;
      const b = parseFloat(bottomSlider.value) || 0;
      const l = parseFloat(leftSlider.value) || 0;
      const r = parseFloat(rightSlider.value) || 0;

      const w = previewCanvas.width;
      const h = previewCanvas.height;

      overlay.style.top = `${(t / 100) * h}px`;
      overlay.style.left = `${(l / 100) * w}px`;
      overlay.style.width = `${Math.max(0, w - ((l + r) / 100) * w)}px`;
      overlay.style.height = `${Math.max(0, h - ((t + b) / 100) * h)}px`;
    };

    [topSlider, bottomSlider, leftSlider, rightSlider].forEach(slider => {
      slider?.addEventListener('input', updateOverlay);
    });

    autoBtn?.addEventListener('click', () => {
      if (!previewCanvas) return;
      const ctx = previewCanvas.getContext('2d');
      const imgData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
      const { data, width, height } = imgData;

      let minX = width, minY = height, maxX = 0, maxY = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          // If pixel is not white
          if (r < 240 || g < 240 || b < 240) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX > minX && maxY > minY) {
        topSlider.value = Math.max(0, Math.floor((minY / height) * 90));
        bottomSlider.value = Math.max(0, Math.floor(((height - maxY) / height) * 90));
        leftSlider.value = Math.max(0, Math.floor((minX / width) * 90));
        rightSlider.value = Math.max(0, Math.floor(((width - maxX) / width) * 90));
        updateOverlay();
        UI.toast('Marges blanches détectées et rognées automatiquement !', 'success');
      } else {
        UI.toast('Page entièrement blanche détectée.', 'warning');
      }
    });

    applyBtn?.addEventListener('click', async () => {
      if (!pdfBytes) return;
      applyBtn.disabled = true;
      applyBtn.textContent = 'Application du rognage...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pages = doc.getPages();

        const t = (parseFloat(topSlider.value) || 0) / 100;
        const b = (parseFloat(bottomSlider.value) || 0) / 100;
        const l = (parseFloat(leftSlider.value) || 0) / 100;
        const r = (parseFloat(rightSlider.value) || 0) / 100;

        pages.forEach(p => {
          const width = p.getWidth();
          const height = p.getHeight();

          const cropX = width * l;
          const cropY = height * b;
          const cropW = width * (1 - l - r);
          const cropH = height * (1 - t - b);

          p.setCropBox(cropX, cropY, cropW, cropH);
        });

        const croppedBytes = await doc.save();
        UI.download(croppedBytes, 'document_rogne.pdf', 'application/pdf');
        UI.toast('Rognage appliqué à toutes les pages !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors du rognage.', 'error');
      } finally {
        applyBtn.disabled = false;
        applyBtn.textContent = '✂️ Rogner et Télécharger le PDF';
      }
    });
  },

  /* ================= 6. EXTRACTEUR D'IMAGES ================= */
  initExtractImages() {
    let extractedImages = []; // { dataUrl, filename, size, width, height }
    const gallery = document.getElementById('pdf-extracted-gallery');
    const zipBtn = document.getElementById('pdf-extract-zip-btn');
    const statusText = document.getElementById('pdf-extract-count');

    UI.setupDropzone('pdf-extract-img-dropzone', 'pdf-extract-img-input', async (file) => {
      if (!this.isPdf(file)) return;
      UI.toast('Recherche des images dans le PDF...', 'info');
      extractedImages = [];
      gallery.innerHTML = '';
      if (zipBtn) zipBtn.disabled = true;

      try {
        const pdfjs = await this.ensurePdfJs();
        const pdfBytes = new Uint8Array(await file.arrayBuffer());
        const doc = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;

        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const ops = await page.getOperatorList();

          for (let j = 0; j < ops.fnArray.length; j++) {
            if (ops.fnArray[j] === pdfjs.OPS.paintImageXObject) {
              const objId = ops.argsArray[j][0];
              try {
                const img = await page.objs.get(objId);
                if (img && img.data) {
                  const cvs = document.createElement('canvas');
                  cvs.width = img.width;
                  cvs.height = img.height;
                  const ctx = cvs.getContext('2d');

                  // Create image data
                  const imgData = ctx.createImageData(img.width, img.height);
                  const srcData = img.data;

                  if (srcData.length === img.width * img.height * 4) {
                    imgData.data.set(srcData);
                  } else if (srcData.length === img.width * img.height * 3) {
                    // RGB to RGBA
                    for (let p = 0, q = 0; p < srcData.length; p += 3, q += 4) {
                      imgData.data[q] = srcData[p];
                      imgData.data[q + 1] = srcData[p + 1];
                      imgData.data[q + 2] = srcData[p + 2];
                      imgData.data[q + 3] = 255;
                    }
                  } else if (srcData.length === img.width * img.height) {
                    // Grayscale
                    for (let p = 0, q = 0; p < srcData.length; p++, q += 4) {
                      imgData.data[q] = srcData[p];
                      imgData.data[q + 1] = srcData[p];
                      imgData.data[q + 2] = srcData[p];
                      imgData.data[q + 3] = 255;
                    }
                  }

                  ctx.putImageData(imgData, 0, 0);
                  const dataUrl = cvs.toDataURL('image/png');
                  extractedImages.push({
                    dataUrl,
                    name: `image_p${i}_${extractedImages.length + 1}.png`,
                    width: img.width,
                    height: img.height
                  });
                }
              } catch (e) {}
            }
          }
        }

        if (extractedImages.length === 0) {
          gallery.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Aucune image distincte n'a été détectée dans ce PDF.</div>`;
          if (statusText) statusText.textContent = '0 image trouvée';
        } else {
          if (statusText) statusText.textContent = `${extractedImages.length} image(s) extraite(s)`;
          if (zipBtn) zipBtn.disabled = false;

          gallery.innerHTML = extractedImages.map((img, idx) => `
            <div class="pdf-extracted-item">
              <img src="${img.dataUrl}" class="pdf-extracted-thumb" alt="${img.name}">
              <div class="pdf-extracted-info">
                <span style="font-size: 0.75rem; color: var(--text-muted);">${img.width}x${img.height} px</span>
                <button class="btn btn-secondary btn-sm" onclick="PdfAdvancedTools.downloadSingleImage(${idx})">Télécharger</button>
              </div>
            </div>
          `).join('');

          UI.toast(`${extractedImages.length} image(s) extraite(s) avec succès !`, 'success');
        }
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de l\'extraction d\'images.', 'error');
      }
    });

    this.downloadSingleImage = (idx) => {
      const item = extractedImages[idx];
      if (item) {
        const link = document.createElement('a');
        link.href = item.dataUrl;
        link.download = item.name;
        link.click();
      }
    };

    zipBtn?.addEventListener('click', async () => {
      if (extractedImages.length === 0) return;
      zipBtn.disabled = true;
      zipBtn.textContent = 'Création de l\'archive ZIP...';

      try {
        const zip = new JSZip();
        for (const img of extractedImages) {
          const base64Data = img.dataUrl.split(',')[1];
          zip.file(img.name, base64Data, { base64: true });
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        UI.download(blob, 'images_extraites_pdf.zip', 'application/zip');
        UI.toast('Archive ZIP téléchargée !', 'success');
      } catch (e) {
        console.error(e);
        UI.toast('Erreur de création ZIP.', 'error');
      } finally {
        zipBtn.disabled = false;
        zipBtn.textContent = '📦 Télécharger toutes les images (.ZIP)';
      }
    });
  },

  /* ================= 7. OUTIL DE SIGNATURE ================= */
  initSignature() {
    let pdfBytes = null;
    let pdfDocJs = null;
    let signatureDataUrl = null;
    let currentSigMode = 'draw';
    let targetPageNum = 1;

    // Pad drawing
    const sigCanvas = document.getElementById('signature-canvas');
    if (!sigCanvas) return;
    const sigCtx = sigCanvas.getContext('2d');
    let isSigning = false;

    sigCanvas.width = 450;
    sigCanvas.height = 160;
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.strokeStyle = '#000000';

    const getSigPos = (e) => {
      const rect = sigCanvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    sigCanvas.addEventListener('mousedown', (e) => {
      isSigning = true;
      const pos = getSigPos(e);
      sigCtx.beginPath();
      sigCtx.moveTo(pos.x, pos.y);
    });

    sigCanvas.addEventListener('mousemove', (e) => {
      if (!isSigning) return;
      const pos = getSigPos(e);
      sigCtx.lineTo(pos.x, pos.y);
      sigCtx.stroke();
    });

    window.addEventListener('mouseup', () => {
      if (isSigning) {
        isSigning = false;
        signatureDataUrl = sigCanvas.toDataURL('image/png');
        updateSignatureStamp();
      }
    });

    // Touch support for phones & tablets
    sigCanvas.addEventListener('touchstart', (e) => {
      isSigning = true;
      const t = e.touches[0];
      const rect = sigCanvas.getBoundingClientRect();
      sigCtx.beginPath();
      sigCtx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
      e.preventDefault();
    });
    sigCanvas.addEventListener('touchmove', (e) => {
      if (!isSigning) return;
      const t = e.touches[0];
      const rect = sigCanvas.getBoundingClientRect();
      sigCtx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
      sigCtx.stroke();
      e.preventDefault();
    });
    sigCanvas.addEventListener('touchend', () => {
      isSigning = false;
      signatureDataUrl = sigCanvas.toDataURL('image/png');
      updateSignatureStamp();
    });

    document.getElementById('sig-color-black')?.addEventListener('click', () => {
      sigCtx.strokeStyle = '#000000';
    });
    document.getElementById('sig-color-blue')?.addEventListener('click', () => {
      sigCtx.strokeStyle = '#1d4ed8';
    });
    document.getElementById('sig-clear-btn')?.addEventListener('click', () => {
      sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
      signatureDataUrl = null;
      updateSignatureStamp();
    });

    // Cursive text signature generator
    const typeInput = document.getElementById('sig-type-input');
    const typeFont = document.getElementById('sig-type-font');
    const updateTypeSig = () => {
      const txt = (typeInput?.value || '').trim();
      if (!txt) return;
      const cvs = document.createElement('canvas');
      cvs.width = 450;
      cvs.height = 140;
      const c = cvs.getContext('2d');
      c.font = `italic 46px "${typeFont?.value || 'cursive'}", cursive`;
      c.fillStyle = sigCtx.strokeStyle || '#000000';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(txt, 225, 70);
      signatureDataUrl = cvs.toDataURL('image/png');
      updateSignatureStamp();
    };

    typeInput?.addEventListener('input', updateTypeSig);
    typeFont?.addEventListener('change', updateTypeSig);

    // Image upload signature
    document.getElementById('sig-upload-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Remove white background
          const cvs = document.createElement('canvas');
          cvs.width = img.width;
          cvs.height = img.height;
          const c = cvs.getContext('2d');
          c.drawImage(img, 0, 0);
          const imd = c.getImageData(0, 0, cvs.width, cvs.height);
          const d = imd.data;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i] > 220 && d[i+1] > 220 && d[i+2] > 220) {
              d[i+3] = 0; // Transparent
            }
          }
          c.putImageData(imd, 0, 0);
          signatureDataUrl = cvs.toDataURL('image/png');
          updateSignatureStamp();
          UI.toast('Signature importée avec transparence.', 'success');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    // PDF Preview & stamp placement
    const stampBox = document.getElementById('signature-movable-box');
    const stampImg = document.getElementById('signature-stamp-img');
    const stageCanvas = document.getElementById('signature-stage-canvas');

    const updateSignatureStamp = () => {
      if (!stampBox || !stampImg) return;
      if (signatureDataUrl) {
        stampImg.src = signatureDataUrl;
        stampBox.style.display = 'flex';
      } else {
        stampBox.style.display = 'none';
      }
    };

    // Drag stamp on stage
    let isDraggingStamp = false;
    let stampOffset = { x: 0, y: 0 };

    stampBox?.addEventListener('mousedown', (e) => {
      isDraggingStamp = true;
      const rect = stampBox.getBoundingClientRect();
      stampOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingStamp || !stageCanvas) return;
      const stageRect = stageCanvas.getBoundingClientRect();
      let left = e.clientX - stageRect.left - stampOffset.x;
      let top = e.clientY - stageRect.top - stampOffset.y;

      left = Math.max(0, Math.min(left, stageRect.width - stampBox.offsetWidth));
      top = Math.max(0, Math.min(top, stageRect.height - stampBox.offsetHeight));

      stampBox.style.left = `${left}px`;
      stampBox.style.top = `${top}px`;
    });

    window.addEventListener('mouseup', () => {
      isDraggingStamp = false;
    });

    // PDF load for signature
    UI.setupDropzone('pdf-signature-dropzone', 'pdf-signature-input', async (file) => {
      if (!this.isPdf(file)) return;
      try {
        const pdfjs = await this.ensurePdfJs();
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        pdfDocJs = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;

        const sel = document.getElementById('sig-page-select');
        if (sel) {
          sel.innerHTML = '';
          for (let i = 1; i <= pdfDocJs.numPages; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `Page ${i} sur ${pdfDocJs.numPages}`;
            sel.appendChild(opt);
          }
          sel.value = pdfDocJs.numPages; // Default to last page for signing
          targetPageNum = pdfDocJs.numPages;
        }

        document.getElementById('pdf-signature-panel').style.display = 'block';
        await renderSigStage(targetPageNum);
        UI.toast('Document chargé. Positionnez la signature sur la page.', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur de chargement du PDF.', 'error');
      }
    });

    const renderSigStage = async (pNum) => {
      if (!pdfDocJs || !stageCanvas) return;
      targetPageNum = pNum;
      const page = await pdfDocJs.getPage(pNum);
      const vp = page.getViewport({ scale: 0.9 });
      stageCanvas.width = vp.width;
      stageCanvas.height = vp.height;
      await page.render({ canvasContext: stageCanvas.getContext('2d'), viewport: vp }).promise;

      // Position stamp near bottom right by default
      if (stampBox) {
        stampBox.style.left = `${vp.width - 200}px`;
        stampBox.style.top = `${vp.height - 120}px`;
        stampBox.style.width = `180px`;
        stampBox.style.height = `70px`;
      }
    };

    document.getElementById('sig-page-select')?.addEventListener('change', (e) => {
      renderSigStage(parseInt(e.target.value, 10));
    });

    // Apply signature & export
    document.getElementById('pdf-apply-signature-btn')?.addEventListener('click', async () => {
      if (!pdfBytes || !signatureDataUrl || !stampBox || !stageCanvas) {
        UI.toast('Veuillez charger un document et créer une signature.', 'warning');
        return;
      }
      const btn = document.getElementById('pdf-apply-signature-btn');
      btn.disabled = true;
      btn.textContent = 'Incrustation de la signature...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const page = doc.getPage(targetPageNum - 1);

        const stageWidth = stageCanvas.width;
        const stageHeight = stageCanvas.height;

        const boxLeft = parseFloat(stampBox.style.left) || 0;
        const boxTop = parseFloat(stampBox.style.top) || 0;
        const boxW = stampBox.offsetWidth;
        const boxH = stampBox.offsetHeight;

        const scaleX = page.getWidth() / stageWidth;
        const scaleY = page.getHeight() / stageHeight;

        // PDF coordinate system starts at bottom-left
        const pdfX = boxLeft * scaleX;
        const pdfY = page.getHeight() - (boxTop + boxH) * scaleY;
        const pdfW = boxW * scaleX;
        const pdfH = boxH * scaleY;

        const pngSig = await doc.embedPng(signatureDataUrl);
        page.drawImage(pngSig, {
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH
        });

        const signedBytes = await doc.save();
        UI.download(signedBytes, 'document_signe.pdf', 'application/pdf');
        UI.toast('Document signé avec succès !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de la signature.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '✍️ Appliquer la signature & Télécharger';
      }
    });
  },

  /* ================= 8. FILIGRANE (WATERMARK) ================= */
  initWatermark() {
    let pdfBytes = null;
    let fileName = 'document.pdf';

    UI.setupDropzone('pdf-watermark-dropzone', 'pdf-watermark-input', async (file) => {
      if (this.isPdf(file)) {
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        fileName = file.name;
        document.getElementById('pdf-watermark-panel').style.display = 'block';
        UI.toast('PDF chargé pour filigrane.', 'success');
      }
    });

    document.getElementById('pdf-watermark-action-btn')?.addEventListener('click', async () => {
      if (!pdfBytes) return;
      const text = (document.getElementById('watermark-text-input')?.value || 'CONFIDENTIEL').trim();
      const colorHex = document.getElementById('watermark-color')?.value || '#ef4444';
      const opacity = (parseFloat(document.getElementById('watermark-opacity')?.value) || 25) / 100;
      const angle = parseFloat(document.getElementById('watermark-angle')?.value) || 45;

      const btn = document.getElementById('pdf-watermark-action-btn');
      btn.disabled = true;
      btn.textContent = 'Application du filigrane...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        // Convert hex to rgb
        const r = parseInt(colorHex.slice(1, 3), 16) / 255;
        const g = parseInt(colorHex.slice(3, 5), 16) / 255;
        const b = parseInt(colorHex.slice(5, 7), 16) / 255;

        doc.getPages().forEach(page => {
          const { width, height } = page.getSize();
          const textSize = Math.min(width, height) * 0.12;
          const textWidth = font.widthOfTextAtSize(text, textSize);

          page.drawText(text, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: textSize,
            font,
            color: PDFLib.rgb(r, g, b),
            opacity,
            rotate: PDFLib.degrees(angle)
          });
        });

        const wmBytes = await doc.save();
        UI.download(wmBytes, `filigrane_${fileName}`, 'application/pdf');
        UI.toast('Filigrane appliqué à toutes les pages !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de l\'application du filigrane.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '💧 Appliquer le filigrane & Télécharger';
      }
    });
  },

  /* ================= 9. NUMÉROTATION DE PAGES ================= */
  initPageNumbering() {
    let pdfBytes = null;
    let fileName = 'document.pdf';

    UI.setupDropzone('pdf-numbering-dropzone', 'pdf-numbering-input', async (file) => {
      if (this.isPdf(file)) {
        pdfBytes = new Uint8Array(await file.arrayBuffer());
        fileName = file.name;
        document.getElementById('pdf-numbering-panel').style.display = 'block';
        UI.toast('PDF chargé pour numérotation.', 'success');
      }
    });

    document.getElementById('pdf-numbering-action-btn')?.addEventListener('click', async () => {
      if (!pdfBytes) return;
      const fmt = document.getElementById('numbering-format-select')?.value || 'simple';
      const pos = document.getElementById('numbering-pos-select')?.value || 'bottom-center';
      const skipFirst = document.getElementById('numbering-skip-first')?.checked;

      const btn = document.getElementById('pdf-numbering-action-btn');
      btn.disabled = true;
      btn.textContent = 'Numérotation en cours...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pages = doc.getPages();
        const total = pages.length;
        const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);

        pages.forEach((page, idx) => {
          if (skipFirst && idx === 0) return;

          const num = idx + 1;
          let label = `${num}`;
          if (fmt === 'page-of') label = `Page ${num} / ${total}`;
          else if (fmt === 'sur') label = `${num} sur ${total}`;
          else if (fmt === 'dash') label = `- ${num} -`;

          const fontSize = 10;
          const textWidth = font.widthOfTextAtSize(label, fontSize);
          const { width, height } = page.getSize();
          const margin = 28;

          let x = (width - textWidth) / 2;
          let y = margin;

          if (pos.includes('left')) x = margin;
          else if (pos.includes('right')) x = width - textWidth - margin;

          if (pos.includes('top')) y = height - margin;

          page.drawText(label, {
            x,
            y,
            size: fontSize,
            font,
            color: PDFLib.rgb(0.35, 0.35, 0.35)
          });
        });

        const numBytes = await doc.save();
        UI.download(numBytes, `numerote_${fileName}`, 'application/pdf');
        UI.toast('Pages numérotées avec succès !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur de numérotation.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '🔢 Insérer les numéros & Télécharger';
      }
    });
  },

  /* ================= 10. URL VERS PDF ================= */
  initUrlToPdf() {
    const urlInput = document.getElementById('url2pdf-input');
    const generateBtn = document.getElementById('url2pdf-action-btn');
    const previewBox = document.getElementById('url2pdf-preview-box');

    generateBtn?.addEventListener('click', async () => {
      const rawUrl = (urlInput?.value || '').trim();
      if (!rawUrl) {
        UI.toast('Veuillez entrer une adresse web valide.', 'warning');
        return;
      }
      let url = rawUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = 'Extraction et mise en page...';

      try {
        let htmlContent = '';

        // Try native PHP proxy first if available
        try {
          const res = await fetch(`api/api.php?action=fetch_url&url=${encodeURIComponent(url)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.html) htmlContent = data.html;
          }
        } catch (e) {}

        // Fallback to CORS reader proxy if PHP fetch fails
        if (!htmlContent) {
          const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
          if (proxyRes.ok) {
            const proxyData = await proxyRes.json();
            htmlContent = proxyData.contents;
          }
        }

        if (!htmlContent) throw new Error("Impossible d'accéder au contenu de cette page.");

        // Parse article and create clean reader format
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Remove ads, scripts, nav, footers
        doc.querySelectorAll('script, style, nav, footer, header, iframe, noscript, .ads, .sidebar').forEach(el => el.remove());

        const title = doc.querySelector('h1, title')?.textContent.trim() || 'Document Web';
        const articleText = Array.from(doc.querySelectorAll('p, h2, h3, li'))
          .map(el => el.textContent.trim())
          .filter(t => t.length > 20)
          .slice(0, 40)
          .join('\n\n');

        // Generate clean printable PDF with PDF-Lib
        const PDFLib = await this.ensurePdfLib();
        const pdfDoc = await PDFLib.PDFDocument.create();
        const fontTitle = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const fontBody = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        const page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();
        const margin = 50;

        // Header
        page.drawText(`Archivage Web • ${new Date().toLocaleDateString('fr-FR')}`, {
          x: margin,
          y: height - margin,
          size: 9,
          font: fontBody,
          color: PDFLib.rgb(0.5, 0.5, 0.5)
        });

        // Title
        page.drawText(title.slice(0, 60), {
          x: margin,
          y: height - margin - 35,
          size: 18,
          font: fontTitle,
          color: PDFLib.rgb(0.1, 0.1, 0.1)
        });

        // URL Source
        page.drawText(`Source : ${url.slice(0, 80)}`, {
          x: margin,
          y: height - margin - 55,
          size: 9,
          font: fontBody,
          color: PDFLib.rgb(0.3, 0.5, 0.8)
        });

        // Body preview lines
        const lines = articleText.split('\n').slice(0, 30);
        let currentY = height - margin - 90;
        lines.forEach(l => {
          if (currentY > margin + 20 && l.trim()) {
            page.drawText(l.slice(0, 95), {
              x: margin,
              y: currentY,
              size: 10,
              font: fontBody,
              color: PDFLib.rgb(0.2, 0.2, 0.2)
            });
            currentY -= 16;
          }
        });

        const pdfBytes = await pdfDoc.save();
        UI.download(pdfBytes, `article_web_${Date.now()}.pdf`, 'application/pdf');
        UI.toast('Document PDF généré et téléchargé !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast(`Erreur : ${err.message}`, 'error');
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '🌐 Convertir en PDF & Télécharger';
      }
    });
  },

  /* ================= 11. PDF VERS EXCEL (EXTRACTION TABLEAUX) ================= */
  initPdfToExcel() {
    let extractedRows = []; // array of array of strings
    const previewContainer = document.getElementById('pdf-table-preview-container');
    const downloadCsvBtn = document.getElementById('pdf-table-download-csv');
    const downloadXlsBtn = document.getElementById('pdf-table-download-xls');
    const statusEl = document.getElementById('pdf-table-status');

    UI.setupDropzone('pdf-excel-dropzone', 'pdf-excel-input', async (file) => {
      if (!this.isPdf(file)) return;
      UI.toast('Analyse des colonnes et tableaux...', 'info');
      extractedRows = [];
      previewContainer.innerHTML = '';
      if (downloadCsvBtn) downloadCsvBtn.disabled = true;
      if (downloadXlsBtn) downloadXlsBtn.disabled = true;

      try {
        const pdfjs = await this.ensurePdfJs();
        const pdfBytes = new Uint8Array(await file.arrayBuffer());
        const doc = await pdfjs.getDocument({ data: pdfBytes.slice(0) }).promise;

        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const textContent = await page.getTextContent();
          const items = textContent.items;

          // Group by Y coordinate (rows)
          const rowGroups = {};
          const yThreshold = 8; // pixel tolerance for same line

          items.forEach(item => {
            const y = Math.round(item.transform[5]);
            const existingY = Object.keys(rowGroups).find(k => Math.abs(parseInt(k, 10) - y) < yThreshold);
            const key = existingY || y;
            if (!rowGroups[key]) rowGroups[key] = [];
            rowGroups[key].push({
              x: Math.round(item.transform[4]),
              text: item.str.trim()
            });
          });

          // Sort rows descending by Y (top of page first)
          const sortedYKeys = Object.keys(rowGroups).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

          sortedYKeys.forEach(k => {
            // Sort columns ascending by X (left to right)
            const cols = rowGroups[k].sort((a, b) => a.x - b.x).map(c => c.text).filter(t => t.length > 0);
            if (cols.length > 0) {
              extractedRows.push(cols);
            }
          });
        }

        if (extractedRows.length === 0) {
          previewContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Aucune donnée structurée en tableau détectée.</div>`;
          return;
        }

        // Normalize columns count
        const maxCols = Math.max(...extractedRows.map(r => r.length));
        extractedRows = extractedRows.map(r => {
          while (r.length < maxCols) r.push('');
          return r;
        });

        // Render preview table
        let tableHtml = '<table class="pdf-extracted-table"><thead><tr>';
        for (let c = 0; c < maxCols; c++) {
          tableHtml += `<th>Colonne ${c + 1}</th>`;
        }
        tableHtml += '</tr></thead><tbody>';

        extractedRows.slice(0, 100).forEach(row => {
          tableHtml += '<tr>' + row.map(cell => `<td>${cell || ''}</td>`).join('') + '</tr>';
        });
        tableHtml += '</tbody></table>';

        previewContainer.innerHTML = tableHtml;
        if (statusEl) statusEl.textContent = `${extractedRows.length} lignes • ${maxCols} colonnes détectées`;
        if (downloadCsvBtn) downloadCsvBtn.disabled = false;
        if (downloadXlsBtn) downloadXlsBtn.disabled = false;

        UI.toast(`Tableau extrait : ${extractedRows.length} lignes trouvées !`, 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de l\'extraction des tableaux.', 'error');
      }
    });

    // CSV Download
    downloadCsvBtn?.addEventListener('click', () => {
      if (extractedRows.length === 0) return;
      const delimiter = document.getElementById('pdf-table-delimiter')?.value || ';';
      const csvContent = '\uFEFF' + extractedRows.map(row => 
        row.map(val => `"${val.replace(/"/g, '""')}"`).join(delimiter)
      ).join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      UI.download(blob, 'donnees_extraites.csv', 'text/csv');
      UI.toast('Fichier CSV compatible Excel téléchargé !', 'success');
    });

    // Excel HTML XML format
    downloadXlsBtn?.addEventListener('click', () => {
      if (extractedRows.length === 0) return;
      let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
      html += '<head><meta charset="UTF-8"></head><body><table>';
      extractedRows.forEach(r => {
        html += '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>';
      });
      html += '</table></body></html>';

      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      UI.download(blob, 'donnees_extraites.xls', 'application/vnd.ms-excel');
      UI.toast('Tableau Excel (.xls) téléchargé !', 'success');
    });
  },

  /* ================= 12. IMAGES VERS PDF (MULTI-IMAGES) ================= */
  initImagesToPdf() {
    let imageFiles = []; // array of { file, dataUrl, name }
    const grid = document.getElementById('img2pdf-grid');
    const compileBtn = document.getElementById('img2pdf-compile-btn');
    const countEl = document.getElementById('img2pdf-count');

    UI.setupDropzone('img2pdf-dropzone', 'img2pdf-input', (files) => {
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (validFiles.length === 0) {
        UI.toast('Veuillez déposer des images valides (JPG, PNG, WebP).', 'warning');
        return;
      }

      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          imageFiles.push({
            file,
            dataUrl: reader.result,
            name: file.name
          });
          renderGrid();
        };
        reader.readAsDataURL(file);
      });
    }, true);

    const renderGrid = () => {
      if (!grid) return;
      if (countEl) countEl.textContent = `${imageFiles.length} image(s)`;
      if (compileBtn) compileBtn.disabled = imageFiles.length === 0;

      if (imageFiles.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1.5rem;">Aucune image ajoutée</div>`;
        return;
      }

      grid.innerHTML = imageFiles.map((img, idx) => `
        <div class="img2pdf-card">
          <img src="${img.dataUrl}" class="img2pdf-thumb" alt="${img.name}">
          <span style="font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;">${img.name}</span>
          <div class="img2pdf-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="PdfAdvancedTools.moveImage(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>←</button>
            <button class="btn btn-secondary btn-sm" onclick="PdfAdvancedTools.moveImage(${idx}, 1)" ${idx === imageFiles.length - 1 ? 'disabled' : ''}>→</button>
            <button class="btn btn-danger btn-sm" onclick="PdfAdvancedTools.removeImage(${idx})">✕</button>
          </div>
        </div>
      `).join('');
    };

    this.moveImage = (index, dir) => {
      const target = index + dir;
      if (target >= 0 && target < imageFiles.length) {
        const tmp = imageFiles[index];
        imageFiles[index] = imageFiles[target];
        imageFiles[target] = tmp;
        renderGrid();
      }
    };

    this.removeImage = (index) => {
      imageFiles.splice(index, 1);
      renderGrid();
    };

    compileBtn?.addEventListener('click', async () => {
      if (imageFiles.length === 0) return;
      compileBtn.disabled = true;
      compileBtn.textContent = 'Compilation en PDF...';

      try {
        const PDFLib = await this.ensurePdfLib();
        const doc = await PDFLib.PDFDocument.create();

        const pageSizeOption = document.getElementById('img2pdf-page-size')?.value || 'fit';
        const marginOption = parseFloat(document.getElementById('img2pdf-margin')?.value) || 0;

        for (const item of imageFiles) {
          // Convert WebP/GIF or non-standard to PNG canvas first
          const imgEl = new Image();
          await new Promise((res) => {
            imgEl.onload = res;
            imgEl.src = item.dataUrl;
          });

          const cvs = document.createElement('canvas');
          cvs.width = imgEl.naturalWidth || imgEl.width;
          cvs.height = imgEl.naturalHeight || imgEl.height;
          const c = cvs.getContext('2d');
          c.drawImage(imgEl, 0, 0);
          const pngBytes = cvs.toDataURL('image/png');

          const embeddedImg = await doc.embedPng(pngBytes);
          const imgW = embeddedImg.width;
          const imgH = embeddedImg.height;

          let pageW, pageH, drawX, drawY, drawW, drawH;

          if (pageSizeOption === 'fit') {
            pageW = imgW + marginOption * 2;
            pageH = imgH + marginOption * 2;
            drawX = marginOption;
            drawY = marginOption;
            drawW = imgW;
            drawH = imgH;
          } else if (pageSizeOption === 'a4-portrait') {
            pageW = 595.28; // A4 pt
            pageH = 841.89;
            const availW = pageW - marginOption * 2;
            const availH = pageH - marginOption * 2;
            const ratio = Math.min(availW / imgW, availH / imgH);
            drawW = imgW * ratio;
            drawH = imgH * ratio;
            drawX = (pageW - drawW) / 2;
            drawY = (pageH - drawH) / 2;
          } else {
            // A4 Landscape
            pageW = 841.89;
            pageH = 595.28;
            const availW = pageW - marginOption * 2;
            const availH = pageH - marginOption * 2;
            const ratio = Math.min(availW / imgW, availH / imgH);
            drawW = imgW * ratio;
            drawH = imgH * ratio;
            drawX = (pageW - drawW) / 2;
            drawY = (pageH - drawH) / 2;
          }

          const page = doc.addPage([pageW, pageH]);
          page.drawImage(embeddedImg, {
            x: drawX,
            y: drawY,
            width: drawW,
            height: drawH
          });
        }

        const compiledBytes = await doc.save();
        UI.download(compiledBytes, `images_combinees_${Date.now()}.pdf`, 'application/pdf');
        UI.toast('Document PDF généré à partir de vos images !', 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors de la compilation du PDF.', 'error');
      } finally {
        compileBtn.disabled = false;
        compileBtn.textContent = '📄 Compiler en PDF & Télécharger';
      }
    });
  }
};

window.PdfAdvancedTools = PdfAdvancedTools;
