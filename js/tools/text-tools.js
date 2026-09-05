/**
 * Text & Redaction Tools
 * 1. Comparateur de texte (Diff Tool)
 * 2. Compteur de mots avancé & densité
 * 3. Convertisseur de casse (9 formats)
 * 4. Nettoyeur de texte multi-options
 * 100% Client-side Vanilla JS
 */

const TextTools = {
  init() {
    this.initDiffTool();
    this.initWordCounter();
    this.initCaseConverter();
    this.initTextCleaner();
  },

  /* ================= 1. COMPARATEUR DE TEXTE (DIFF) ================= */
  initDiffTool() {
    const inputA = document.getElementById('diff-input-a');
    const inputB = document.getElementById('diff-input-b');
    const compareBtn = document.getElementById('diff-compare-btn');
    const sampleBtn = document.getElementById('diff-sample-btn');
    const clearBtn = document.getElementById('diff-clear-btn');
    const output = document.getElementById('diff-output');
    const statsContainer = document.getElementById('diff-stats');

    if (!compareBtn || !output) return;

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

    const buildDiff = (a, b) => {
      const dp = computeLCS(a, b);
      let i = a.length;
      let j = b.length;
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

    const runDiff = () => {
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
        inputA.value = `// Configuration v1.0\nconst appConfig = {\n  env: 'production',\n  apiUrl: 'https://api.v1.domain.com',\n  timeout: 5000,\n  retries: 3,\n  enableCache: false\n};`;
        inputB.value = `// Configuration v2.0 - Optimisée\nconst appConfig = {\n  env: 'production',\n  apiUrl: 'https://api.v2.domain.com',\n  timeout: 8000,\n  retries: 3,\n  enableCache: true,\n  compression: 'gzip'\n};`;
        runDiff();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        inputA.value = '';
        inputB.value = '';
        output.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">Les différences apparaîtront ici après comparaison.</div>';
        if (statsContainer) statsContainer.innerHTML = '';
      });
    }
  },

  /* ================= 2. COMPTEUR DE MOTS AVANCÉ ================= */
  initWordCounter() {
    const input = document.getElementById('wc-input');
    const sampleBtn = document.getElementById('wc-sample-btn');
    const clearBtn = document.getElementById('wc-clear-btn');

    if (!input) return;

    const stopWords = new Set([
      'le','la','les','de','des','du','un','une','et','en','à','dans','pour','par','sur','avec','au','aux','ce','ces','cette',
      'que','qui','est','sont','a','ont','il','elle','ils','elles','nous','vous','je','tu','on','ne','pas','plus','mais','ou','donc',
      'the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','it','this','that'
    ]);

    const updateStats = () => {
      const text = input.value;
      const trimmed = text.trim();

      // Words
      const words = trimmed ? trimmed.match(/[\p{L}\p{N}'’_-]+/gu) || [] : [];
      const wordCount = words.length;

      // Characters
      const charCount = text.length;
      const charNoSpaces = text.replace(/\s/g, '').length;

      // Sentences
      const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;

      // Paragraphs
      const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

      // Reading and Speaking Time
      const readMin = Math.ceil(wordCount / 200);
      const speakMin = Math.ceil(wordCount / 130);

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

      // Keyword Density (exclude stop words and short words <= 2 letters)
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
  initCaseConverter() {
    const input = document.getElementById('case-input');
    const sampleBtn = document.getElementById('case-sample-btn');
    const clearBtn = document.getElementById('case-clear-btn');

    if (!input) return;

    // Split text into words regardless of initial case
    const getWords = (str) => {
      if (!str) return [];
      return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[\-_]+/g, ' ')
        .trim()
        .split(/\s+/);
    };

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

    // Setup Copy buttons for each case
    document.querySelectorAll('.case-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
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
  initTextCleaner() {
    const input = document.getElementById('cleaner-input');
    const output = document.getElementById('cleaner-output');
    const cleanBtn = document.getElementById('cleaner-clean-btn');
    const copyBtn = document.getElementById('cleaner-copy-btn');
    const sampleBtn = document.getElementById('cleaner-sample-btn');
    const clearBtn = document.getElementById('cleaner-clear-btn');
    const statsEl = document.getElementById('cleaner-stats');

    if (!cleanBtn || !input || !output) return;

    const runCleaner = () => {
      let text = input.value;
      if (!text) {
        UI.toast('Veuillez entrer du texte à nettoyer.', 'warning');
        return;
      }

      const initialLen = text.length;

      const optSpaces = document.getElementById('clean-spaces')?.checked;
      const optLines = document.getElementById('clean-lines')?.checked;
      const optHtml = document.getElementById('clean-html')?.checked;
      const optTrim = document.getElementById('clean-trim')?.checked;
      const optTabs = document.getElementById('clean-tabs')?.checked;
      const optQuotes = document.getElementById('clean-quotes')?.checked;

      // 1. Strip HTML tags
      if (optHtml) {
        text = text.replace(/<\/?[^>]+(>|$)/g, '');
      }

      // 2. Replace tabs with spaces
      if (optTabs) {
        text = text.replace(/\t/g, ' ');
      }

      // 3. Trim each line
      if (optTrim) {
        text = text.split('\n').map(l => l.trim()).join('\n');
      }

      // 4. Collapse extra spaces
      if (optSpaces) {
        text = text.replace(/[^\S\r\n]+/g, ' ');
      }

      // 5. Remove multiple consecutive blank lines
      if (optLines) {
        text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');
      }

      // 6. Normalize quotes and apostrophes
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
