/**
 * DevTools - Formateur JSON, Testeur Regex, Ombres CSS & Encodeur Base64
 * 100% Vanilla JS, Local, Fast
 */

const DevTools = {
  init() {
    this.initJsonFormatter();
    this.initRegexTester();
    this.initShadowGenerator();
    this.initBase64Tool();
  },

  /* ================= 1. FORMATEUR & VALIDATEUR JSON ================= */
  initJsonFormatter() {
    const input = document.getElementById('json-input-textarea');
    const status = document.getElementById('json-status-badge');
    const treeView = document.getElementById('json-tree-view');

    const sampleJson = {
      app: "ToolSuite",
      version: "1.0.0",
      active: true,
      features: ["PDF", "Images", "OCR", "DevTools"],
      metrics: {
        toolsCount: 15,
        clientSide: true,
        performanceScore: 99.8
      }
    };

    if (input && !input.value.trim()) {
      input.value = JSON.stringify(sampleJson, null, 2);
    }

    const validateAndFormat = (indentSpaces = 2) => {
      const raw = input.value.trim();
      if (!raw) {
        status.textContent = 'En attente de saisie';
        status.style.color = 'var(--text-muted)';
        treeView.innerHTML = '';
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        status.textContent = '✓ JSON Valide';
        status.style.color = 'var(--accent-emerald)';

        const formatted = indentSpaces === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentSpaces);
        input.value = formatted;

        // Render colorized syntax tree
        treeView.innerHTML = this.colorizeJson(parsed);
      } catch (err) {
        status.textContent = `✕ Erreur : ${err.message}`;
        status.style.color = 'var(--accent-rose)';
        treeView.innerHTML = `<div style="color: var(--accent-rose); padding: 1rem;">Erreur de syntaxe JSON : ${err.message}</div>`;
      }
    };

    document.getElementById('json-format-2-btn')?.addEventListener('click', () => validateAndFormat(2));
    document.getElementById('json-format-4-btn')?.addEventListener('click', () => validateAndFormat(4));
    document.getElementById('json-minify-btn')?.addEventListener('click', () => validateAndFormat(0));

    document.getElementById('json-copy-btn')?.addEventListener('click', (e) => {
      UI.copy(input.value, e.currentTarget, 'JSON copié !');
    });

    document.getElementById('json-download-btn')?.addEventListener('click', () => {
      if (!input.value) return;
      UI.download(input.value, 'donnees_formatees.json', 'application/json');
      UI.toast('Fichier JSON téléchargé !', 'success');
    });

    input?.addEventListener('input', () => validateAndFormat(2));
    if (input) validateAndFormat(2);
  },

  colorizeJson(obj, indent = 0) {
    const spaces = '&nbsp;'.repeat(indent * 2);
    if (obj === null) return `<span class="json-null">null</span>`;
    if (typeof obj === 'boolean') return `<span class="json-boolean">${obj}</span>`;
    if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
    if (typeof obj === 'string') return `<span class="json-string">"${escapeHtml(obj)}"</span>`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      let html = '[\n';
      obj.forEach((item, idx) => {
        html += `${spaces}&nbsp;&nbsp;${this.colorizeJson(item, indent + 1)}${idx < obj.length - 1 ? ',' : ''}\n`;
      });
      html += `${spaces}]`;
      return html;
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      let html = '{\n';
      keys.forEach((key, idx) => {
        html += `${spaces}&nbsp;&nbsp;<span class="json-key">"${escapeHtml(key)}"</span>: ${this.colorizeJson(obj[key], indent + 1)}${idx < keys.length - 1 ? ',' : ''}\n`;
      });
      html += `${spaces}}`;
      return html;
    }

    return String(obj);
  },

  /* ================= 2. TESTEUR REGEX ================= */
  initRegexTester() {
    const patternInput = document.getElementById('regex-pattern-input');
    const flagG = document.getElementById('regex-flag-g');
    const flagI = document.getElementById('regex-flag-i');
    const flagM = document.getElementById('regex-flag-m');
    const flagS = document.getElementById('regex-flag-s');
    const testText = document.getElementById('regex-test-text');
    const backdrop = document.getElementById('regex-backdrop');
    const matchCountBadge = document.getElementById('regex-match-count');
    const groupsContainer = document.getElementById('regex-groups-container');

    const updateRegex = () => {
      if (!patternInput || !testText) return;

      const patternStr = patternInput.value;
      const text = testText.value;

      let flags = '';
      if (flagG?.checked) flags += 'g';
      if (flagI?.checked) flags += 'i';
      if (flagM?.checked) flags += 'm';
      if (flagS?.checked) flags += 's';

      if (!patternStr) {
        backdrop.innerHTML = escapeHtml(text);
        matchCountBadge.textContent = '0 correspondance';
        groupsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">Saisissez un pattern pour voir les correspondances.</div>';
        return;
      }

      try {
        const regex = new RegExp(patternStr, flags);
        patternInput.style.borderColor = 'var(--border-color)';

        let matchHtml = '';
        let lastIdx = 0;
        let matchCount = 0;
        const matchesList = [];

        if (flags.includes('g')) {
          let match;
          while ((match = regex.exec(text)) !== null) {
            if (match.index === regex.lastIndex) regex.lastIndex++; // prevent infinite loop on empty match
            matchCount++;
            matchesList.push(match);

            matchHtml += escapeHtml(text.substring(lastIdx, match.index));
            matchHtml += `<mark class="regex-match">${escapeHtml(match[0])}</mark>`;
            lastIdx = match.index + match[0].length;
          }
          matchHtml += escapeHtml(text.substring(lastIdx));
        } else {
          const match = regex.exec(text);
          if (match) {
            matchCount = 1;
            matchesList.push(match);
            matchHtml += escapeHtml(text.substring(0, match.index));
            matchHtml += `<mark class="regex-match">${escapeHtml(match[0])}</mark>`;
            matchHtml += escapeHtml(text.substring(match.index + match[0].length));
          } else {
            matchHtml = escapeHtml(text);
          }
        }

        backdrop.innerHTML = matchHtml;
        matchCountBadge.textContent = `${matchCount} correspondance(s)`;

        // Render captured groups
        if (matchesList.length > 0) {
          let tableHtml = `
            <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.8rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); text-align: left;">
                  <th style="padding: 6px;">#</th>
                  <th style="padding: 6px;">Match</th>
                  <th style="padding: 6px;">Index</th>
                  <th style="padding: 6px;">Groupes</th>
                </tr>
              </thead>
              <tbody>
          `;
          matchesList.slice(0, 15).forEach((m, idx) => {
            const groups = m.length > 1 ? m.slice(1).map((g, i) => `$${i + 1}: "${g}"`).join(', ') : 'Aucun';
            tableHtml += `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 6px; color: var(--text-muted);">${idx + 1}</td>
                <td style="padding: 6px; color: #fde047;">${escapeHtml(m[0])}</td>
                <td style="padding: 6px; color: var(--text-muted);">${m.index}</td>
                <td style="padding: 6px; color: #38bdf8;">${escapeHtml(groups)}</td>
              </tr>
            `;
          });
          tableHtml += `</tbody></table>`;
          groupsContainer.innerHTML = tableHtml;
        } else {
          groupsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">Aucune correspondance trouvée.</div>';
        }
      } catch (err) {
        patternInput.style.borderColor = 'var(--accent-rose)';
        matchCountBadge.textContent = 'Regex invalide';
        backdrop.innerHTML = escapeHtml(text);
        groupsContainer.innerHTML = `<div style="color: var(--accent-rose); font-size: 0.85rem;">${err.message}</div>`;
      }
    };

    [patternInput, testText].forEach(el => el?.addEventListener('input', updateRegex));
    [flagG, flagI, flagM, flagS].forEach(el => el?.addEventListener('change', updateRegex));

    // Synchronize scrolling of textarea and backdrop
    testText?.addEventListener('scroll', () => {
      backdrop.scrollTop = testText.scrollTop;
      backdrop.scrollLeft = testText.scrollLeft;
    });

    updateRegex();
  },

  /* ================= 3. GÉNÉRATEUR D'OMBRES & NEUMORPHISME ================= */
  initShadowGenerator() {
    const box = document.getElementById('shadow-preview-box');
    const codeEl = document.getElementById('shadow-css-code');
    const copyBtn = document.getElementById('shadow-copy-btn');

    // Box shadow controls
    const xSlider = document.getElementById('shadow-x-slider');
    const ySlider = document.getElementById('shadow-y-slider');
    const blurSlider = document.getElementById('shadow-blur-slider');
    const spreadSlider = document.getElementById('shadow-spread-slider');
    const opacitySlider = document.getElementById('shadow-opacity-slider');
    const colorPicker = document.getElementById('shadow-color-picker');
    const insetCheck = document.getElementById('shadow-inset-check');

    // Neumorphism presets
    const neumorphModes = document.querySelectorAll('.neumorph-btn');

    let currentMode = 'box'; // 'box' or 'neumorphism'

    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const updateShadow = () => {
      if (!box || !codeEl) return;

      const x = xSlider.value;
      const y = ySlider.value;
      const blur = blurSlider.value;
      const spread = spreadSlider.value;
      const opacity = opacitySlider.value / 100;
      const colorHex = colorPicker.value;
      const rgba = hexToRgba(colorHex, opacity);
      const isInset = insetCheck.checked ? 'inset ' : '';

      document.getElementById('shadow-x-val').textContent = `${x}px`;
      document.getElementById('shadow-y-val').textContent = `${y}px`;
      document.getElementById('shadow-blur-val').textContent = `${blur}px`;
      document.getElementById('shadow-spread-val').textContent = `${spread}px`;
      document.getElementById('shadow-opacity-val').textContent = `${Math.round(opacity * 100)}%`;

      const shadowCss = `${isInset}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
      box.style.boxShadow = shadowCss;
      box.style.background = '#1e293b';

      codeEl.textContent = `box-shadow: ${shadowCss};\n-webkit-box-shadow: ${shadowCss};`;
    };

    [xSlider, ySlider, blurSlider, spreadSlider, opacitySlider, colorPicker, insetCheck].forEach(el => {
      el?.addEventListener('input', updateShadow);
    });

    neumorphModes.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const bg = '#1e293b';
        const lightShadow = 'rgba(255, 255, 255, 0.05)';
        const darkShadow = 'rgba(0, 0, 0, 0.5)';

        let css = '';
        if (type === 'flat') {
          css = `10px 10px 20px ${darkShadow}, -10px -10px 20px ${lightShadow}`;
          box.style.background = bg;
        } else if (type === 'concave') {
          css = `10px 10px 20px ${darkShadow}, -10px -10px 20px ${lightShadow}`;
          box.style.background = `linear-gradient(145deg, #182130, #202c3f)`;
        } else if (type === 'convex') {
          css = `10px 10px 20px ${darkShadow}, -10px -10px 20px ${lightShadow}`;
          box.style.background = `linear-gradient(145deg, #202c3f, #182130)`;
        } else if (type === 'pressed') {
          css = `inset 8px 8px 16px ${darkShadow}, inset -8px -8px 16px ${lightShadow}`;
          box.style.background = bg;
        }

        box.style.boxShadow = css;
        codeEl.textContent = `background: ${box.style.background};\nbox-shadow: ${css};`;
        UI.toast(`Style Neumorphique "${type}" appliqué !`, 'info');
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        UI.copy(codeEl.textContent, copyBtn, 'Code CSS copié !');
      });
    }

    updateShadow();
  },

  /* ================= 4. ENCODEUR / DÉCODEUR BASE64 ================= */
  initBase64Tool() {
    const textInput = document.getElementById('b64-text-input');
    const textOutput = document.getElementById('b64-text-output');
    const encodeTextBtn = document.getElementById('b64-encode-text-btn');
    const decodeTextBtn = document.getElementById('b64-decode-text-btn');
    const copyTextBtn = document.getElementById('b64-copy-text-btn');

    // UTF-8 safe encode/decode
    const utf8ToBase64 = (str) => {
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString);
    };

    const base64ToUtf8 = (base64) => {
      const binString = atob(base64);
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };

    if (encodeTextBtn) {
      encodeTextBtn.addEventListener('click', () => {
        try {
          textOutput.value = utf8ToBase64(textInput.value);
          UI.toast('Texte encodé en Base64 !', 'success');
        } catch (err) {
          UI.toast(`Erreur d'encodage : ${err.message}`, 'error');
        }
      });
    }

    if (decodeTextBtn) {
      decodeTextBtn.addEventListener('click', () => {
        try {
          textOutput.value = base64ToUtf8(textInput.value.trim());
          UI.toast('Base64 décodé avec succès !', 'success');
        } catch (err) {
          UI.toast(`Base64 invalide : ${err.message}`, 'error');
        }
      });
    }

    if (copyTextBtn) {
      copyTextBtn.addEventListener('click', () => {
        if (!textOutput.value) return;
        UI.copy(textOutput.value, copyTextBtn, 'Résultat Base64 copié !');
      });
    }

    // File to Base64
    UI.setupDropzone('b64-file-dropzone', 'b64-file-input', (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        document.getElementById('b64-file-output').value = dataUrl;
        document.getElementById('b64-file-info').textContent = `${file.name} (${UI.formatBytes(file.size)}) → ${UI.formatBytes(dataUrl.length)} en Base64`;
        document.getElementById('b64-file-result-group').style.display = 'block';

        if (file.type.startsWith('image/')) {
          const imgPrev = document.getElementById('b64-img-preview');
          imgPrev.src = dataUrl;
          imgPrev.style.display = 'block';
        }
        UI.toast('Fichier converti en Base64 Data URL !', 'success');
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('b64-file-copy-btn')?.addEventListener('click', (e) => {
      const out = document.getElementById('b64-file-output');
      UI.copy(out.value, e.currentTarget, 'Data URL copié !');
    });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.DevTools = DevTools;
