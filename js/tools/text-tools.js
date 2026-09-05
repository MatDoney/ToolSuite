/**
 * @file text-tools.js
 * @description Suite d'outils d'analyse et de transformation textuelle 100% exécutés côté client (Vanilla JS).
 * Comprend un comparateur différentiel de texte ligne par ligne basé sur l'algorithme LCS (Longest Common Subsequence),
 * un compteur statistique de mots avec extraction de densité lexicale (mots-clés filtrés sans mots vides),
 * un convertisseur de casse multi-formats (9 formats standardisés : camelCase, PascalCase, snake_case, etc.),
 * et un nettoyeur typographique configurable (suppression HTML, espaces superflus, normalisation des guillemets).
 * @module TextTools
 */

/**
 * @typedef {Object} DiffEntry
 * @property {'same'|'add'|'del'} type - Nature de la ligne différentielle ('same' = inchangée, 'add' = ajoutée dans B, 'del' = supprimée de A).
 * @property {string} text - Contenu brut de la ligne de texte.
 * @property {number|string} lineA - Numéro de ligne dans le document d'origine A (ou chaîne vide si ajoutée).
 * @property {number|string} lineB - Numéro de ligne dans le document révisé B (ou chaîne vide si supprimée).
 */

/**
 * Espace de nom principal regroupant les utilitaires de traitement textuel.
 * @namespace TextTools
 */
const TextTools = {
  /**
   * Initialise l'ensemble des modules d'outils textuels au démarrage.
   * @function init
   * @memberof TextTools
   * @returns {void}
   */
  init() {
    this.initDiffTool();
    this.initWordCounter();
    this.initCaseConverter();
    this.initTextCleaner();
  },

  /* ================= 1. COMPARATEUR DE TEXTE (DIFF) ================= */
  /**
   * Initialise le comparateur visuel de différences textuelles (Diff Tool).
   * Implémente la programmation dynamique de la Plus Longue Sous-Séquence Commune (LCS)
   * pour produire une vue unifiée avec numérotation de lignes et coloration syntaxique des ajouts/suppressions.
   * @function initDiffTool
   * @memberof TextTools
   * @returns {void}
   */
  initDiffTool() {
    const inputA = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('diff-input-a'));
    const inputB = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('diff-input-b'));
    const compareBtn = document.getElementById('diff-compare-btn');
    const sampleBtn = document.getElementById('diff-sample-btn');
    const clearBtn = document.getElementById('diff-clear-btn');
    const output = document.getElementById('diff-output');
    const statsContainer = document.getElementById('diff-stats');

    if (!compareBtn || !output) return;

    /**
     * Construit la matrice de programmation dynamique pour l'algorithme LCS (Longest Common Subsequence).
     * @inner
     * @param {string[]} a - Tableau des lignes du document A.
     * @param {string[]} b - Tableau des lignes du document B.
     * @returns {Int32Array[]} Matrice 2D (m+1) x (n+1) contenant les longueurs des sous-séquences communes.
     */
    const computeLCS = (a, b) => {
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (a[i] === b[j]) {
            dp[i + 1][j + 1] = dp[i][j] + 1;
          } else {
            dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
          }
        }
      }
      return dp;
    };

    /**
     * Remonte la matrice LCS pour générer la liste séquentielle des lignes avec leur statut différentiel.
     * @inner
     * @param {string[]} a - Lignes du document original.
     * @param {string[]} b - Lignes du document comparé.
     * @returns {DiffEntry[]} Liste chronologique ordonnée des lignes avec métadonnées.
     */
    const buildDiff = (a, b) => {
      const dp = computeLCS(a, b);
      let i = a.length;
      let j = b.length;
      /** @type {DiffEntry[]} */
      const result = [];

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          result.push({ type: 'same', text: a[i - 1], lineA: i, lineB: j });
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          result.push({ type: 'add', text: b[j - 1], lineA: '', lineB: j });
          j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
          result.push({ type: 'del', text: a[i - 1], lineA: i, lineB: '' });
          i--;
        }
      }
      return result.reverse();
    };

    /**
     * Récupère les textes des deux volets, calcule les écarts et formate l'affichage HTML.
     * @inner
     */
    const runDiff = () => {
      if (!inputA || !inputB) return;
      const textA = inputA.value;
      const textB = inputB.value;

      if (!textA && !textB) {
        UI.toast('Veuillez entrer au moins un texte à comparer.', 'warning');
        return;
      }

      const linesA = textA.split('\n');
      const linesB = textB.split('\n');
      const diff = buildDiff(linesA, linesB);

      let addCount = 0;
      let delCount = 0;
      let sameCount = 0;

      let html = '<div class="diff-container">';
      diff.forEach(item => {
        let cls = 'diff-line-same';
        let prefix = ' ';
        if (item.type === 'add') {
          cls = 'diff-line-add';
          prefix = '+';
          addCount++;
        } else if (item.type === 'del') {
          cls = 'diff-line-del';
          prefix = '-';
          delCount++;
        } else {
          sameCount++;
        }

        /**
         * Échappe les caractères HTML dangereux pour prévenir les injections XSS.
         * @param {string} str - Chaîne brute.
         * @returns {string} Chaîne sécurisée avec entités HTML.
         */
        const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeText = escapeHtml(item.text) || '&nbsp;';

        html += `
          <div class="diff-line ${cls}">
            <span class="diff-line-num">${item.lineA || ''}</span>
            <span class="diff-line-num" style="border-right: 1px solid var(--border-color); padding-right: 8px;">${item.lineB || ''}</span>
            <span class="diff-line-prefix">${prefix}</span>
            <span class="diff-line-text">${safeText}</span>
          </div>
        `;
      });
      html += '</div>';

      output.innerHTML = html;

      if (statsContainer) {
        statsContainer.innerHTML = `
          <span class="diff-stats-badge" style="color: #22c55e;"><strong>+${addCount}</strong> ajouts</span>
          <span class="diff-stats-badge" style="color: #ef4444;"><strong>-${delCount}</strong> suppressions</span>
          <span class="diff-stats-badge" style="color: var(--text-muted);"><strong>${sameCount}</strong> identiques</span>
        `;
      }
    };

    compareBtn.addEventListener('click', runDiff);

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        if (!inputA || !inputB) return;
        inputA.value = `// Configuration v1.0\nconst appConfig = {\n  env: 'production',\n  apiUrl: 'https://api.v1.domain.com',\n  timeout: 5000,\n  retries: 3,\n  enableCache: false\n};`;
        inputB.value = `// Configuration v2.0 - Optimisée\nconst appConfig = {\n  env: 'production',\n  apiUrl: 'https://api.v2.domain.com',\n  timeout: 8000,\n  retries: 3,\n  enableCache: true,\n  compression: 'gzip'\n};`;
        runDiff();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (inputA) inputA.value = '';
        if (inputB) inputB.value = '';
        output.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">Les différences apparaîtront ici après comparaison.</div>';
        if (statsContainer) statsContainer.innerHTML = '';
      });
    }
  },

  /* ================= 2. COMPTEUR DE MOTS AVANCÉ ================= */
  /**
   * Initialise le compteur de mots, de caractères, de phrases et de paragraphes en temps réel.
   * Fournit une estimation du temps de lecture (200 mots/min) et de prise de parole (130 mots/min),
   * ainsi qu'un tableau de densité lexicale extrayant les mots-clés les plus fréquents après élimination des mots vides (stop-words).
   * @function initWordCounter
   * @memberof TextTools
   * @returns {void}
   */
  initWordCounter() {
    const input = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('wc-input'));
    const sampleBtn = document.getElementById('wc-sample-btn');
    const clearBtn = document.getElementById('wc-clear-btn');

    if (!input) return;

    /** @type {Set<string>} Dictionnaire de mots vides français et anglais ignorés dans le calcul de densité */
    const stopWords = new Set([
      'le','la','les','de','des','du','un','une','et','en','à','dans','pour','par','sur','avec','au','aux','ce','ces','cette',
      'que','qui','est','sont','a','ont','il','elle','ils','elles','nous','vous','je','tu','on','ne','pas','plus','mais','ou','donc',
      'the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','it','this','that'
    ]);

    /**
     * Analyse le texte saisi et met à jour les indicateurs métriques et la table de fréquence lexicale.
     * @inner
     */
    const updateStats = () => {
      const text = input.value;
      const trimmed = text.trim();

      // Détection Unicode des mots (lettres, chiffres, apostrophes, tirets)
      const words = trimmed ? trimmed.match(/[\p{L}\p{N}'’_-]+/gu) || [] : [];
      const wordCount = words.length;

      // Caractères avec et sans espaces
      const charCount = text.length;
      const charNoSpaces = text.replace(/\s/g, '').length;

      // Détection des phrases par ponctuation terminale
      const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;

      // Découpage des paragraphes non vides
      const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

      // Temps moyen de lecture silencieuse (200 wpm) et de diction orale (130 wpm)
      const readMin = Math.ceil(wordCount / 200);
      const speakMin = Math.ceil(wordCount / 130);

      /**
       * Assigne la valeur textuelle formatée à l'élément cible.
       * @param {string} id - Identifiant DOM.
       * @param {string} val - Chaîne de caractères.
       */
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setText('wc-words', wordCount.toLocaleString());
      setText('wc-chars', charCount.toLocaleString());
      setText('wc-chars-nospace', charNoSpaces.toLocaleString());
      setText('wc-sentences', sentences.toLocaleString());
      setText('wc-paragraphs', paragraphs.toLocaleString());
      setText('wc-read-time', `${readMin} min`);
      setText('wc-speak-time', `${speakMin} min`);

      // Analyse de la densité des mots-clés significatifs (> 2 lettres, hors stop-words)
      /** @type {Record<string, number>} */
      const freq = {};
      words.forEach(w => {
        const clean = w.toLowerCase().replace(/['’]/g, '');
        if (clean.length > 2 && !stopWords.has(clean)) {
          freq[clean] = (freq[clean] || 0) + 1;
        }
      });

      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
      const densityTable = document.getElementById('wc-density-tbody');
      if (densityTable) {
        if (sorted.length === 0) {
          densityTable.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Saisissez un texte plus long pour extraire les mots-clés dominants.</td></tr>';
        } else {
          const maxCount = sorted[0][1];
          densityTable.innerHTML = sorted.map(([term, count]) => {
            const pct = ((count / Math.max(1, wordCount)) * 100).toFixed(1);
            const barPct = Math.round((count / maxCount) * 100);
            return `
              <tr>
                <td style="font-weight: 600;">${term}</td>
                <td style="font-family: var(--font-mono);">${count}</td>
                <td style="font-family: var(--font-mono);">${pct}%</td>
                <td style="width: 35%;">
                  <div class="density-bar-bg">
                    <div class="density-bar-fill" style="width: ${barPct}%;"></div>
                  </div>
                </td>
              </tr>
            `;
          }).join('');
        }
      }
    };

    input.addEventListener('input', updateStats);

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = `L'intelligence artificielle transforme en profondeur la productivité numérique moderne. De nos jours, les développeurs, créateurs de contenu et entreprises exploitent des modèles de langage avancés pour automatiser les tâches répétitives, accélérer la rédaction et optimiser l'expérience utilisateur.

Cette suite d'outils web regroupe tout le nécessaire pour manipuler des documents, compresser des images, tester des expressions régulières et planifier des projets. Le traitement 100% côté client garantit une confidentialité totale, aucune donnée n'étant téléversée sur un serveur distant.`;
        updateStats();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        updateStats();
      });
    }

    updateStats();
  },

  /* ================= 3. CONVERTISSEUR DE CASSE ================= */
  /**
   * Initialise le convertisseur de casse prenant en charge 9 notations courantes :
   * camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, UPPERCASE, lowercase, Sentence case.
   * @function initCaseConverter
   * @memberof TextTools
   * @returns {void}
   */
  initCaseConverter() {
    const input = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('case-input'));
    const sampleBtn = document.getElementById('case-sample-btn');
    const clearBtn = document.getElementById('case-clear-btn');

    if (!input) return;

    /**
     * Découpe une chaîne en liste de mots élémentaires indépendamment du format d'entrée (camelCase, snake_case, etc.).
     * @inner
     * @param {string} str - Texte d'entrée brut.
     * @returns {string[]} Liste des mots identifiés.
     */
    const getWords = (str) => {
      if (!str) return [];
      return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[\-_]+/g, ' ')
        .trim()
        .split(/\s+/);
    };

    /** @type {Record<string, (words: string[], raw: string) => string>} Fonctions de formatage pour chaque casse */
    const converters = {
      'case-camel': (words) => words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
      'case-snake': (words) => words.map(w => w.toLowerCase()).join('_'),
      'case-kebab': (words) => words.map(w => w.toLowerCase()).join('-'),
      'case-pascal': (words) => words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
      'case-constant': (words) => words.map(w => w.toUpperCase()).join('_'),
      'case-title': (words) => words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
      'case-upper': (words, raw) => raw.toUpperCase(),
      'case-lower': (words, raw) => raw.toLowerCase(),
      'case-sentence': (words) => {
        const s = words.map(w => w.toLowerCase()).join(' ');
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
      }
    };

    /**
     * Met à jour l'ensemble des 9 cartes de prévisualisation de cas.
     * @inner
     */
    const updateCases = () => {
      const raw = input.value;
      const words = getWords(raw);

      for (const [id, fn] of Object.entries(converters)) {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = raw ? fn(words, raw) : '—';
        }
      }
    };

    input.addEventListener('input', updateCases);

    // Configuration des boutons individuels de copie de chaque format
    document.querySelectorAll('.case-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId || '');
        if (targetEl && targetEl.textContent && targetEl.textContent !== '—') {
          UI.copy(targetEl.textContent, btn, 'Texte copié !');
        } else {
          UI.toast('Aucun texte à copier.', 'warning');
        }
      });
    });

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = 'suite outil web productivite developpeur';
        updateCases();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        updateCases();
      });
    }

    updateCases();
  },

  /* ================= 4. NETTOYEUR DE TEXTE ================= */
  /**
   * Initialise l'outil de nettoyage et d'assainissement de texte typographique.
   * Propose différentes options configurables : suppression des balises HTML, conversion des tabulations en espaces,
   * suppression des espaces multiples, élimination des lignes vides consécutives et normalisation des guillemets.
   * @function initTextCleaner
   * @memberof TextTools
   * @returns {void}
   */
  initTextCleaner() {
    const input = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('cleaner-input'));
    const output = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('cleaner-output'));
    const cleanBtn = document.getElementById('cleaner-clean-btn');
    const copyBtn = document.getElementById('cleaner-copy-btn');
    const sampleBtn = document.getElementById('cleaner-sample-btn');
    const clearBtn = document.getElementById('cleaner-clear-btn');
    const statsEl = document.getElementById('cleaner-stats');

    if (!cleanBtn || !input || !output) return;

    /**
     * Applique les filtres de nettoyage sélectionnés sur le texte saisi.
     * @inner
     */
    const runCleaner = () => {
      let text = input.value;
      if (!text) {
        UI.toast('Veuillez entrer du texte à nettoyer.', 'warning');
        return;
      }

      const initialLen = text.length;

      const optSpaces = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-spaces'))?.checked;
      const optLines = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-lines'))?.checked;
      const optHtml = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-html'))?.checked;
      const optTrim = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-trim'))?.checked;
      const optTabs = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-tabs'))?.checked;
      const optQuotes = /** @type {HTMLInputElement|null} */ (document.getElementById('clean-quotes'))?.checked;

      // 1. Suppression des balises HTML
      if (optHtml) {
        text = text.replace(/<\/?[^>]+(>|$)/g, '');
      }

      // 2. Remplacement des tabulations par un espace simple
      if (optTabs) {
        text = text.replace(/\t/g, ' ');
      }

      // 3. Suppression des espaces de début et fin de chaque ligne
      if (optTrim) {
        text = text.split('\n').map(l => l.trim()).join('\n');
      }

      // 4. Fusion des espaces contigus en un seul espace
      if (optSpaces) {
        text = text.replace(/[^\S\r\n]+/g, ' ');
      }

      // 5. Réduction des sauts de ligne multiples consécutifs
      if (optLines) {
        text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');
      }

      // 6. Normalisation des guillemets typographiques (« », “ ”, ‘ ’, `) en guillemets droits (" et ')
      if (optQuotes) {
        text = text
          .replace(/[“”«»]/g, '"')
          .replace(/[‘’`]/g, "'");
      }

      output.value = text;
      const finalLen = text.length;
      const saved = Math.max(0, initialLen - finalLen);

      if (statsEl) {
        statsEl.textContent = `Avant : ${initialLen} car. | Après : ${finalLen} car. | Économisé : ${saved} car. (${Math.round((saved / Math.max(1, initialLen)) * 100)}%)`;
      }
      UI.toast('Texte nettoyé avec succès !', 'success');
    };

    cleanBtn.addEventListener('click', runCleaner);

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!output.value) {
          UI.toast('Aucun texte nettoyé à copier.', 'warning');
          return;
        }
        UI.copy(output.value, copyBtn, 'Texte nettoyé copié !');
      });
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = `   <div>\n     <h1>   Titre avec    espaces superflus   </h1>\n\n\n\n     <p>Paragraphe contenant des balises <strong>HTML</strong> et des tabulations\t\t\tet des « guillemets » typographiques.</p>\n\n\n   </div>   `;
        runCleaner();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        if (statsEl) statsEl.textContent = '';
      });
    }
  }
};

window.TextTools = TextTools;
