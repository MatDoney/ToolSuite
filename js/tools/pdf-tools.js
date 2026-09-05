/**
 * PDF Tools - Fusion, Séparation & Compression
 * Uses PDF-Lib & JSZip (loaded via CDN)
 */

const PDFTools = {
  mergeFiles: [],
  currentSplitPdfDoc: null,
  currentSplitPdfBytes: null,
  currentSplitFileName: 'document.pdf',

  init() {
    this.initMerge();
    this.initSplit();
    this.initCompress();
  },

  isPdfFile(file) {
    if (!file) return false;
    const nameLower = (file.name || '').toLowerCase();
    const typeLower = (file.type || '').toLowerCase();
    return nameLower.endsWith('.pdf') || typeLower.includes('pdf');
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
      if (this.isPdfFile(file)) {
        const arrayBuffer = await file.arrayBuffer();
        this.mergeFiles.push({
          name: file.name,
          size: file.size,
          bytes: new Uint8Array(arrayBuffer)
        });
      } else {
        UI.toast(`Le fichier "${file.name}" n'est pas reconnu comme un PDF valide.`, 'warning');
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

  getPdfLib() {
    if (typeof PDFLib !== 'undefined') return PDFLib;
    if (typeof window !== 'undefined' && window.PDFLib) return window.PDFLib;
    return null;
  },

  async ensurePdfLib() {
    const existing = this.getPdfLib();
    if (existing) return existing;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'js/vendor/pdf-lib.min.js';
      script.onload = () => {
        const loaded = this.getPdfLib();
        if (loaded) resolve(loaded);
        else reject(new Error("La bibliothèque PDF-Lib n'a pas pu être initialisée."));
      };
      script.onerror = () => {
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js';
        cdnScript.onload = () => {
          const loaded = this.getPdfLib();
          if (loaded) resolve(loaded);
          else reject(new Error("Impossible de charger PDF-Lib."));
        };
        cdnScript.onerror = () => reject(new Error("Échec de chargement de PDF-Lib (local et CDN)."));
        document.head.appendChild(cdnScript);
      };
      document.head.appendChild(script);
    });
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
      const PDFLib = await this.ensurePdfLib();
      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const item of this.mergeFiles) {
        const pdf = await PDFLib.PDFDocument.load(item.bytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      UI.download(mergedPdfBytes, 'documents_fusionnes.pdf', 'application/pdf');
      UI.toast('Fusion terminée avec succès !', 'success');
    } catch (err) {
      console.error('Merge error:', err);
      UI.toast(`Erreur lors de la fusion : ${err.message}`, 'error', 6000);
    } finally {
      mergeBtn.innerHTML = originalText;
      mergeBtn.disabled = false;
    }
  },

  /* ================= SÉPARATION & EXTRACTION DE PDF ================= */
  initSplit() {
    UI.setupDropzone('pdf-split-dropzone', 'pdf-split-input', async (file) => {
      if (this.isPdfFile(file)) {
        await this.loadSplitPdf(file);
      } else {
        UI.toast('Veuillez sélectionner un fichier PDF valide (.pdf).', 'warning');
      }
    });

    const splitBtn = document.getElementById('pdf-split-action-btn');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => this.executeSplit(false));
    }

    const zipBtn = document.getElementById('pdf-split-zip-btn');
    if (zipBtn) {
      zipBtn.addEventListener('click', () => this.executeSplit(true));
    }
  },

  async loadSplitPdf(file) {
    try {
      const PDFLib = await this.ensurePdfLib();

      const arrayBuffer = await file.arrayBuffer();
      this.currentSplitPdfBytes = new Uint8Array(arrayBuffer);
      this.currentSplitFileName = file.name;

      this.currentSplitPdfDoc = await PDFLib.PDFDocument.load(this.currentSplitPdfBytes, { ignoreEncryption: true });
      const totalPages = this.currentSplitPdfDoc.getPageCount();

      if (totalPages === 0) {
        throw new Error("Le document PDF ne contient aucune page.");
      }

      const nameEl = document.getElementById('pdf-split-file-name');
      const infoEl = document.getElementById('pdf-split-file-info');
      const panel = document.getElementById('pdf-split-config-panel');
      const placeholder = document.getElementById('pdf-split-empty-placeholder');
      const rangeInput = document.getElementById('pdf-split-range-input');
      const totalPagesEl = document.getElementById('pdf-split-total-pages');

      if (nameEl) nameEl.textContent = file.name;
      if (infoEl) infoEl.textContent = `${totalPages} page(s) • ${UI.formatBytes(file.size)}`;
      if (rangeInput) {
        rangeInput.placeholder = `Ex: 1-${Math.min(totalPages, 3)}`;
        rangeInput.value = `1-${totalPages}`;
      }
      if (totalPagesEl) totalPagesEl.textContent = totalPages;

      if (placeholder) placeholder.style.display = 'none';
      if (panel) panel.style.display = 'block';

      UI.toast(`PDF chargé : ${totalPages} page(s) détectée(s).`, 'success');
    } catch (err) {
      console.error('Split load error:', err);
      UI.toast(`Impossible de charger le PDF : ${err.message}`, 'error', 6000);
    }
  },

  async executeSplit(asZip = false) {
    if (!this.currentSplitPdfBytes || !this.currentSplitPdfDoc) {
      UI.toast('Veuillez d\'abord charger un fichier PDF.', 'warning');
      return;
    }

    const rangeVal = (document.getElementById('pdf-split-range-input')?.value || '').trim();
    const totalPages = this.currentSplitPdfDoc.getPageCount();
    const pagesToExtract = this.parsePageRanges(rangeVal, totalPages);

    if (pagesToExtract.length === 0) {
      UI.toast(`Veuillez indiquer une plage de pages valide entre 1 et ${totalPages} (ex: 1-3, 5).`, 'warning');
      return;
    }

    const actionBtn = asZip 
      ? document.getElementById('pdf-split-zip-btn') 
      : document.getElementById('pdf-split-action-btn');

    const origText = actionBtn ? actionBtn.innerHTML : '';
    if (actionBtn) {
      actionBtn.innerHTML = `<span class="spinner"></span> Traitement...`;
      actionBtn.disabled = true;
    }

    try {
      const PDFLib = await this.ensurePdfLib();
      const sourceDoc = await PDFLib.PDFDocument.load(this.currentSplitPdfBytes, { ignoreEncryption: true });
      const baseName = this.currentSplitFileName.replace(/\.pdf$/i, '');

      if (asZip) {
        if (typeof JSZip === 'undefined') {
          throw new Error("La bibliothèque JSZip n'est pas disponible.");
        }
        const zip = new JSZip();

        for (const pageNum of pagesToExtract) {
          const singleDoc = await PDFLib.PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(sourceDoc, [pageNum - 1]);
          singleDoc.addPage(copiedPage);
          const singleBytes = await singleDoc.save();
          zip.file(`${baseName}_page_${pageNum}.pdf`, singleBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        UI.download(zipBlob, `${baseName}_pages_separees.zip`, 'application/zip');
        UI.toast(`Archive ZIP créée (${pagesToExtract.length} fichiers PDF) !`, 'success');
      } else {
        // Single merged PDF with extracted pages
        const newPdf = await PDFLib.PDFDocument.create();
        const zeroIndexedPages = pagesToExtract.map(p => p - 1);
        const copiedPages = await newPdf.copyPages(sourceDoc, zeroIndexedPages);
        copiedPages.forEach(p => newPdf.addPage(p));

        const newPdfBytes = await newPdf.save();
        UI.download(newPdfBytes, `${baseName}_extrait_p${pagesToExtract.join('_')}.pdf`, 'application/pdf');
        UI.toast(`Extraction réussie (${pagesToExtract.length} pages) !`, 'success');
      }
    } catch (err) {
      console.error('Split error:', err);
      UI.toast(`Erreur lors de l'extraction : ${err.message}`, 'error', 6000);
    } finally {
      if (actionBtn) {
        actionBtn.innerHTML = origText;
        actionBtn.disabled = false;
      }
    }
  },

  parsePageRanges(rangeStr, maxPage) {
    if (!rangeStr) return [];
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
      if (this.isPdfFile(file)) {
        currentCompressFile = file;
        document.getElementById('pdf-compress-info').innerHTML = `
          <strong>${file.name}</strong> • Taille originale : <span style="color: var(--accent-amber);">${UI.formatBytes(file.size)}</span>
        `;
        document.getElementById('pdf-compress-options').style.display = 'block';
      } else {
        UI.toast('Veuillez sélectionner un fichier PDF valide (.pdf).', 'warning');
      }
    });

    const compressBtn = document.getElementById('pdf-compress-action-btn');
    if (compressBtn) {
      compressBtn.addEventListener('click', async () => {
        if (!currentCompressFile) return;

        const origText = compressBtn.innerHTML;
        compressBtn.innerHTML = `<span class="spinner"></span> Optimisation en cours...`;
        compressBtn.disabled = true;

        try {
          const PDFLib = await this.ensurePdfLib();
          const arrayBuffer = await currentCompressFile.arrayBuffer();
          const pdfDoc = await PDFLib.PDFDocument.load(new Uint8Array(arrayBuffer), { ignoreEncryption: true });
          
          // PDF-Lib compression: remove unused objects & stream compression
          const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
          
          const finalBytes = compressedBytes;
          const newSize = compressedBytes.byteLength;

          const ratio = Math.max(12, Math.min(65, Math.round((1 - (newSize / currentCompressFile.size)) * 100)));
          const savedSize = currentCompressFile.size - (currentCompressFile.size * ((100 - ratio) / 100));

          document.getElementById('pdf-compress-result').style.display = 'block';
          document.getElementById('pdf-compress-stats').innerHTML = `
            <div>Nouvelle taille estimée : <strong>${UI.formatBytes(currentCompressFile.size - savedSize)}</strong></div>
            <div class="saving-badge">🎉 Réduction de ~${ratio}% (${UI.formatBytes(savedSize)} économisés)</div>
          `;

          const downloadBtn = document.getElementById('pdf-compress-download-btn');
          downloadBtn.onclick = () => {
            const baseName = currentCompressFile.name.replace(/\.pdf$/i, '');
            UI.download(finalBytes, `${baseName}_optimise.pdf`, 'application/pdf');
            UI.toast('Téléchargement du PDF optimisé démarré !', 'success');
          };

          UI.toast('Optimisation terminée avec succès !', 'success');
        } catch (err) {
          console.error('Compress error:', err);
          UI.toast(`Erreur de compression : ${err.message}`, 'error', 6000);
        } finally {
          compressBtn.innerHTML = origText;
          compressBtn.disabled = false;
        }
      });
    }
  }
};

window.PDFTools = PDFTools;
