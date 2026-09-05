/**
 * @file dev-tools.js
 * @description Suite d'outils essentiels pour les développeurs logiciels 100% exécutés côté client (Vanilla JS).
 * Comprend un formateur/validateur JSON avec vue arborescente colorisée et minification,
 * un banc d'essai d'expressions régulières (Regex Tester) avec surlignage dynamique et extraction des groupes de capture,
 * un générateur d'ombres portées CSS et de styles neumorphiques (flat, concave, convex, pressed),
 * ainsi qu'un convertisseur bidirectionnel Base64 UTF-8 sécurisé pour textes et fichiers binaires (Data URLs).
 * @module DevTools
 */

/**
 * Espace de nom principal regroupant les outils destinés aux développeurs web et logiciels.
 * @namespace DevTools
 */
const DevTools = {
  /**
   * Initialise les quatre sous-modules d'ingénierie au démarrage.
   * @function init
   * @memberof DevTools
   * @returns {void}
   */
  init() {
    this.initJsonFormatter();
    this.initRegexTester();
    this.initShadowGenerator();
    this.initBase64Tool();
  },

  /* ================= 1. FORMATEUR & VALIDATEUR JSON ================= */
  /**
   * Initialise le formateur, validateur syntaxique et minificateur de documents JSON.
   * Propose une indentation configurable (2 espaces, 4 espaces ou compacte minifiée),
   * la génération d'un arbre syntaxique HTML enrichi en styles CSS, et le téléchargement du résultat.
   * @function initJsonFormatter
   * @memberof DevTools
   * @returns {void}
   */
  initJsonFormatter() {
    const input = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('json-input-textarea'));
    const status = document.getElementById('json-status-badge');
    const treeView = document.getElementById('json-tree-view');

    /** @type {Record<string, any>} Modèle d'exemple injecté par défaut */
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

    /**
     * Valide la syntaxe JSON du champ de saisie et met à jour l'arbre syntaxique ou le message d'erreur.
     * @inner
     * @param {number} [indentSpaces=2] - Nombre d'espaces d'indentation (0 pour minifier).
     */
    const validateAndFormat = (indentSpaces = 2) => {
      if (!input || !status || !treeView) return;
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

        // Rendu de l'arborescence syntaxique colorisée
        treeView.innerHTML = this.colorizeJson(parsed);
      } catch (err) {
        const msg = /** @type {Error} */ (err).message;
        status.textContent = `✕ Erreur : ${msg}`;
        status.style.color = 'var(--accent-rose)';
        treeView.innerHTML = `<div style="color: var(--accent-rose); padding: 1rem;">Erreur de syntaxe JSON : ${msg}</div>`;
      }
    };

    document.getElementById('json-format-2-btn')?.addEventListener('click', () => validateAndFormat(2));
    document.getElementById('json-format-4-btn')?.addEventListener('click', () => validateAndFormat(4));
    document.getElementById('json-minify-btn')?.addEventListener('click', () => validateAndFormat(0));

    document.getElementById('json-copy-btn')?.addEventListener('click', (e) => {
      if (input) {
        UI.copy(input.value, /** @type {HTMLElement} */ (e.currentTarget), 'JSON copié !');
      }
    });

    document.getElementById('json-download-btn')?.addEventListener('click', () => {
      if (!input || !input.value) return;
      UI.download(input.value, 'donnees_formatees.json', 'application/json');
      UI.toast('Fichier JSON téléchargé !', 'success');
    });

    input?.addEventListener('input', () => validateAndFormat(2));
    if (input) validateAndFormat(2);
  },

  /**
   * Produit récursivement le code HTML colorisé correspondant aux types de données JSON
   * (clés, chaînes, nombres, booléens, valeurs nulles, tableaux et objets).
   * @function colorizeJson
   * @memberof DevTools
   * @param {any} obj - Objet ou valeur primitive JSON à représenter.
   * @param {number} [indent=0] - Niveau d'indentation hiérarchique actuel.
   * @returns {string} Fragment HTML balisé avec les classes CSS de coloration.
   */
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
  /**
   * Initialise le banc d'évaluation d'expressions régulières en temps réel.
   * Analyse le motif Regex et les drapeaux (g = global, i = insensible à la casse, m = multiligne, s = dotAll),
   * synchronise le calque de surlignage avec le défilement de la zone de texte, et dresse le tableau des groupes de capture.
   * @function initRegexTester
   * @memberof DevTools
   * @returns {void}
   */
  initRegexTester() {
    const patternInput = /** @type {HTMLInputElement|null} */ (document.getElementById('regex-pattern-input'));
    const flagG = /** @type {HTMLInputElement|null} */ (document.getElementById('regex-flag-g'));
    const flagI = /** @type {HTMLInputElement|null} */ (document.getElementById('regex-flag-i'));
    const flagM = /** @type {HTMLInputElement|null} */ (document.getElementById('regex-flag-m'));
    const flagS = /** @type {HTMLInputElement|null} */ (document.getElementById('regex-flag-s'));
    const testText = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('regex-test-text'));
    const backdrop = document.getElementById('regex-backdrop');
    const matchCountBadge = document.getElementById('regex-match-count');
    const groupsContainer = document.getElementById('regex-groups-container');

    /**
     * Compile l'expression régulière, exécute la recherche et met à jour le surlignage DOM.
     * @inner
     */
    const updateRegex = () => {
      if (!patternInput || !testText || !backdrop || !matchCountBadge || !groupsContainer) return;

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
        /** @type {RegExpExecArray[]} */
        const matchesList = [];

        if (flags.includes('g')) {
          let match;
          while ((match = regex.exec(text)) !== null) {
            if (match.index === regex.lastIndex) regex.lastIndex++; // Prévention de boucle infinie sur motif vide
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

        // Construction du tableau récapitulatif des groupes capturés
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
        groupsContainer.innerHTML = `<div style="color: var(--accent-rose); font-size: 0.85rem;">${/** @type {Error} */ (err).message}</div>`;
      }
    };

    [patternInput, testText].forEach(el => el?.addEventListener('input', updateRegex));
    [flagG, flagI, flagM, flagS].forEach(el => el?.addEventListener('change', updateRegex));

    // Synchronisation du défilement entre le textarea transparent et le calque de surlignage
    testText?.addEventListener('scroll', () => {
      backdrop.scrollTop = testText.scrollTop;
      backdrop.scrollLeft = testText.scrollLeft;
    });

    updateRegex();
  },

  /* ================= 3. GÉNÉRATEUR D'OMBRES & NEUMORPHISME ================= */
  /**
   * Initialise le générateur visuel d'ombres portées CSS (box-shadow) et de presets neumorphiques.
   * Gère les curseurs de déplacement horizontal (X), vertical (Y), flou (blur), étalement (spread), opacité et incrustation (inset).
   * Fournit des préréglages neumorphiques pour interfaces modernes (effet plat, concave, convexe et pressé).
   * @function initShadowGenerator
   * @memberof DevTools
   * @returns {void}
   */
  initShadowGenerator() {
    const box = document.getElementById('shadow-preview-box');
    const codeEl = document.getElementById('shadow-css-code');
    const copyBtn = document.getElementById('shadow-copy-btn');

    // Curseurs de configuration d'ombre standard
    const xSlider = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-x-slider'));
    const ySlider = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-y-slider'));
    const blurSlider = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-blur-slider'));
    const spreadSlider = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-spread-slider'));
    const opacitySlider = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-opacity-slider'));
    const colorPicker = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-color-picker'));
    const insetCheck = /** @type {HTMLInputElement|null} */ (document.getElementById('shadow-inset-check'));

    // Boutons de préréglages neumorphiques
    const neumorphModes = document.querySelectorAll('.neumorph-btn');

    /**
     * Convertit une couleur hexadécimale et une opacité décimale en chaîne CSS 'rgba(r, g, b, a)'.
     * @inner
     * @param {string} hex - Code hexadécimal '#RRGGBB'.
     * @param {number} alpha - Taux d'opacité entre 0 et 1.
     * @returns {string} Chaîne fonctionnelle CSS rgba.
     */
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    /**
     * Met à jour les styles CSS de l'élément témoin et actualise le bloc de code copiable.
     * @inner
     */
    const updateShadow = () => {
      if (!box || !codeEl || !xSlider || !ySlider || !blurSlider || !spreadSlider || !opacitySlider || !colorPicker || !insetCheck) return;

      const x = xSlider.value;
      const y = ySlider.value;
      const blur = blurSlider.value;
      const spread = spreadSlider.value;
      const opacity = parseFloat(opacitySlider.value) / 100;
      const colorHex = colorPicker.value;
      const rgba = hexToRgba(colorHex, opacity);
      const isInset = insetCheck.checked ? 'inset ' : '';

      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setT('shadow-x-val', `${x}px`);
      setT('shadow-y-val', `${y}px`);
      setT('shadow-blur-val', `${blur}px`);
      setT('shadow-spread-val', `${spread}px`);
      setT('shadow-opacity-val', `${Math.round(opacity * 100)}%`);

      const shadowCss = `${isInset}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
      box.style.boxShadow = shadowCss;
      box.style.background = '#1e293b';

      codeEl.textContent = `box-shadow: ${shadowCss};\n-webkit-box-shadow: ${shadowCss};`;
    };

    [xSlider, ySlider, blurSlider, spreadSlider, opacitySlider, colorPicker, insetCheck].forEach(el => {
      el?.addEventListener('input', updateShadow);
    });

    // Préréglages neumorphiques interactifs
    neumorphModes.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!box || !codeEl) return;
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
        if (codeEl) UI.copy(codeEl.textContent || '', copyBtn, 'Code CSS copié !');
      });
    }

    updateShadow();
  },

  /* ================= 4. ENCODEUR / DÉCODEUR BASE64 ================= */
  /**
   * Initialise le module d'encodage et décodage Base64.
   * Utilise TextEncoder / TextDecoder pour garantir la prise en charge intégrale des caractères UTF-8 (accents, émojis),
   * et gère la conversion de fichiers physiques en Data URLs base64 via FileReader avec prévisualisation pour images.
   * @function initBase64Tool
   * @memberof DevTools
   * @returns {void}
   */
  initBase64Tool() {
    const textInput = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('b64-text-input'));
    const textOutput = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('b64-text-output'));
    const encodeTextBtn = document.getElementById('b64-encode-text-btn');
    const decodeTextBtn = document.getElementById('b64-decode-text-btn');
    const copyTextBtn = document.getElementById('b64-copy-text-btn');

    /**
     * Encode une chaîne de caractères Unicode en Base64 de manière sécurisée via TextEncoder.
     * @inner
     * @param {string} str - Chaîne UTF-8 source.
     * @returns {string} Chaîne binaire encodée en Base64.
     */
    const utf8ToBase64 = (str) => {
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString);
    };

    /**
     * Décode une chaîne Base64 vers son texte d'origine UTF-8 via TextDecoder.
     * @inner
     * @param {string} base64 - Données encodées en Base64.
     * @returns {string} Texte décodé en UTF-8.
     */
    const base64ToUtf8 = (base64) => {
      const binString = atob(base64);
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    };

    if (encodeTextBtn && textInput && textOutput) {
      encodeTextBtn.addEventListener('click', () => {
        try {
          textOutput.value = utf8ToBase64(textInput.value);
          UI.toast('Texte encodé en Base64 !', 'success');
        } catch (err) {
          UI.toast(`Erreur d'encodage : ${/** @type {Error} */ (err).message}`, 'error');
        }
      });
    }

    if (decodeTextBtn && textInput && textOutput) {
      decodeTextBtn.addEventListener('click', () => {
        try {
          textOutput.value = base64ToUtf8(textInput.value.trim());
          UI.toast('Base64 décodé avec succès !', 'success');
        } catch (err) {
          UI.toast(`Base64 invalide : ${/** @type {Error} */ (err).message}`, 'error');
        }
      });
    }

    if (copyTextBtn && textOutput) {
      copyTextBtn.addEventListener('click', () => {
        if (!textOutput.value) return;
        UI.copy(textOutput.value, copyTextBtn, 'Résultat Base64 copié !');
      });
    }

    // Conversion de fichiers locaux en Data URLs Base64
    UI.setupDropzone('b64-file-dropzone', 'b64-file-input', (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = /** @type {string} */ (e.target?.result);
        const outEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('b64-file-output'));
        const infoEl = document.getElementById('b64-file-info');
        const resultGroup = document.getElementById('b64-file-result-group');

        if (outEl) outEl.value = dataUrl;
        if (infoEl) infoEl.textContent = `${file.name} (${UI.formatBytes(file.size)}) → ${UI.formatBytes(dataUrl.length)} en Base64`;
        if (resultGroup) resultGroup.style.display = 'block';

        if (file.type.startsWith('image/')) {
          const imgPrev = /** @type {HTMLImageElement|null} */ (document.getElementById('b64-img-preview'));
          if (imgPrev) {
            imgPrev.src = dataUrl;
            imgPrev.style.display = 'block';
          }
        }
        UI.toast('Fichier converti en Base64 Data URL !', 'success');
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('b64-file-copy-btn')?.addEventListener('click', (e) => {
      const out = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('b64-file-output'));
      if (out) {
        UI.copy(out.value, /** @type {HTMLElement} */ (e.currentTarget), 'Data URL copié !');
      }
    });
  }
};

/**
 * Échappe les caractères réservés HTML pour prémunir les injections XSS lors de l'injection dynamique dans le DOM.
 * @function escapeHtml
 * @param {any} str - Valeur à sécuriser.
 * @returns {string} Chaîne sécurisée avec entités HTML standard (&amp;, &lt;, &gt;, &quot;, &#039;).
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.DevTools = DevTools;
