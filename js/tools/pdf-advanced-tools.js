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

/**
 * Standalone PDF Encryption Engine
 * Implements ISO 32000-1 Algorithm 2 & 3 (Standard Security Handler, Revision 3, RC4 128-bit)
 * Produces real password-protected PDFs compatible with all standard viewers.
 */
const PdfEncryptEngine = {
  md5(data) {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const S = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    const K = new Uint32Array([
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
      0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
      0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
      0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
      0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
      0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
      0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
      0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
      0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ]);
    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    const msgLen = bytes.length;
    const msgBitLen = msgLen * 8;
    const msgLenPadded = ((msgLen + 9 + 63) & ~63);
    const msg = new Uint8Array(msgLenPadded);
    msg.set(bytes);
    msg[msgLen] = 0x80;
    const dataView = new DataView(msg.buffer);
    dataView.setUint32(msgLenPadded - 8, msgBitLen, true);
    dataView.setUint32(msgLenPadded - 4, 0, true);

    for (let offset = 0; offset < msgLenPadded; offset += 64) {
      const chunk = new Uint32Array(msg.buffer, offset, 16);
      let a = a0, b = b0, c = c0, d = d0;
      for (let i = 0; i < 64; i++) {
        let f, g;
        if (i < 16) {
          f = (b & c) | ((~b) & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7 * i) % 16;
        }
        f = (f + a + K[i] + chunk[g]) >>> 0;
        a = d;
        d = c;
        c = b;
        b = (b + ((f << S[i]) | (f >>> (32 - S[i])))) >>> 0;
      }
      a0 = (a0 + a) >>> 0;
      b0 = (b0 + b) >>> 0;
      c0 = (c0 + c) >>> 0;
      d0 = (d0 + d) >>> 0;
    }
    const result = new Uint8Array(16);
    const view = new DataView(result.buffer);
    view.setUint32(0, a0, true);
    view.setUint32(4, b0, true);
    view.setUint32(8, c0, true);
    view.setUint32(12, d0, true);
    return result;
  },

  rc4(key, data) {
    const s = new Uint8Array(256);
    for (let i = 0; i < 256; i++) s[i] = i;
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + s[i] + key[i % key.length]) & 0xFF;
      [s[i], s[j]] = [s[j], s[i]];
    }
    const result = new Uint8Array(data.length);
    let i = 0, j2 = 0;
    for (let k = 0; k < data.length; k++) {
      i = (i + 1) & 0xFF;
      j2 = (j2 + s[i]) & 0xFF;
      [s[i], s[j2]] = [s[j2], s[i]];
      const t = (s[i] + s[j2]) & 0xFF;
      result[k] = data[k] ^ s[t];
    }
    return result;
  },

  hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  },

  bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  encodePassword(password) {
    const PDFDOC_DIFFS = {
      0x16: 0x0017, 0x18: 0x02d8, 0x19: 0x02c7, 0x1a: 0x02c6, 0x1b: 0x02d9,
      0x1c: 0x02dd, 0x1d: 0x02db, 0x1e: 0x02da, 0x1f: 0x02dc,
      0x80: 0x2022, 0x81: 0x2020, 0x82: 0x2021, 0x83: 0x2026, 0x84: 0x2014,
      0x85: 0x2013, 0x86: 0x0192, 0x87: 0x2044, 0x88: 0x2039, 0x89: 0x203a,
      0x8a: 0x2212, 0x8b: 0x2030, 0x8c: 0x201e, 0x8d: 0x201c, 0x8e: 0x201d,
      0x8f: 0x2018, 0x90: 0x2019, 0x91: 0x201a, 0x92: 0x2122, 0x93: 0xfb01,
      0x94: 0xfb02, 0x95: 0x0141, 0x96: 0x0152, 0x97: 0x0160, 0x98: 0x0178,
      0x99: 0x017d, 0x9a: 0x0131, 0x9b: 0x0142, 0x9c: 0x0153, 0x9d: 0x0161,
      0x9e: 0x017e, 0xa0: 0x20ac
    };
    const map = new Map();
    for (let byte = 0; byte < 256; byte++) {
      const cp = byte in PDFDOC_DIFFS ? PDFDOC_DIFFS[byte] : byte;
      if (cp < 0) continue;
      if (!map.has(cp)) map.set(cp, byte);
    }
    const bytes = [];
    for (const char of (password || '')) {
      const cp = char.codePointAt(0);
      const byte = map.get(cp);
      bytes.push(byte !== undefined ? byte : (cp & 0xFF));
    }
    return new Uint8Array(bytes);
  },

  padding: new Uint8Array([
    0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41,
    0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
    0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80,
    0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A
  ]),

  padPassword(pwd) {
    const pwdBytes = this.encodePassword(pwd || '');
    const padded = new Uint8Array(32);
    if (pwdBytes.length >= 32) {
      padded.set(pwdBytes.slice(0, 32));
    } else {
      padded.set(pwdBytes);
      padded.set(this.padding.slice(0, 32 - pwdBytes.length), pwdBytes.length);
    }
    return padded;
  },

  computeOwnerKey(ownerPassword, userPassword) {
    const paddedOwner = this.padPassword(ownerPassword || userPassword);
    let hash = this.md5(paddedOwner);
    for (let i = 0; i < 50; i++) {
      hash = this.md5(hash);
    }
    const paddedUser = this.padPassword(userPassword);
    let result = new Uint8Array(paddedUser);
    for (let i = 0; i < 20; i++) {
      const key = new Uint8Array(hash.length);
      for (let j = 0; j < hash.length; j++) {
        key[j] = hash[j] ^ i;
      }
      result = this.rc4(key.slice(0, 16), result);
    }
    return result;
  },

  computeEncryptionKey(userPassword, ownerKey, permissions, fileId) {
    const paddedPwd = this.padPassword(userPassword);
    const hashInput = new Uint8Array(paddedPwd.length + ownerKey.length + 4 + fileId.length);
    let offset = 0;
    hashInput.set(paddedPwd, offset); offset += paddedPwd.length;
    hashInput.set(ownerKey, offset); offset += ownerKey.length;
    hashInput[offset++] = permissions & 0xFF;
    hashInput[offset++] = (permissions >> 8) & 0xFF;
    hashInput[offset++] = (permissions >> 16) & 0xFF;
    hashInput[offset++] = (permissions >> 24) & 0xFF;
    hashInput.set(fileId, offset);

    let hash = this.md5(hashInput);
    for (let i = 0; i < 50; i++) {
      hash = this.md5(hash.slice(0, 16));
    }
    return hash.slice(0, 16);
  },

  computeUserKey(encryptionKey, fileId) {
    const hashInput = new Uint8Array(this.padding.length + fileId.length);
    hashInput.set(this.padding);
    hashInput.set(fileId, this.padding.length);
    const hash = this.md5(hashInput);
    let result = this.rc4(encryptionKey, hash);
    for (let i = 1; i <= 19; i++) {
      const key = new Uint8Array(encryptionKey.length);
      for (let j = 0; j < encryptionKey.length; j++) {
        key[j] = encryptionKey[j] ^ i;
      }
      result = this.rc4(key, result);
    }
    const finalResult = new Uint8Array(32);
    finalResult.set(result);
    return finalResult;
  },

  encryptObject(data, objectNum, generationNum, encryptionKey) {
    const keyInput = new Uint8Array(encryptionKey.length + 5);
    keyInput.set(encryptionKey);
    keyInput[encryptionKey.length] = objectNum & 0xFF;
    keyInput[encryptionKey.length + 1] = (objectNum >> 8) & 0xFF;
    keyInput[encryptionKey.length + 2] = (objectNum >> 16) & 0xFF;
    keyInput[encryptionKey.length + 3] = generationNum & 0xFF;
    keyInput[encryptionKey.length + 4] = (generationNum >> 8) & 0xFF;
    const objectKey = this.md5(keyInput);
    return this.rc4(objectKey.slice(0, Math.min(encryptionKey.length + 5, 16)), data);
  },

  bytesToPDFStringValue(bytes) {
    const out = new Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if (b === 0x5c) out[i] = '\\\\';
      else if (b === 0x28) out[i] = '\\(';
      else if (b === 0x29) out[i] = '\\)';
      else if (b === 0x0d) out[i] = '\\r';
      else if (b === 0x0a) out[i] = '\\n';
      else out[i] = String.fromCharCode(b);
    }
    return out.join('');
  },

  async encryptPDF(pdfBytes, userPassword, ownerPassword = null) {
    const PDFLib = window.PDFLib || (typeof PDFLib !== 'undefined' ? PDFLib : null);
    if (!PDFLib) throw new Error("PDFLib n'est pas chargé.");

    const { PDFDocument, PDFName, PDFHexString, PDFString, PDFDict, PDFArray, PDFRawStream, PDFNumber } = PDFLib;

    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    if (pdfDoc.isEncrypted) {
      throw new Error("Ce document est déjà protégé par mot de passe.");
    }

    const context = pdfDoc.context;
    const trailer = context.trailerInfo;
    const idArray = trailer.ID;

    let fileId;
    const firstId = idArray instanceof PDFArray ? idArray.get(0)
      : (Array.isArray(idArray) && idArray.length > 0) ? idArray[0] : undefined;

    if (firstId && typeof firstId.asBytes === 'function' && firstId.asBytes().length > 0) {
      fileId = firstId.asBytes();
    } else {
      fileId = new Uint8Array(16);
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(fileId);
      } else {
        for (let i = 0; i < 16; i++) fileId[i] = Math.floor(Math.random() * 256);
      }
      trailer.ID = [
        PDFHexString.of(this.bytesToHex(fileId)),
        PDFHexString.of(this.bytesToHex(fileId))
      ];
    }

    const permissions = -4; // 0xFFFFFFFC
    const ownerKey = this.computeOwnerKey(ownerPassword, userPassword);
    const encryptionKey = this.computeEncryptionKey(userPassword, ownerKey, permissions, fileId);
    const userKey = this.computeUserKey(encryptionKey, fileId);

    const indirectObjects = context.enumerateIndirectObjects();
    const seen = new WeakSet();

    const encryptStringsInObject = (obj, objectNum, generationNum) => {
      if (!obj || seen.has(obj)) return;
      if (obj instanceof PDFString) {
        seen.add(obj);
        const enc = this.encryptObject(obj.asBytes(), objectNum, generationNum, encryptionKey);
        obj.value = this.bytesToPDFStringValue(enc);
      } else if (obj instanceof PDFHexString) {
        seen.add(obj);
        const enc = this.encryptObject(obj.asBytes(), objectNum, generationNum, encryptionKey);
        obj.value = this.bytesToHex(enc);
      } else if (obj instanceof PDFDict) {
        seen.add(obj);
        for (const [key, value] of obj.entries()) {
          const keyName = key.asString();
          if (keyName === '/Length' || keyName === '/Filter' || keyName === '/DecodeParms') continue;
          encryptStringsInObject(value, objectNum, generationNum);
        }
      } else if (obj instanceof PDFArray) {
        seen.add(obj);
        for (const el of obj.asArray()) {
          encryptStringsInObject(el, objectNum, generationNum);
        }
      }
    };

    for (const [ref, obj] of indirectObjects) {
      const objectNum = ref.objectNumber;
      const generationNum = ref.generationNumber || 0;

      if (obj instanceof PDFDict) {
        const filter = obj.get(PDFName.of('Filter'));
        if (filter && filter.asString() === '/Standard') continue;
      }

      if (obj instanceof PDFRawStream && obj.dict) {
        const type = obj.dict.get(PDFName.of('Type'));
        if (type) {
          const typeName = type.toString();
          if (typeName === '/XRef' || typeName === '/Sig') continue;
        }
      }

      if (obj instanceof PDFRawStream) {
        obj.contents = this.encryptObject(obj.contents, objectNum, generationNum, encryptionKey);
        if (obj.dict) {
          encryptStringsInObject(obj.dict, objectNum, generationNum);
        }
      } else {
        encryptStringsInObject(obj, objectNum, generationNum);
      }
    }

    const encryptDict = context.obj({
      Filter: PDFName.of('Standard'),
      V: PDFNumber.of(2),
      R: PDFNumber.of(3),
      Length: PDFNumber.of(128),
      P: PDFNumber.of(permissions),
      O: PDFHexString.of(this.bytesToHex(ownerKey)),
      U: PDFHexString.of(this.bytesToHex(userKey))
    });

    trailer.Encrypt = context.register(encryptDict);

    return await pdfDoc.save({
      useObjectStreams: false,
      updateFieldAppearances: false
    });
  }
};

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
      s.src = 'js/vendor/pdf-lib.min.js';
      s.onload = () => resolve(window.PDFLib);
      s.onerror = () => {
        const s2 = document.createElement('script');
        s2.src = 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js';
        s2.onload = () => resolve(window.PDFLib);
        s2.onerror = () => reject(new Error("Impossible de charger PDF-Lib."));
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
    });
  },

  async ensurePdfJs() {
    if (typeof pdfjsLib !== 'undefined') {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
      }
      return pdfjsLib;
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'js/vendor/pdf.min.js';
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = () => {
        const s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s2.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        };
        s2.onerror = () => reject(new Error("Impossible de charger PDF.js."));
        document.head.appendChild(s2);
      };
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
    let redactedBoxes = {}; // pageNum -> array of {x, y, w, h}
    let isDrawing = false;
    let startX = 0, startY = 0;
    let cachedPageCanvas = null; // Clean rendered base bitmap cache

    const canvas = document.getElementById('redact-canvas');
    const overlayCanvas = document.getElementById('redact-overlay-canvas');
    const pageSelect = document.getElementById('redact-page-select');
    const undoBtn = document.getElementById('redact-undo-btn');
    const clearBtn = document.getElementById('redact-clear-btn');
    const applyBtn = document.getElementById('redact-apply-btn');
    const infoEl = document.getElementById('redact-info');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;

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
        UI.toast(`PDF chargé (${totalPages} pages). Dessinez des rectangles noirs sur les zones à détruire.`, 'success');
      } catch (err) {
        console.error(err);
        UI.toast('Erreur lors du chargement du PDF.', 'error');
      }
    });

    const updateInfo = () => {
      if (infoEl) {
        const count = (redactedBoxes[currentPageNum] || []).length;
        infoEl.textContent = `Page ${currentPageNum}/${totalPages} • ${count} zone(s) caviardée(s)`;
      }
    };

    const drawBoxes = () => {
      if (cachedPageCanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(cachedPageCanvas, 0, 0);
      }
      const boxes = redactedBoxes[currentPageNum] || [];
      ctx.fillStyle = '#000000';
      boxes.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });
      updateInfo();
    };

    const renderPage = async (num) => {
      if (!pdfDoc) return;
      currentPageNum = num;
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });

      const w = Math.floor(viewport.width);
      const h = Math.floor(viewport.height);

      canvas.width = w;
      canvas.height = h;

      if (overlayCanvas) {
        overlayCanvas.width = w;
        overlayCanvas.height = h;
      }

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Cache the clean page offscreen for instantaneous redrawing without layout reflows
      cachedPageCanvas = document.createElement('canvas');
      cachedPageCanvas.width = w;
      cachedPageCanvas.height = h;
      cachedPageCanvas.getContext('2d').drawImage(canvas, 0, 0);

      drawBoxes();
    };

    pageSelect?.addEventListener('change', (e) => {
      renderPage(parseInt(e.target.value, 10));
    });

    // Precise canvas coordinate calculation
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const rawX = (clientX - rect.left) * scaleX;
      const rawY = (clientY - rect.top) * scaleY;
      return {
        x: Math.max(0, Math.min(canvas.width, rawX)),
        y: Math.max(0, Math.min(canvas.height, rawY))
      };
    };

    const startDraw = (e) => {
      if (!pdfDoc) return;
      isDrawing = true;
      const pos = getPos(e);
      startX = pos.x;
      startY = pos.y;
    };

    const moveDraw = (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      const rx = Math.min(startX, pos.x);
      const ry = Math.min(startY, pos.y);
      const rw = Math.abs(pos.x - startX);
      const rh = Math.abs(pos.y - startY);

      if (overlayCtx && overlayCanvas) {
        // High-performance overlay drawing: zero flicker, zero async calls, zero layout shifts
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        overlayCtx.strokeStyle = '#e53e3e';
        overlayCtx.lineWidth = 1.5;
        overlayCtx.fillRect(rx, ry, rw, rh);
        overlayCtx.strokeRect(rx, ry, rw, rh);
      }
    };

    const endDraw = (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      if (overlayCtx && overlayCanvas) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }

      const pos = getPos(e);
      const rx = Math.min(startX, pos.x);
      const ry = Math.min(startY, pos.y);
      const rw = Math.abs(pos.x - startX);
      const rh = Math.abs(pos.y - startY);

      if (rw > 5 && rh > 5) {
        if (!redactedBoxes[currentPageNum]) redactedBoxes[currentPageNum] = [];
        redactedBoxes[currentPageNum].push({ x: rx, y: ry, w: rw, h: rh });
        // Immediately paint solid black box onto base canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(rx, ry, rw, rh);
        updateInfo();
      }
    };

    canvas.addEventListener('mousedown', startDraw);
    window.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    // Touch support for tablets / touchscreens
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    window.addEventListener('touchmove', (e) => { if (isDrawing) { e.preventDefault(); moveDraw(e); } }, { passive: false });
    window.addEventListener('touchend', (e) => { if (isDrawing) { endDraw(e); } });

    undoBtn?.addEventListener('click', () => {
      if (redactedBoxes[currentPageNum] && redactedBoxes[currentPageNum].length > 0) {
        redactedBoxes[currentPageNum].pop();
        drawBoxes();
      }
    });

    clearBtn?.addEventListener('click', () => {
      redactedBoxes[currentPageNum] = [];
      drawBoxes();
    });

    // Apply permanent physical redaction
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
      applyBtn.textContent = 'Destruction physique et caviardage en cours...';

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

        // Check if document requires password
        try {
          const pdfjs = await this.ensurePdfJs();
          const testTask = pdfjs.getDocument({ data: unlockPdfBytes.slice(0) });
          await testTask.promise;
          UI.toast('Ce document ne semble pas verrouillé par mot de passe. Vous pouvez quand même en générer une copie propre.', 'info', 4000);
        } catch (e) {
          if (e.name === 'PasswordException') {
            UI.toast('Document verrouillé détecté. Saisissez le mot de passe pour le déverrouiller.', 'warning', 4000);
          }
        }
      }
    });

    // Unlock Action
    document.getElementById('pdf-unlock-btn')?.addEventListener('click', async () => {
      if (!unlockPdfBytes) return;
      const pwd = document.getElementById('pdf-unlock-pwd').value;
      const btn = document.getElementById('pdf-unlock-btn');
      btn.disabled = true;
      btn.textContent = 'Déchiffrement et déverrouillage...';

      try {
        const pdfjs = await this.ensurePdfJs();
        const PDFLib = await this.ensurePdfLib();

        const loadingTask = pdfjs.getDocument({
          data: unlockPdfBytes.slice(0),
          password: pwd
        });

        const doc = await loadingTask.promise;
        const totalPages = doc.numPages;

        // Render clean, 100% unencrypted PDF (free of any password, DRM or restriction)
        const cleanDoc = await PDFLib.PDFDocument.create();
        for (let i = 1; i <= totalPages; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // 300 DPI high clarity
          const cvs = document.createElement('canvas');
          cvs.width = Math.floor(viewport.width);
          cvs.height = Math.floor(viewport.height);
          await page.render({ canvasContext: cvs.getContext('2d'), viewport }).promise;

          const img = await cleanDoc.embedPng(cvs.toDataURL('image/png'));
          const p = cleanDoc.addPage([page.view[2] - page.view[0], page.view[3] - page.view[1]]);
          p.drawImage(img, { x: 0, y: 0, width: p.getWidth(), height: p.getHeight() });
        }

        const cleanBytes = await cleanDoc.save();
        UI.download(cleanBytes, 'document_deverrouille.pdf', 'application/pdf');
        UI.toast('Protection retirée avec succès ! Le fichier est désormais libre d\'accès et non chiffré.', 'success', 5000);
      } catch (err) {
        console.error(err);
        if (err.name === 'PasswordException' || (err.message || '').toLowerCase().includes('password')) {
          UI.toast('Mot de passe incorrect ou manquant. Vérifiez la saisie.', 'error');
        } else {
          UI.toast(`Échec du déverrouillage : ${err.message}`, 'error');
        }
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
      const pwd = document.getElementById('pdf-lock-pwd').value;
      if (!pwd) {
        UI.toast('Veuillez saisir un mot de passe pour verrouiller le document.', 'warning');
        return;
      }

      const btn = document.getElementById('pdf-lock-btn');
      btn.disabled = true;
      btn.textContent = 'Chiffrement sécurisé en cours...';

      try {
        await this.ensurePdfLib();

        // Perform authentic ISO 32000-1 Standard Security Handler Revision 3 (RC4-128) encryption
        const encryptedBytes = await PdfEncryptEngine.encryptPDF(lockPdfBytes, pwd);

        UI.download(encryptedBytes, 'document_protege.pdf', 'application/pdf');
        UI.toast('Document chiffré avec succès ! Le mot de passe sera requis pour toute ouverture.', 'success', 6000);
      } catch (err) {
        console.error(err);
        UI.toast(`Erreur lors du verrouillage : ${err.message}`, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = '🔒 Protéger et Télécharger';
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
    const statusCard = document.getElementById('url2pdf-status-card');
    const statusTitle = document.getElementById('url2pdf-status-title');
    const statusBadge = document.getElementById('url2pdf-status-badge');
    const statusStats = document.getElementById('url2pdf-status-stats');

    const sanitizeForWinAnsi = (text) => {
      if (!text) return '';
      return text
        .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
        .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
        .replace(/[\u2013\u2014\u2015]/g, '-')
        .replace(/\u2026/g, '...')
        .replace(/[\u00A0\u202F\u2009\u2002\u2003]/g, ' ')
        .replace(/[\u2022\u25CF\u25AA\u25B8]/g, '-')
        .replace(/[\u00AB\u00BB]/g, '"')
        .replace(/[^\x00-\xFF]/g, '?');
    };

    const wrapText = (text, font, fontSize, maxWidth) => {
      const words = text.trim().split(/\s+/);
      const lines = [];
      let currentLine = '';
      for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        let width = 0;
        try {
          width = font.widthOfTextAtSize(candidate, fontSize);
        } catch (e) {
          width = candidate.length * (fontSize * 0.52);
        }
        if (width <= maxWidth) {
          currentLine = candidate;
        } else {
          if (currentLine) lines.push(currentLine);
          let wWidth = 0;
          try {
            wWidth = font.widthOfTextAtSize(word, fontSize);
          } catch (e) {
            wWidth = word.length * (fontSize * 0.52);
          }
          if (wWidth > maxWidth) {
            let chunk = '';
            for (const ch of word) {
              const testChunk = chunk + ch;
              let cWidth = 0;
              try { cWidth = font.widthOfTextAtSize(testChunk, fontSize); } catch (e) {}
              if (cWidth <= maxWidth) {
                chunk = testChunk;
              } else {
                lines.push(chunk);
                chunk = ch;
              }
            }
            currentLine = chunk;
          } else {
            currentLine = word;
          }
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

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
      generateBtn.textContent = 'Extraction intégrale de l\'article...';
      if (statusCard) statusCard.style.display = 'none';

      try {
        let htmlContent = '';

        // 1. Try native PHP proxy endpoint
        try {
          const res = await fetch(`api/api.php?action=fetch_url&url=${encodeURIComponent(url)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.html) htmlContent = data.html;
          }
        } catch (e) {}

        // 2. Fallback to AllOrigins CORS reader proxy
        if (!htmlContent) {
          try {
            const proxyRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            if (proxyRes.ok) {
              const proxyData = await proxyRes.json();
              htmlContent = proxyData.contents;
            }
          } catch (e) {}
        }

        // 3. Fallback to CorsProxy.io
        if (!htmlContent) {
          try {
            const proxyRes2 = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
            if (proxyRes2.ok) {
              htmlContent = await proxyRes2.text();
            }
          } catch (e) {}
        }

        if (!htmlContent) {
          throw new Error("Impossible d'accéder au contenu de cette page. Vérifiez l'adresse ou la connexion.");
        }

        // Parse article and create clean reader format
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Remove ads, scripts, nav, footers, popups, and non-article clutter
        doc.querySelectorAll(
          'script, style, noscript, nav, footer, header, aside, iframe, svg, form, input, button, select, textarea, menu, [role="navigation"], [role="banner"], [role="search"], [role="contentinfo"], .ad, .ads, .advertisement, .sidebar, .comments, #comments, .social-share, .share, .cookie-banner, .modal, .popup, .newsletter, .breadcrumb, .meta-share'
        ).forEach(el => el.remove());

        // Extract title
        let title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
          || doc.querySelector('h1')?.textContent.trim()
          || doc.title
          || 'Document Web';
        title = title.replace(/\s+/g, ' ').trim();

        // Find primary content container
        let contentRoot = doc.querySelector('article, [itemprop="articleBody"], main, [role="main"], .article-content, .post-content, .entry-content, .story-body, .article-body, .content-body, .page-content');
        if (!contentRoot || contentRoot.textContent.trim().length < 150) {
          contentRoot = doc.body;
        }

        // Extract structured content blocks without omission
        const blocks = [];
        let totalWords = 0;

        const candidateElements = contentRoot.querySelectorAll('h1, h2, h3, h4, p, li, blockquote, pre');
        candidateElements.forEach(el => {
          const text = el.textContent.replace(/\s+/g, ' ').trim();
          if (!text || text.length < 3) return;

          const tag = el.tagName.toLowerCase();
          if (tag === 'h1' || tag === 'h2') {
            blocks.push({ type: 'heading2', text });
          } else if (tag === 'h3' || tag === 'h4') {
            blocks.push({ type: 'heading3', text });
          } else if (tag === 'li') {
            blocks.push({ type: 'list_item', text });
          } else if (tag === 'blockquote') {
            blocks.push({ type: 'quote', text });
          } else if (tag === 'pre') {
            blocks.push({ type: 'code', text });
          } else {
            blocks.push({ type: 'paragraph', text });
          }
          totalWords += text.split(/\s+/).length;
        });

        // If querySelectorAll found few elements, fallback to direct text blocks
        if (blocks.length === 0) {
          const rawText = contentRoot.textContent.split('\n');
          rawText.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.length > 20) {
              blocks.push({ type: 'paragraph', text: trimmed });
              totalWords += trimmed.split(/\s+/).length;
            }
          });
        }

        if (blocks.length === 0) {
          throw new Error("Aucun contenu textuel n'a pu être extrait de cette page.");
        }

        // Generate complete multi-page PDF with PDF-Lib
        generateBtn.textContent = 'Mise en page multi-pages A4...';
        const PDFLib = await this.ensurePdfLib();
        const pdfDoc = await PDFLib.PDFDocument.create();

        const fontRegular = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const fontItalic = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique);

        const width = 595.28;  // A4
        const height = 841.89; // A4
        const left = 50;
        const right = 50;
        const contentWidth = width - left - right;
        const topMargin = 55;
        const bottomMargin = 55;
        const contentTop = height - topMargin;

        const pages = [];
        let currentPage = null;
        let currentY = contentTop;

        let domainName = 'Web';
        try { domainName = new URL(url).hostname; } catch (e) {}

        const headerSnippet = sanitizeForWinAnsi(title.slice(0, 55) + (title.length > 55 ? '...' : ''));

        const addNewPage = () => {
          currentPage = pdfDoc.addPage([width, height]);
          pages.push(currentPage);
          currentY = contentTop;

          // Running header on page 2 and beyond
          if (pages.length > 1) {
            currentPage.drawText(`${domainName} • ${headerSnippet}`, {
              x: left,
              y: height - 35,
              size: 8,
              font: fontItalic,
              color: PDFLib.rgb(0.45, 0.48, 0.52)
            });
            currentPage.drawLine({
              start: { x: left, y: height - 42 },
              end: { x: width - right, y: height - 42 },
              thickness: 0.5,
              color: PDFLib.rgb(0.85, 0.87, 0.9)
            });
          }
        };

        // Create first page
        addNewPage();

        // --- Document Header on Page 1 ---
        currentPage.drawText(sanitizeForWinAnsi(domainName.toUpperCase()), {
          x: left,
          y: currentY,
          size: 9,
          font: fontBold,
          color: PDFLib.rgb(0.2, 0.45, 0.85)
        });
        currentY -= 20;

        // Title
        const titleLines = wrapText(sanitizeForWinAnsi(title), fontBold, 18, contentWidth);
        for (const tl of titleLines) {
          currentPage.drawText(tl, {
            x: left,
            y: currentY,
            size: 18,
            font: fontBold,
            color: PDFLib.rgb(0.08, 0.1, 0.15)
          });
          currentY -= 24;
        }
        currentY -= 4;

        // Source URL and Date
        const dateStr = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        currentPage.drawText(sanitizeForWinAnsi(`Archivé le ${dateStr} • Source : ${url.slice(0, 85)}`), {
          x: left,
          y: currentY,
          size: 8.5,
          font: fontRegular,
          color: PDFLib.rgb(0.4, 0.45, 0.52)
        });
        currentY -= 14;

        // Header separator rule
        currentPage.drawLine({
          start: { x: left, y: currentY },
          end: { x: width - right, y: currentY },
          thickness: 1,
          color: PDFLib.rgb(0.85, 0.87, 0.9)
        });
        currentY -= 22;

        // --- Stream All Content Blocks Without Omission ---
        for (const block of blocks) {
          const cleanText = sanitizeForWinAnsi(block.text);

          if (block.type === 'heading2') {
            const hLines = wrapText(cleanText, fontBold, 13, contentWidth);
            const neededH = hLines.length * 18 + 22;
            if (currentY - neededH < bottomMargin) {
              addNewPage();
            } else {
              currentY -= 12;
            }
            for (const hl of hLines) {
              currentPage.drawText(hl, {
                x: left,
                y: currentY,
                size: 13,
                font: fontBold,
                color: PDFLib.rgb(0.1, 0.14, 0.22)
              });
              currentY -= 18;
            }
            currentY -= 6;
          } else if (block.type === 'heading3') {
            const hLines = wrapText(cleanText, fontBold, 11, contentWidth);
            const neededH = hLines.length * 16 + 16;
            if (currentY - neededH < bottomMargin) {
              addNewPage();
            } else {
              currentY -= 8;
            }
            for (const hl of hLines) {
              currentPage.drawText(hl, {
                x: left,
                y: currentY,
                size: 11,
                font: fontBold,
                color: PDFLib.rgb(0.15, 0.2, 0.3)
              });
              currentY -= 16;
            }
            currentY -= 4;
          } else if (block.type === 'list_item') {
            const itemLines = wrapText(cleanText, fontRegular, 9.5, contentWidth - 16);
            for (let li = 0; li < itemLines.length; li++) {
              if (currentY - 14 < bottomMargin) addNewPage();
              if (li === 0) {
                currentPage.drawText('•', {
                  x: left + 2,
                  y: currentY,
                  size: 10,
                  font: fontBold,
                  color: PDFLib.rgb(0.2, 0.45, 0.85)
                });
              }
              currentPage.drawText(itemLines[li], {
                x: left + 14,
                y: currentY,
                size: 9.5,
                font: fontRegular,
                color: PDFLib.rgb(0.18, 0.2, 0.24)
              });
              currentY -= 14;
            }
            currentY -= 3;
          } else if (block.type === 'quote') {
            const qLines = wrapText(cleanText, fontItalic, 9.5, contentWidth - 25);
            const startQuoteY = currentY;
            for (const ql of qLines) {
              if (currentY - 15 < bottomMargin) addNewPage();
              currentPage.drawText(ql, {
                x: left + 18,
                y: currentY,
                size: 9.5,
                font: fontItalic,
                color: PDFLib.rgb(0.3, 0.33, 0.38)
              });
              currentY -= 15;
            }
            // Draw left quote border
            currentPage.drawLine({
              start: { x: left + 8, y: startQuoteY + 4 },
              end: { x: left + 8, y: currentY + 8 },
              thickness: 2,
              color: PDFLib.rgb(0.2, 0.45, 0.85)
            });
            currentY -= 6;
          } else {
            // Standard Paragraph
            const pLines = wrapText(cleanText, fontRegular, 9.5, contentWidth);
            for (const pl of pLines) {
              if (currentY - 14.5 < bottomMargin) addNewPage();
              currentPage.drawText(pl, {
                x: left,
                y: currentY,
                size: 9.5,
                font: fontRegular,
                color: PDFLib.rgb(0.15, 0.18, 0.22)
              });
              currentY -= 14.5;
            }
            currentY -= 7;
          }
        }

        // --- Bottom Footers Across All Pages ---
        for (let p = 0; p < pages.length; p++) {
          const pg = pages[p];
          pg.drawLine({
            start: { x: left, y: 46 },
            end: { x: width - right, y: 46 },
            thickness: 0.5,
            color: PDFLib.rgb(0.85, 0.87, 0.9)
          });

          // Footer Text: Page X sur Y (Centered)
          const footerCenter = `Page ${p + 1} sur ${pages.length}`;
          const fcWidth = fontRegular.widthOfTextAtSize(footerCenter, 8);
          pg.drawText(footerCenter, {
            x: (width - fcWidth) / 2,
            y: 33,
            size: 8,
            font: fontRegular,
            color: PDFLib.rgb(0.48, 0.5, 0.55)
          });

          // Footer Left: ToolSuite • Archivage Web
          pg.drawText('ToolSuite • Archivage Web', {
            x: left,
            y: 33,
            size: 8,
            font: fontRegular,
            color: PDFLib.rgb(0.48, 0.5, 0.55)
          });
        }

        const pdfBytes = await pdfDoc.save();
        const safeFilename = (title.slice(0, 35).replace(/[^a-zA-Z0-9_-]/g, '_') || 'article') + `_${Date.now()}.pdf`;
        UI.download(pdfBytes, safeFilename, 'application/pdf');

        // Display results in UI status card
        if (statusCard) {
          statusCard.style.display = 'block';
          if (statusTitle) statusTitle.textContent = title;
          if (statusBadge) statusBadge.textContent = `PDF généré (${pages.length} page${pages.length > 1 ? 's' : ''})`;
          if (statusStats) {
            statusStats.innerHTML = `
              <span><strong>Mots extraits :</strong> ${totalWords.toLocaleString('fr-FR')}</span>
              <span><strong>Paragraphes :</strong> ${blocks.length}</span>
              <span><strong>Pages A4 :</strong> ${pages.length}</span>
              <span><strong>Poids du PDF :</strong> ${(pdfBytes.length / 1024).toFixed(1)} Ko</span>
            `;
          }
        }

        UI.toast(`Document PDF généré avec succès (${pages.length} pages, ${totalWords} mots extraits) !`, 'success', 6000);
      } catch (err) {
        console.error(err);
        UI.toast(`Erreur lors de la conversion : ${err.message}`, 'error', 7000);
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
