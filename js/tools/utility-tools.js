/**
 * Utility Tools - QR Codes Dynamiques, Mots de Passe & Palette de Couleurs
 * 100% Client-side Vanilla JS
 */

const UtilityTools = {
  init() {
    this.initQrCode();
    this.initPasswordGenerator();
    this.initPaletteExtractor();
  },

  /* ================= 1. GÉNÉRATEUR DE QR CODES DYNAMIQUES ================= */
  initQrCode() {
    const qrTypeSelect = document.getElementById('qr-type-select');
    const qrContainer = document.getElementById('qr-code-canvas-box');
    const fgColorInput = document.getElementById('qr-fg-color');
    const bgColorInput = document.getElementById('qr-bg-color');
    const downloadPngBtn = document.getElementById('qr-download-png-btn');
    const downloadSvgBtn = document.getElementById('qr-download-svg-btn');

    let currentQrInstance = null;

    const getPayload = () => {
      const type = qrTypeSelect.value;
      if (type === 'url') {
        return document.getElementById('qr-url-input').value.trim() || 'https://example.com';
      } else if (type === 'wifi') {
        const ssid = document.getElementById('qr-wifi-ssid').value.trim() || 'MonWifi';
        const pass = document.getElementById('qr-wifi-pass').value;
        const enc = document.getElementById('qr-wifi-enc').value;
        const hidden = document.getElementById('qr-wifi-hidden')?.checked ? 'H:true;' : '';
        return `WIFI:S:${ssid};T:${enc};P:${pass};${hidden};`;
      } else if (type === 'vcard') {
        const fn = document.getElementById('qr-vcard-fn').value.trim() || 'Jean Dupont';
        const tel = document.getElementById('qr-vcard-tel').value.trim();
        const email = document.getElementById('qr-vcard-email').value.trim();
        const org = document.getElementById('qr-vcard-org').value.trim();
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${fn}\nTEL:${tel}\nEMAIL:${email}\nORG:${org}\nEND:VCARD`;
      } else if (type === 'text') {
        return document.getElementById('qr-text-input').value.trim() || 'Message texte';
      } else if (type === 'menu') {
        return document.getElementById('qr-menu-url').value.trim() || 'https://mon-restaurant.com/menu';
      }
      return 'https://example.com';
    };

    const renderQr = () => {
      if (!qrContainer) return;
      const text = getPayload();
      const fg = fgColorInput.value;
      const bg = bgColorInput.value;

      qrContainer.innerHTML = '';

      if (typeof QRCode !== 'undefined') {
        currentQrInstance = new QRCode(qrContainer, {
          text: text,
          width: 240,
          height: 240,
          colorDark: fg,
          colorLight: bg,
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        // Fallback using public high-res QR service image or canvas
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
      document.querySelectorAll('.qr-type-fields').forEach(el => el.style.display = 'none');
      const activeFieldGroup = document.getElementById(`qr-fields-${type}`);
      if (activeFieldGroup) activeFieldGroup.style.display = 'block';
      renderQr();
    });

    [fgColorInput, bgColorInput].forEach(el => el?.addEventListener('input', renderQr));

    // Listen to all text inputs in QR form
    document.querySelectorAll('.qr-field-input').forEach(input => {
      input.addEventListener('input', renderQr);
    });

    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => {
        const canvas = qrContainer.querySelector('canvas');
        if (canvas) {
          canvas.toBlob(blob => {
            UI.download(blob, 'qrcode.png', 'image/png');
            UI.toast('QR Code PNG téléchargé !', 'success');
          });
        } else {
          const img = qrContainer.querySelector('img');
          if (img) {
            window.open(img.src, '_blank');
          }
        }
      });
    }

    if (downloadSvgBtn) {
      downloadSvgBtn.addEventListener('click', () => {
        const text = getPayload();
        // Fallback SVG representation
        const canvas = qrContainer.querySelector('canvas');
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
  initPasswordGenerator() {
    const passOutput = document.getElementById('pass-output');
    const lengthSlider = document.getElementById('pass-length-slider');
    const lengthVal = document.getElementById('pass-length-val');
    const upperCheck = document.getElementById('pass-upper-check');
    const lowerCheck = document.getElementById('pass-lower-check');
    const numbersCheck = document.getElementById('pass-numbers-check');
    const symbolsCheck = document.getElementById('pass-symbols-check');
    const noAmbiguousCheck = document.getElementById('pass-no-ambiguous-check');
    const generateBtn = document.getElementById('pass-generate-btn');
    const copyBtn = document.getElementById('pass-copy-btn');
    const meterFill = document.getElementById('pass-entropy-meter');
    const meterLabel = document.getElementById('pass-entropy-label');

    const generatePassword = () => {
      const length = parseInt(lengthSlider.value, 10);
      let chars = '';
      if (upperCheck.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowerCheck.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (numbersCheck.checked) chars += '0123456789';
      if (symbolsCheck.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (noAmbiguousCheck.checked) {
        // Exclude l, 1, I, o, 0, O
        chars = chars.replace(/[l1Io0O]/g, '');
      }

      if (!chars) {
        passOutput.value = '';
        meterLabel.textContent = 'Sélectionnez au moins une option';
        meterFill.style.width = '0%';
        return;
      }

      // Cryptographically secure random selection
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
      }

      passOutput.value = password;

      // Entropy calculation: E = length * log2(poolSize)
      const poolSize = chars.length;
      const entropy = Math.round(length * Math.log2(poolSize));

      let widthPct = Math.min(100, Math.round((entropy / 128) * 100));
      meterFill.style.width = `${widthPct}%`;

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
    };

    lengthSlider?.addEventListener('input', () => {
      lengthVal.textContent = lengthSlider.value;
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
  currentPalette: [],

  initPaletteExtractor() {
    UI.setupDropzone('palette-dropzone', 'palette-input', (file) => {
      if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const preview = document.getElementById('palette-img-preview');
            if (preview) preview.src = e.target.result;
            const workspace = document.getElementById('palette-workspace');
            if (workspace) workspace.style.display = 'block';
            this.extractDominantColors(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        UI.toast('Veuillez déposer une image valide (PNG, JPG, WebP...).', 'warning');
      }
    });

    // Sample image test button
    const sampleBtn = document.getElementById('palette-sample-btn');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.generateSamplePaletteImage();
      });
    }

    // Eyedropper pipette tool
    const eyedropperBtn = document.getElementById('palette-eyedropper-btn');
    if (eyedropperBtn) {
      if ('EyeDropper' in window) {
        eyedropperBtn.addEventListener('click', async () => {
          try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result && result.sRGBHex) {
              const hex = result.sRGBHex.toUpperCase();
              UI.copy(hex, null, `Couleur pipetée : ${hex}`);
              // Add to current palette
              this.currentPalette.unshift({
                hex: hex,
                rgb: this.hexToRgbString(hex)
              });
              this.renderPaletteGrid(this.currentPalette);
            }
          } catch (e) {
            console.log('Eyedropper cancelled or failed', e);
          }
        });
      } else {
        eyedropperBtn.style.display = 'none';
      }
    }

    // Copy all HEX
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

    // Copy CSS Variables
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

    // Copy JSON
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

  hexToRgbString(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  },

  generateSamplePaletteImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Create a sunset gradient
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
      const preview = document.getElementById('palette-img-preview');
      if (preview) preview.src = dataUrl;
      const workspace = document.getElementById('palette-workspace');
      if (workspace) workspace.style.display = 'block';
      this.extractDominantColors(img);
    };
    img.src = dataUrl;
  },

  extractDominantColors(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Downscale for fast quantization
    const sampleWidth = 100;
    const sampleHeight = Math.max(10, Math.round((img.naturalHeight || img.height) * sampleWidth / (img.naturalWidth || img.width)));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    const colorBuckets = {};

    // Group colors into quantized buckets
    for (let i = 0; i < imgData.length; i += 16) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      if (a < 128) continue; // skip transparent

      // Quantize to 24 steps
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
    const palette = [];

    const rgbToHex = (r, g, b) => {
      const toH = (n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
      return `#${toH(r)}${toH(g)}${toH(b)}`.toUpperCase();
    };

    const colorDistance = (c1, c2) => {
      return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
      );
    };

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

  renderPaletteGrid(palette) {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    palette.forEach((color, idx) => {
      const card = document.createElement('div');
      card.className = 'color-swatch-card';
      card.title = `Cliquez pour copier ${color.hex}`;

      // Calculate perceived brightness for contrasting text
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
