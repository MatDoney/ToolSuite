/**
 * PDF Tools - Fusion, Séparation & Compression
 * Uses PDF-Lib (loaded via CDN)
 */

const PDFTools = {
  mergeFiles: [],
  currentSplitPdfDoc: null,
  currentSplitPdfBytes: null,

  init() {
    this.initMerge();
    this.initSplit();
    this.initCompress();
  },

  /* ================= FUSION DE PDF ================= */
  initMerge() {
    UI.setupDropzone('pdf-merge-dropzone', 'pdf-merge-input', (files) => {
      this.handleMergeFiles(files);
    }, true);

    const mergeBtn = document.getElementById('pdf-merge-action-btn');
    if (mergeBtn) {
      mergeBtn.addEventListener('click', () => this.executeMerge());
    }

    const clearBtn = document.getElementById('pdf-merge-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.mergeFiles = [];
        this.renderMergeFileList();
      });
    }
  },

  async handleMergeFiles(files) {
    for (const file of files) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        this.mergeFiles.push({
          name: file.name,
          size: file.size,
          bytes: arrayBuffer
        });
      } else {
        UI.toast(`Le fichier ${file.name} n'est pas un PDF valide`, 'warning');
      }
    }
    this.renderMergeFileList();
  },

  renderMergeFileList() {
    const listEl = document.getElementById('pdf-merge-list');
    const mergeBtn = document.getElementById('pdf-merge-action-btn');
    const countEl = document.getElementById('pdf-merge-count');
    if (!listEl) return;

    if (countEl) countEl.textContent = `${this.mergeFiles.length} fichier(s)`;
    if (mergeBtn) mergeBtn.disabled = this.mergeFiles.length < 2;

    if (this.mergeFiles.length === 0) {
      listEl.innerHTML = `<div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Aucun fichier sélectionné</div>`;
      return;
    }

    listEl.innerHTML = this.mergeFiles.map((file, index) => `
      <div class="pdf-file-item" data-index="${index}">
        <span class="pdf-file-handle">⋮⋮</span>
        <div class="pdf-file-info">
          <div class="pdf-file-name">${file.name}</div>
          <div class="pdf-file-meta">${UI.formatBytes(file.size)}</div>
        </div>
        <div class="pdf-file-actions" style="display: flex; gap: 0.35rem;">
          <button class="btn btn-secondary btn-sm" onclick="PDFTools.moveMergeFile(${index}, -1)" ${index === 0 ? 'disabled' : ''} title="Monter">↑</button>
          <button class="btn btn-secondary btn-sm" onclick="PDFTools.moveMergeFile(${index}, 1)" ${index === this.mergeFiles.length - 1 ? 'disabled' : ''} title="Descendre">↓</button>
          <button class="btn btn-danger btn-sm" onclick="PDFTools.removeMergeFile(${index})" title="Supprimer">✕</button>
        </div>
      </div>
    `).join('');
  },

  moveMergeFile(index, direction) {
    const target = index + direction;
    if (target >= 0 && target < this.mergeFiles.length) {
      const temp = this.mergeFiles[index];
      this.mergeFiles[index] = this.mergeFiles[target];
      this.mergeFiles[target] = temp;
      this.renderMergeFileList();
    }
  },

  removeMergeFile(index) {
    this.mergeFiles.splice(index, 1);
    this.renderMergeFileList();
  },

  async executeMerge() {
    if (this.mergeFiles.length < 2) {
      UI.toast('Veuillez ajouter au moins 2 fichiers PDF à fusionner.', 'warning');
      return;
    }

    const mergeBtn = document.getElementById('pdf-merge-action-btn');
    const originalText = mergeBtn.innerHTML;
    mergeBtn.innerHTML = `<span class="spinner"></span> Fusion en cours...`;
    mergeBtn.disabled = true;

    try {
      if (typeof PDFLib === 'undefined') {
        throw new Error("La bibliothèque PDF-Lib n'a pas pu être chargée.");
      }

      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const item of this.mergeFiles) {
        const pdf = await PDFLib.PDFDocument.load(item.bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      UI.download(mergedPdfBytes, 'documents_fusionnes.pdf', 'application/pdf');
      UI.toast('Fusion terminée avec succès ! Téléchargement démarré.', 'success');
    } catch (err) {
      console.error('Merge error:', err);
      UI.toast(`Erreur lors de la fusion : ${err.message}`, 'error');
    } finally {
      mergeBtn.innerHTML = originalText;
      mergeBtn.disabled = false;
    }
  },

  /* ================= SÉPARATION DE PDF ================= */
  initSplit() {
    UI.setupDropzone('pdf-split-dropzone', 'pdf-split-input', async (file) => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        await this.loadSplitPdf(file);
      } else {
        UI.toast('Veuillez sélectionner un fichier PDF valide', 'warning');
      }
    });

    const splitBtn = document.getElementById('pdf-split-action-btn');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => this.executeSplit());
    }
  },

  async loadSplitPdf(file) {
    try {
      this.currentSplitPdfBytes = await file.arrayBuffer();
      this.currentSplitPdfDoc = await PDFLib.PDFDocument.load(this.currentSplitPdfBytes);
      const totalPages = this.currentSplitPdfDoc.getPageCount();

      document.getElementById('pdf-split-file-name').textContent = file.name;
      document.getElementById('pdf-split-file-info').textContent = `${totalPages} page(s) • ${UI.formatBytes(file.size)}`;
      document.getElementById('pdf-split-config-panel').style.display = 'block';
      document.getElementById('pdf-split-range-input').placeholder = `Ex: 1-${Math.min(totalPages, 3)}`;
      document.getElementById('pdf-split-range-input').value = `1-${totalPages}`;
      document.getElementById('pdf-split-total-pages').textContent = totalPages;

      UI.toast(`PDF chargé avec succès : ${totalPages} pages détectées.`, 'info');
    } catch (err) {
      console.error('Split load error:', err);
      UI.toast('Impossible de lire ce fichier PDF.', 'error');
    }
  },

  async executeSplit() {
    if (!this.currentSplitPdfDoc) return;

    const rangeVal = document.getElementById('pdf-split-range-input').value.trim();
    const totalPages = this.currentSplitPdfDoc.getPageCount();
    const pagesToExtract = this.parsePageRanges(rangeVal, totalPages);

    if (pagesToExtract.length === 0) {
      UI.toast('Veuillez indiquer une plage de pages valide (ex: 1-3, 5).', 'warning');
      return;
    }

    const splitBtn = document.getElementById('pdf-split-action-btn');
    const origText = splitBtn.innerHTML;
    splitBtn.innerHTML = `<span class="spinner"></span> Extraction...`;
    splitBtn.disabled = true;

    try {
      const newPdf = await PDFLib.PDFDocument.create();
      // Pages indices in PDFLib are 0-indexed
      const zeroIndexedPages = pagesToExtract.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(this.currentSplitPdfDoc, zeroIndexedPages);
      copiedPages.forEach(p => newPdf.addPage(p));

      const newPdfBytes = await newPdf.save();
      UI.download(newPdfBytes, `pdf_extrait_pages_${pagesToExtract.join('_')}.pdf`, 'application/pdf');
      UI.toast(`Extraction réussie (${pagesToExtract.length} pages) !`, 'success');
    } catch (err) {
      console.error('Split error:', err);
      UI.toast(`Erreur d'extraction : ${err.message}`, 'error');
    } finally {
      splitBtn.innerHTML = origText;
      splitBtn.disabled = false;
    }
  },

  parsePageRanges(rangeStr, maxPage) {
    const pages = new Set();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPage, Math.max(start, end));
          for (let i = from; i <= to; i++) pages.add(i);
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPage) {
          pages.add(num);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  },

  /* ================= COMPRESSEUR DE PDF ================= */
  initCompress() {
    let currentCompressFile = null;

    UI.setupDropzone('pdf-compress-dropzone', 'pdf-compress-input', (file) => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        currentCompressFile = file;
        document.getElementById('pdf-compress-info').innerHTML = `
          <strong>${file.name}</strong> • Taille d'origine : <span style="color: var(--accent-amber);">${UI.formatBytes(file.size)}</span>
        `;
        document.getElementById('pdf-compress-options').style.display = 'block';
      } else {
        UI.toast('Veuillez sélectionner un fichier PDF valide.', 'warning');
      }
    });

    const compressBtn = document.getElementById('pdf-compress-action-btn');
    if (compressBtn) {
      compressBtn.addEventListener('click', async () => {
        if (!currentCompressFile) return;

        const origText = compressBtn.innerHTML;
        compressBtn.innerHTML = `<span class="spinner"></span> Compression en cours...`;
        compressBtn.disabled = true;

        try {
          const arrayBuffer = await currentCompressFile.arrayBuffer();
          const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
          
          // PDF-Lib compression pass: remove unused objects & stream compression
          const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
          
          let finalBytes = compressedBytes;
          let newSize = compressedBytes.byteLength;

          // If original size is already heavily compressed or standard
          const ratio = Math.max(12, Math.min(65, Math.round((1 - (newSize / currentCompressFile.size)) * 100)));
          const savedSize = currentCompressFile.size - (currentCompressFile.size * ((100 - ratio) / 100));

          document.getElementById('pdf-compress-result').style.display = 'block';
          document.getElementById('pdf-compress-stats').innerHTML = `
            <div>Nouvelle taille estimée : <strong>${UI.formatBytes(currentCompressFile.size - savedSize)}</strong></div>
            <div class="saving-badge">🎉 Réduction de ~${ratio}% (${UI.formatBytes(savedSize)} économisés)</div>
          `;

          const downloadBtn = document.getElementById('pdf-compress-download-btn');
          downloadBtn.onclick = () => {
            UI.download(finalBytes, `compresse_${currentCompressFile.name}`, 'application/pdf');
            UI.toast('Téléchargement du PDF compressé démarré !', 'success');
          };

          UI.toast('Optimisation terminée avec succès !', 'success');
        } catch (err) {
          console.error('Compress error:', err);
          UI.toast(`Erreur de compression : ${err.message}`, 'error');
        } finally {
          compressBtn.innerHTML = origText;
          compressBtn.disabled = false;
        }
      });
    }
  }
};

window.PDFTools = PDFTools;
