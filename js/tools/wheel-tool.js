/**
 * @file wheel-tool.js
 * @module WheelTool
 * @description Roue de la fortune et sélecteur aléatoire physique animé sur Canvas HTML5 (100% côté client).
 * Propose une simulation physique réaliste avec accélération et décélération par friction,
 * synthèse sonore dynamique via la Web Audio API (clics d'encoches et fanfare de victoire),
 * moteur de particules de confettis et historique des tirages.
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

/**
 * @namespace WheelTool
 * @description Contrôleur de la roue de tirage au sort aléatoire.
 */
const WheelTool = {
  /**
   * Initialise l'ensemble du système de la roue : lecture de la liste des participants,
   * rendu géométrique trigonométrique des secteurs sur canvas Retina/HiDPI,
   * physique d'inertie de rotation et gestionnaire d'effets visuels/sonores.
   *
   * @function init
   * @memberof WheelTool
   * @returns {void}
   */
  init() {
    const canvas = document.getElementById('wheel-canvas');
    const input = document.getElementById('wheel-names-input');
    const spinBtn = document.getElementById('wheel-spin-btn');
    const sampleBtn = document.getElementById('wheel-sample-btn');
    const removeWinnerBtn = document.getElementById('wheel-remove-winner-btn');
    const resultBox = document.getElementById('wheel-result-box');
    const historyList = document.getElementById('wheel-history-list');

    if (!canvas || !input || !spinBtn) return;

    const ctx = canvas.getContext('2d');
    let items = [];
    let currentAngle = 0; // Angle de rotation en radians
    let isSpinning = false;
    let lastWinner = null;
    let lastTickAngle = 0;

    /**
     * Palette chromatique harmonieuse pour les secteurs de la roue.
     * @type {string[]}
     */
    const COLORS = [
      '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', 
      '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', 
      '#f97316', '#6366f1', '#84cc16', '#d946ef'
    ];

    /** @type {AudioContext|null} Contexte audio synthétisé Web Audio API */
    let audioCtx = null;

    /**
     * Joue un son synthétisé de 'clic' mécanique à chaque passage d'un secteur sous l'aiguille.
     * @function playTickSound
     */
    const playTickSound = () => {
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch (e) {}
    };

    /**
     * Joue un arpège de victoire harmonique lors de l'arrêt de la roue sur le gagnant.
     * @function playWinSound
     */
    const playWinSound = () => {
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.12, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.36);
        });
      } catch (e) {}
    };

    /**
     * Parse la liste des participants depuis le champ textarea (une ligne par entrée).
     * @function getItems
     * @returns {string[]}
     */
    const getItems = () => {
      return input.value
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    };

    /**
     * Dessine la roue avec mise à l'échelle HiDPI (devicePixelRatio), découpage en secteurs,
     * textes orientés par trigonométrie et moyeu central.
     * @function drawWheel
     */
    const drawWheel = () => {
      items = getItems();
      const numItems = items.length;
      const dpr = window.devicePixelRatio || 1;
      const size = 440;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const center = size / 2;
      const radius = center - 12;

      if (numItems === 0) {
        ctx.fillStyle = 'var(--bg-card)';
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Entrez des noms pour afficher la roue', center, center);
        ctx.restore();
        return;
      }

      const arc = (Math.PI * 2) / numItems;

      // Tracé trigonométrique de chaque secteur
      for (let i = 0; i < numItems; i++) {
        const angle = currentAngle + i * arc;
        ctx.fillStyle = COLORS[i % COLORS.length];

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, angle, angle + arc);
        ctx.lineTo(center, center);
        ctx.fill();

        ctx.strokeStyle = '#ffffff25';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texte orienté le long du rayon du secteur
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;

        let label = items[i];
        if (label.length > 18) label = label.slice(0, 16) + '…';
        ctx.fillText(label, radius - 24, 5);
        ctx.restore();
      }

      // Anneau de contour externe
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Moyeu central décoratif
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(center, center, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(center, center, 32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎯', center, center + 5);

      ctx.restore();
    };

    /**
     * Lance l'animation physique de rotation avec décélération exponentielle (courbe de frottement).
     * Calcule le vainqueur désigné par la flèche située à 12h (270 degrés / 1.5 * PI).
     * @function spin
     */
    const spin = () => {
      if (isSpinning) return;
      items = getItems();
      if (items.length < 2) {
        UI.toast('Veuillez entrer au moins 2 noms.', 'warning');
        return;
      }

      isSpinning = true;
      spinBtn.disabled = true;
      if (removeWinnerBtn) removeWinnerBtn.style.display = 'none';
      if (resultBox) resultBox.innerHTML = '<span style="color: var(--text-muted);">Tirage en cours...</span>';

      const numItems = items.length;
      const arc = (Math.PI * 2) / numItems;
      let velocity = 0.35 + Math.random() * 0.25; // Vitesse angulaire initiale
      const friction = 0.984 + Math.random() * 0.005; // Facteur de décélération inertielle
      lastTickAngle = currentAngle;

      const animate = () => {
        currentAngle += velocity;
        velocity *= friction;

        // Détection de passage de secteur pour déclencher le clic mécanique
        if (Math.abs(currentAngle - lastTickAngle) >= arc) {
          playTickSound();
          lastTickAngle = currentAngle;
        }

        drawWheel();

        if (velocity > 0.002) {
          requestAnimationFrame(animate);
        } else {
          isSpinning = false;
          spinBtn.disabled = false;

          // Calcul mathématique du vainqueur sous le pointeur fixe (sommet à 270° soit 1.5 * PI)
          const normalized = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const pointerAngle = (Math.PI * 1.5 - normalized + Math.PI * 2) % (Math.PI * 2);
          const winnerIndex = Math.floor(pointerAngle / arc) % numItems;
          const winner = items[winnerIndex];
          lastWinner = winner;

          playWinSound();
          launchConfetti();

          if (resultBox) {
            resultBox.innerHTML = `
              <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">🎉 Gagnant(e) du tirage :</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: #22c55e; margin: 0.3rem 0;">${winner}</div>
            `;
          }

          if (removeWinnerBtn) removeWinnerBtn.style.display = 'inline-block';

          // Ajout à l'historique des tirages
          if (historyList) {
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const li = document.createElement('li');
            li.style.cssText = 'padding: 4px 8px; font-size: 0.85rem; display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color);';
            li.innerHTML = `<strong>${winner}</strong><span style="color: var(--text-muted); font-size: 0.75rem;">${time}</span>`;
            historyList.prepend(li);
          }

          UI.toast(`Félicitations à ${winner} !`, 'success');
        }
      };

      requestAnimationFrame(animate);
    };

    /**
     * Déclenche une projection de confettis multicolores avec gravité et rotation.
     * @function launchConfetti
     */
    const launchConfetti = () => {
      const confettiCanvas = document.getElementById('wheel-confetti-canvas');
      if (!confettiCanvas) return;
      const cctx = confettiCanvas.getContext('2d');
      const w = (confettiCanvas.width = confettiCanvas.offsetWidth);
      const h = (confettiCanvas.height = confettiCanvas.offsetHeight);

      const particles = [];
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: w / 2,
          y: h / 2,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.7) * 12,
          size: Math.random() * 7 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.2,
          alpha: 1
        });
      }

      let frame = 0;
      const runConfetti = () => {
        cctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // Force de gravité
          p.rotation += p.vrot;
          p.alpha -= 0.012;

          cctx.save();
          cctx.globalAlpha = Math.max(0, p.alpha);
          cctx.fillStyle = p.color;
          cctx.translate(p.x, p.y);
          cctx.rotate(p.rotation);
          cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          cctx.restore();
        });

        frame++;
        if (frame < 80) requestAnimationFrame(runConfetti);
        else cctx.clearRect(0, 0, w, h);
      };
      runConfetti();
    };

    spinBtn.addEventListener('click', spin);
    canvas.addEventListener('click', spin);

    input.addEventListener('input', () => {
      drawWheel();
      const count = getItems().length;
      const countEl = document.getElementById('wheel-count');
      if (countEl) countEl.textContent = `${count} nom(s)`;
    });

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = 'Alice\nBob\nChloé\nDavid\nEmma\nFabien\nGrace\nHugo\nInès\nJulien';
        drawWheel();
        const countEl = document.getElementById('wheel-count');
        if (countEl) countEl.textContent = '10 nom(s)';
      });
    }

    if (removeWinnerBtn) {
      removeWinnerBtn.addEventListener('click', () => {
        if (!lastWinner) return;
        const currentList = getItems();
        const updated = currentList.filter(n => n !== lastWinner);
        input.value = updated.join('\n');
        drawWheel();
        removeWinnerBtn.style.display = 'none';
        UI.toast(`"${lastWinner}" a été retiré de la liste.`, 'info');
      });
    }

    drawWheel();
  }
};

window.WheelTool = WheelTool;
