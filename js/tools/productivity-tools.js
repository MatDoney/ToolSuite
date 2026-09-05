/**
 * Productivity & Time Tools
 * 1. Planificateur de fuseaux horaires
 * 2. Calculateur de dates (durée, jours ouvrés, projection)
 * 3. Minuteur Pomodoro minimaliste avec bruits blancs Web Audio API
 * 100% Client-side Vanilla JS
 */

const ProductivityTools = {
  init() {
    this.initTimezonePlanner();
    this.initDateCalculator();
    this.initPomodoro();
  },

  /* ================= 1. PLANIFICATEUR DE FUSEAUX HORAIRES ================= */
  initTimezonePlanner() {
    const listContainer = document.getElementById('tz-list');
    const selectCity = document.getElementById('tz-add-select');
    const addBtn = document.getElementById('tz-add-btn');

    if (!listContainer) return;

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

    let activeCityIds = ['paris', 'london', 'newyork', 'tokyo'];
    let selectedBaseHour = new Date().getHours();

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

    const render = () => {
      listContainer.innerHTML = '';

      // Populate select
      if (selectCity) {
        selectCity.innerHTML = ALL_CITIES
          .filter(c => !activeCityIds.includes(c.id))
          .map(c => `<option value="${c.id}">${c.flag} ${c.name}</option>`)
          .join('');
      }

      const activeCities = activeCityIds.map(id => ALL_CITIES.find(c => c.id === id)).filter(Boolean);

      // Determine overlap: which base hours (0..23) result in 9..18 in ALL active cities?
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

      // Hour click event delegation
      listContainer.querySelectorAll('.tz-hour-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          selectedBaseHour = parseInt(cell.getAttribute('data-base-h'), 10);
          render();
        });
      });

      // Remove city handlers
      listContainer.querySelectorAll('.tz-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const removeId = btn.getAttribute('data-id');
          activeCityIds = activeCityIds.filter(id => id !== removeId);
          render();
        });
      });
    };

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
  initDateCalculator() {
    const startInput = document.getElementById('date-calc-start');
    const endInput = document.getElementById('date-calc-end');
    const diffBtn = document.getElementById('date-calc-diff-btn');

    const projDateInput = document.getElementById('date-proj-date');
    const projNumInput = document.getElementById('date-proj-num');
    const projUnitSelect = document.getElementById('date-proj-unit');
    const projOpSelect = document.getElementById('date-proj-op');
    const projBtn = document.getElementById('date-proj-btn');

    if (!diffBtn) return;

    // Default dates to today and +30 days
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    const toYMD = (d) => d.toISOString().split('T')[0];
    if (startInput) startInput.value = toYMD(today);
    if (endInput) endInput.value = toYMD(future);
    if (projDateInput) projDateInput.value = toYMD(today);

    // Mode 1 : Diff between dates
    const calculateDiff = () => {
      const d1 = new Date(startInput.value);
      const d2 = new Date(endInput.value);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        UI.toast('Veuillez sélectionner deux dates valides.', 'warning');
        return;
      }

      const minDate = d1 < d2 ? d1 : d2;
      const maxDate = d1 < d2 ? d2 : d1;

      const diffMs = maxDate - minDate;
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;

      // Count business days (Mon-Fri)
      let businessDays = 0;
      const cur = new Date(minDate);
      while (cur < maxDate) {
        cur.setDate(cur.getDate() + 1);
        const day = cur.getDay();
        if (day !== 0 && day !== 6) businessDays++;
      }

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

    // Mode 2 : Date Projection
    if (projBtn) {
      projBtn.addEventListener('click', () => {
        const base = new Date(projDateInput.value);
        const num = parseInt(projNumInput.value, 10) || 0;
        const unit = projUnitSelect.value;
        const op = projOpSelect.value; // 'add' or 'sub'
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
  initPomodoro() {
    const timerDisplay = document.getElementById('pomo-display');
    const startBtn = document.getElementById('pomo-start-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');
    const modeBtns = document.querySelectorAll('.pomodoro-mode-btn');
    const noiseSelect = document.getElementById('pomo-noise-select');
    const volumeSlider = document.getElementById('pomo-volume');

    const taskInput = document.getElementById('pomo-task-input');
    const taskAddBtn = document.getElementById('pomo-task-add-btn');
    const taskList = document.getElementById('pomo-task-list');

    if (!timerDisplay || !startBtn) return;

    let durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    let currentMode = 'focus';
    let timeLeft = durations.focus;
    let timerInterval = null;
    let isRunning = false;

    // Web Audio Noise Generator
    let audioCtx = null;
    let noiseNode = null;
    let gainNode = null;

    const initAudio = () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = (parseFloat(volumeSlider?.value || 50) / 100) * 0.15;
        gainNode.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    };

    const stopNoise = () => {
      if (noiseNode) {
        try {
          noiseNode.stop();
          noiseNode.disconnect();
        } catch (e) {}
        noiseNode = null;
      }
    };

    const playNoise = (type) => {
      stopNoise();
      if (type === 'none') return;
      initAudio();

      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'rain') {
        // Pink noise simulation with filter
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.12;
        }
      } else if (type === 'cafe') {
        // Brown noise simulation
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 0.5;
        }
      } else if (type === 'waves') {
        // Modulated ambient noise
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

    const renderTime = () => {
      const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const s = (timeLeft % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${m}:${s}`;
      if (isRunning) {
        document.title = `(${m}:${s}) ToolSuite Pomodoro`;
      }
    };

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
          // Beep
          try {
            initAudio();
            const osc = audioCtx.createOscillator();
            osc.frequency.value = 587.33; // D5
            osc.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
          } catch (e) {}
        }
      }, 1000);
    };

    startBtn.addEventListener('click', () => {
      if (isRunning) stopTimer();
      else startTimer();
    });

    resetBtn.addEventListener('click', () => {
      stopTimer();
      timeLeft = durations[currentMode];
      renderTime();
    });

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.getAttribute('data-mode');
        stopTimer();
        timeLeft = durations[currentMode];
        renderTime();
      });
    });

    // Session Tasks
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

      li.querySelector('input').addEventListener('change', (e) => {
        li.querySelector('span').style.textDecoration = e.target.checked ? 'line-through' : 'none';
        li.querySelector('span').style.opacity = e.target.checked ? '0.5' : '1';
      });

      li.querySelector('button').addEventListener('click', () => li.remove());

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
