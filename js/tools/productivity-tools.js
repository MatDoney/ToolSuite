/**
 * @file productivity-tools.js
 * @description Suite d'outils de productivité et de gestion temporelle 100% exécutés côté client (Vanilla JS).
 * Comprend un planificateur visuel de fuseaux horaires mondiaux avec détection des créneaux de travail partagés (overlapping hours),
 * un calculateur d'écarts de dates avec comptage des jours ouvrés et projection calendaire future/passée,
 * ainsi qu'un minuteur Pomodoro audio avec générateur de bruits d'ambiance synthétisés (pluie, café, vagues) via la Web Audio API.
 * @module ProductivityTools
 */

/**
 * @typedef {Object} CityTimezoneItem
 * @property {string} id - Identifiant technique unique de la ville.
 * @property {string} name - Nom usuel de la métropole ou de l'agglomération.
 * @property {string} tz - Identifiant IANA de fuseau horaire (ex: 'Europe/Paris', 'America/New_York').
 * @property {string} flag - Émoji représentant le drapeau national correspondant.
 */

/**
 * Espace de nom principal regroupant les utilitaires de gestion temporelle et de productivité.
 * @namespace ProductivityTools
 */
const ProductivityTools = {
  /**
   * Initialise l'ensemble des sous-modules de productivité au démarrage.
   * @function init
   * @memberof ProductivityTools
   * @returns {void}
   */
  init() {
    this.initTimezonePlanner();
    this.initDateCalculator();
    this.initPomodoro();
  },

  /* ================= 1. PLANIFICATEUR DE FUSEAUX HORAIRES ================= */
  /**
   * Initialise le planificateur matriciel de fuseaux horaires mondiaux.
   * Affiche une frise de 24 heures par ville sélectionnée, identifie les heures de travail locales (09:00 - 18:00)
   * et calcule automatiquement les créneaux communs de collaboration simultanée (overlap) entre toutes les villes actives.
   * @function initTimezonePlanner
   * @memberof ProductivityTools
   * @returns {void}
   */
  initTimezonePlanner() {
    const listContainer = document.getElementById('tz-list');
    const selectCity = /** @type {HTMLSelectElement|null} */ (document.getElementById('tz-add-select'));
    const addBtn = document.getElementById('tz-add-btn');

    if (!listContainer) return;

    /** @type {CityTimezoneItem[]} Répertoire prédéfini des métropoles internationales majeures */
    const ALL_CITIES = [
      { id: 'paris', name: 'Paris / Berlin', tz: 'Europe/Paris', flag: '🇫🇷' },
      { id: 'london', name: 'Londres', tz: 'Europe/London', flag: '🇬🇧' },
      { id: 'newyork', name: 'New York / Montréal', tz: 'America/New_York', flag: '🇺🇸' },
      { id: 'sf', name: 'San Francisco / LA', tz: 'America/Los_Angeles', flag: '🇺🇸' },
      { id: 'tokyo', name: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
      { id: 'singapore', name: 'Singapour', tz: 'Asia/Singapore', flag: '🇸🇬' },
      { id: 'sydney', name: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
      { id: 'dubai', name: 'Dubaï', tz: 'Asia/Dubai', flag: '🇦🇪' }
    ];

    /** @type {string[]} Liste des identifiants des villes actuellement affichées */
    let activeCityIds = ['paris', 'london', 'newyork', 'tokyo'];
    /** @type {number} Heure pivot de référence sélectionnée (0 à 23) */
    let selectedBaseHour = new Date().getHours();

    /**
     * Calcule le décalage horaire relatif (en heures) entre le fuseau IANA cible et l'heure locale du navigateur.
     * @inner
     * @param {string} tz - Identifiant IANA de la zone horaire.
     * @returns {number} Différence d'heures (positive ou négative).
     */
    const getCityOffsetHours = (tz) => {
      try {
        const now = new Date();
        const str = now.toLocaleString('en-US', { timeZone: tz, hour12: false, hour: 'numeric' });
        const localHour = now.getHours();
        const cityHour = parseInt(str, 10);
        let diff = cityHour - localHour;
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;
        return diff;
      } catch (e) {
        return 0;
      }
    };

    /**
     * Effectue le rendu HTML de l'ensemble des frises temporelles des villes actives.
     * Détermine les plages communes d'intersection où chaque métropole est dans sa plage d'activité (9h-18h).
     * @inner
     */
    const render = () => {
      listContainer.innerHTML = '';

      // Mise à jour de la liste déroulante des villes pouvant être ajoutées
      if (selectCity) {
        selectCity.innerHTML = ALL_CITIES
          .filter(c => !activeCityIds.includes(c.id))
          .map(c => `<option value="${c.id}">${c.flag} ${c.name}</option>`)
          .join('');
      }

      const activeCities = activeCityIds
        .map(id => ALL_CITIES.find(c => c.id === id))
        .filter(/** @type {(c: CityTimezoneItem|undefined) => c is CityTimezoneItem} */ (Boolean));

      // Identification des heures de chevauchement parfait (9h-18h dans toutes les villes)
      const overlappingBaseHours = new Set();
      for (let h = 0; h < 24; h++) {
        const allWorking = activeCities.every(city => {
          const offset = getCityOffsetHours(city.tz);
          const cityH = (h + offset + 24) % 24;
          return cityH >= 9 && cityH < 18;
        });
        if (allWorking) overlappingBaseHours.add(h);
      }

      activeCities.forEach((city) => {
        const offset = getCityOffsetHours(city.tz);
        const now = new Date();
        const timeStr = now.toLocaleTimeString('fr-FR', { timeZone: city.tz, hour: '2-digit', minute: '2-digit' });
        const sign = offset >= 0 ? `+${offset}` : `${offset}`;

        const row = document.createElement('div');
        row.className = 'tz-row';

        let cellsHtml = '';
        for (let baseH = 0; baseH < 24; baseH++) {
          const cityH = (baseH + offset + 24) % 24;
          const isWork = cityH >= 9 && cityH < 18;
          const isOverlap = overlappingBaseHours.has(baseH);
          const isSelected = baseH === selectedBaseHour;

          let cellClass = 'tz-hour-cell';
          if (isOverlap) cellClass += ' tz-hour-overlap';
          else if (isWork) cellClass += ' tz-hour-work';
          if (isSelected) cellClass += ' tz-hour-selected';

          cellsHtml += `
            <div class="${cellClass}" data-base-h="${baseH}" title="${city.name} : ${cityH}h00">
              ${cityH}
            </div>
          `;
        }

        row.innerHTML = `
          <div class="tz-meta">
            <div class="tz-city-title">
              <span>${city.flag}</span>
              <strong>${city.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">(UTC ${sign}h)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 1rem;">${timeStr}</span>
              ${activeCityIds.length > 2 ? `<button class="action-icon-btn tz-remove-btn" data-id="${city.id}" style="width: 28px; height: 28px; font-size: 0.8rem;" title="Retirer">✕</button>` : ''}
            </div>
          </div>
          <div class="tz-hours-track">
            ${cellsHtml}
          </div>
        `;

        listContainer.appendChild(row);
      });

      // Gestion du clic sur une colonne horaire pour aligner l'indicateur vertical
      listContainer.querySelectorAll('.tz-hour-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          selectedBaseHour = parseInt(cell.getAttribute('data-base-h') || '0', 10);
          render();
        });
      });

      // Gestion de la suppression d'une ville de la matrice
      listContainer.querySelectorAll('.tz-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const removeId = btn.getAttribute('data-id');
          activeCityIds = activeCityIds.filter(id => id !== removeId);
          render();
        });
      });
    };

    // Ajout d'une nouvelle métropole depuis la liste déroulante
    if (addBtn && selectCity) {
      addBtn.addEventListener('click', () => {
        const val = selectCity.value;
        if (val && !activeCityIds.includes(val)) {
          activeCityIds.push(val);
          render();
        }
      });
    }

    render();
  },

  /* ================= 2. CALCULATEUR DE DATES ================= */
  /**
   * Initialise le calculateur d'intervalles calendaires et de projections temporelles.
   * Mode 1 : Mesure précise de la durée entre deux dates (jours réels, semaines résiduelles, jours ouvrés du lundi au vendredi, total d'heures).
   * Mode 2 : Projection de date par addition ou soustraction de jours, semaines, mois ou années.
   * @function initDateCalculator
   * @memberof ProductivityTools
   * @returns {void}
   */
  initDateCalculator() {
    const startInput = /** @type {HTMLInputElement|null} */ (document.getElementById('date-calc-start'));
    const endInput = /** @type {HTMLInputElement|null} */ (document.getElementById('date-calc-end'));
    const diffBtn = document.getElementById('date-calc-diff-btn');

    const projDateInput = /** @type {HTMLInputElement|null} */ (document.getElementById('date-proj-date'));
    const projNumInput = /** @type {HTMLInputElement|null} */ (document.getElementById('date-proj-num'));
    const projUnitSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById('date-proj-unit'));
    const projOpSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById('date-proj-op'));
    const projBtn = document.getElementById('date-proj-btn');

    if (!diffBtn) return;

    // Initialisation des champs par défaut (aujourd'hui et aujourd'hui + 30 jours)
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    /**
     * Formate un objet Date au standard ISO 'YYYY-MM-DD'.
     * @param {Date} d - Date à formater.
     * @returns {string} Chaîne au format ISO YYYY-MM-DD.
     */
    const toYMD = (d) => d.toISOString().split('T')[0];
    if (startInput) startInput.value = toYMD(today);
    if (endInput) endInput.value = toYMD(future);
    if (projDateInput) projDateInput.value = toYMD(today);

    /**
     * Calcule l'intervalle entre les deux dates saisies et dénombre les jours ouvrés.
     * @inner
     */
    const calculateDiff = () => {
      if (!startInput || !endInput) return;
      const d1 = new Date(startInput.value);
      const d2 = new Date(endInput.value);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        UI.toast('Veuillez sélectionner deux dates valides.', 'warning');
        return;
      }

      const minDate = d1 < d2 ? d1 : d2;
      const maxDate = d1 < d2 ? d2 : d1;

      const diffMs = maxDate.getTime() - minDate.getTime();
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;

      // Comptage itératif des jours ouvrés (du lundi au vendredi, exclusion de 0=Dimanche et 6=Samedi)
      let businessDays = 0;
      const cur = new Date(minDate);
      while (cur < maxDate) {
        cur.setDate(cur.getDate() + 1);
        const day = cur.getDay();
        if (day !== 0 && day !== 6) businessDays++;
      }

      /**
       * Assigne le texte formaté à un élément HTML.
       * @param {string} id - Identifiant de l'élément.
       * @param {string} val - Valeur textuelle.
       */
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setVal('date-res-days', totalDays.toLocaleString());
      setVal('date-res-weeks', `${weeks} sem. + ${remDays} j.`);
      setVal('date-res-workdays', `${businessDays} jours ouvrés`);
      setVal('date-res-hours', (totalDays * 24).toLocaleString() + ' h');
    };

    diffBtn.addEventListener('click', calculateDiff);
    calculateDiff();

    // Mode 2 : Projection de date future ou passée
    if (projBtn) {
      projBtn.addEventListener('click', () => {
        if (!projDateInput || !projNumInput || !projUnitSelect || !projOpSelect) return;
        const base = new Date(projDateInput.value);
        const num = parseInt(projNumInput.value, 10) || 0;
        const unit = projUnitSelect.value;
        const op = projOpSelect.value; // 'add' ou 'sub'
        const factor = op === 'add' ? 1 : -1;

        if (isNaN(base.getTime())) {
          UI.toast('Date de départ invalide.', 'warning');
          return;
        }

        const res = new Date(base);
        if (unit === 'days') res.setDate(res.getDate() + (num * factor));
        else if (unit === 'weeks') res.setDate(res.getDate() + (num * 7 * factor));
        else if (unit === 'months') res.setMonth(res.getMonth() + (num * factor));
        else if (unit === 'years') res.setFullYear(res.getFullYear() + (num * factor));

        /** @type {Intl.DateTimeFormatOptions} */
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = res.toLocaleDateString('fr-FR', options);

        const out = document.getElementById('date-proj-output');
        if (out) {
          out.innerHTML = `Date calculée : <strong style="color: var(--accent-primary);">${formatted}</strong>`;
        }
      });
    }
  },

  /* ================= 3. MINUTEUR POMODORO + BRUITS BLANCS ================= */
  /**
   * Initialise le minuteur de concentration selon la méthode Pomodoro.
   * Gère trois modes temporels (Focus 25 min, Pause courte 5 min, Pause longue 15 min),
   * une synthèse audio procédurale en temps réel de bruits d'ambiance relaxants (pluie rose filtrée, café brun, vagues modulées par LFO),
   * et un gestionnaire de liste de tâches rapides intégrée à la session.
   * @function initPomodoro
   * @memberof ProductivityTools
   * @returns {void}
   */
  initPomodoro() {
    const timerDisplay = document.getElementById('pomo-display');
    const startBtn = document.getElementById('pomo-start-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');
    const modeBtns = document.querySelectorAll('.pomodoro-mode-btn');
    const noiseSelect = /** @type {HTMLSelectElement|null} */ (document.getElementById('pomo-noise-select'));
    const volumeSlider = /** @type {HTMLInputElement|null} */ (document.getElementById('pomo-volume'));

    const taskInput = /** @type {HTMLInputElement|null} */ (document.getElementById('pomo-task-input'));
    const taskAddBtn = document.getElementById('pomo-task-add-btn');
    const taskList = document.getElementById('pomo-task-list');

    if (!timerDisplay || !startBtn) return;

    /** @type {Record<string, number>} Durée en secondes pour chaque mode de concentration */
    const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    /** @type {string} Mode actif sélectionné ('focus', 'short' ou 'long') */
    let currentMode = 'focus';
    /** @type {number} Secondes restantes sur le décompte en cours */
    let timeLeft = durations.focus;
    /** @type {any} Référence de l'intervalle d'horloge window.setInterval */
    let timerInterval = null;
    /** @type {boolean} État d'exécution du décompte */
    let isRunning = false;

    // Synthétiseur audio Web Audio API
    /** @type {AudioContext|null} Contexte audio principal */
    let audioCtx = null;
    /** @type {AudioBufferSourceNode|null} Nœud source de génération de bruit blanc */
    let noiseNode = null;
    /** @type {GainNode|null} Nœud de contrôle de volume */
    let gainNode = null;

    /**
     * Initialise le contexte audio et le nœud de gain de sortie s'ils ne sont pas encore instanciés.
     * @inner
     */
    const initAudio = () => {
      if (!audioCtx) {
        const AudioCtxClass = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
        audioCtx = new AudioCtxClass();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = (parseFloat(volumeSlider?.value || '50') / 100) * 0.15;
        gainNode.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    /**
     * Interrompt la lecture en boucle du bruit d'ambiance en cours.
     * @inner
     */
    const stopNoise = () => {
      if (noiseNode) {
        try {
          noiseNode.stop();
          noiseNode.disconnect();
        } catch (e) {}
        noiseNode = null;
      }
    };

    /**
     * Génère dynamiquement en mémoire un tampon audio de bruit procédural (Rain, Cafe ou Waves).
     * @inner
     * @param {string} type - Type d'ambiance ('rain', 'cafe', 'waves' ou 'none').
     */
    const playNoise = (type) => {
      stopNoise();
      if (type === 'none') return;
      initAudio();
      if (!audioCtx || !gainNode) return;

      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'rain') {
        // Modélisation d'un bruit rose filtré (Pink Noise via filtre Paul Kellet) simulant la pluie fine
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.12;
        }
      } else if (type === 'cafe') {
        // Modélisation d'un bruit brun (Brown/Red Noise par intégration) évoquant un brouhaha feutré
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 0.5;
        }
      } else if (type === 'waves') {
        // Bruit modulé par un oscillateur basse fréquence (LFO à 0.2 Hz) simulant le ressac régulier des vagues
        for (let i = 0; i < bufferSize; i++) {
          const t = i / audioCtx.sampleRate;
          const lfo = (Math.sin(2 * Math.PI * 0.2 * t) + 1) * 0.5;
          data[i] = (Math.random() * 2 - 1) * lfo * 0.1;
        }
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;
      noiseNode.connect(gainNode);
      noiseNode.start();
    };

    if (noiseSelect) {
      noiseSelect.addEventListener('change', () => {
        if (isRunning) playNoise(noiseSelect.value);
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        if (gainNode) {
          gainNode.gain.value = (parseFloat(volumeSlider.value) / 100) * 0.15;
        }
      });
    }

    /**
     * Formate et rafraîchit l'affichage numérique du chronomètre dans l'interface et dans le titre de l'onglet.
     * @inner
     */
    const renderTime = () => {
      const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const s = (timeLeft % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${m}:${s}`;
      if (isRunning) {
        document.title = `(${m}:${s}) ToolSuite Pomodoro`;
      }
    };

    /**
     * Interrompt le minuteur et réinitialise l'état des commandes.
     * @inner
     */
    const stopTimer = () => {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      startBtn.textContent = 'Démarrer';
      startBtn.classList.remove('btn-danger');
      startBtn.classList.add('btn-primary');
      stopNoise();
      document.title = 'ToolSuite - 100% Local Web Tools';
    };

    /**
     * Démarre ou reprend l'écoulement du décompte Pomodoro.
     * @inner
     */
    const startTimer = () => {
      isRunning = true;
      startBtn.textContent = 'Pause';
      startBtn.classList.remove('btn-primary');
      startBtn.classList.add('btn-danger');

      if (noiseSelect && noiseSelect.value !== 'none') {
        playNoise(noiseSelect.value);
      }

      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          renderTime();
        } else {
          stopTimer();
          UI.toast('Temps écoulé ! Faites une pause.', 'success');
          // Émission d'un bip sonore de notification de fin de cycle (Note Ré5 / D5 à 587.33 Hz)
          try {
            initAudio();
            if (audioCtx) {
              const osc = audioCtx.createOscillator();
              osc.frequency.value = 587.33;
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            }
          } catch (e) {}
        }
      }, 1000);
    };

    startBtn.addEventListener('click', () => {
      if (isRunning) stopTimer();
      else startTimer();
    });

    resetBtn?.addEventListener('click', () => {
      stopTimer();
      timeLeft = durations[currentMode];
      renderTime();
    });

    // Basculement entre les modes Focus (25m), Pause courte (5m) et Pause longue (15m)
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.getAttribute('data-mode') || 'focus';
        stopTimer();
        timeLeft = durations[currentMode];
        renderTime();
      });
    });

    /**
     * Ajoute une nouvelle tâche interactive à la liste de contrôle de la session de travail.
     * @inner
     */
    const addTask = () => {
      const text = taskInput?.value.trim();
      if (!text || !taskList) return;

      const li = document.createElement('li');
      li.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xs); margin-bottom: 0.4rem;';
      li.innerHTML = `
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; flex: 1;">
          <input type="checkbox" style="width: 16px; height: 16px; cursor: pointer;">
          <span style="font-size: 0.85rem;">${text}</span>
        </label>
        <button class="action-icon-btn" style="width: 24px; height: 24px; font-size: 0.75rem;">✕</button>
      `;

      const chk = li.querySelector('input');
      const span = li.querySelector('span');
      chk?.addEventListener('change', (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        if (span) {
          span.style.textDecoration = target.checked ? 'line-through' : 'none';
          span.style.opacity = target.checked ? '0.5' : '1';
        }
      });

      li.querySelector('button')?.addEventListener('click', () => li.remove());

      taskList.appendChild(li);
      taskInput.value = '';
    };

    if (taskAddBtn && taskInput) {
      taskAddBtn.addEventListener('click', addTask);
      taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
      });
    }

    renderTime();
  }
};

window.ProductivityTools = ProductivityTools;
