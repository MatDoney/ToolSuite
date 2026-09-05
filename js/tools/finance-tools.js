/**
 * @file finance-tools.js
 * @description Suite d'outils financiers et de calculs rapides 100% exécutés côté client (Vanilla JS).
 * Comprend un calculateur de pourcentages polyvalent (4 modes distincts), un gestionnaire de
 * partage d'addition avec calcul de pourboires (Split Bill), et un simulateur d'intérêts composés
 * avec projection graphique dynamique via l'API HTML5 Canvas.
 * @module FinanceTools
 */

/**
 * @typedef {Object} CompoundInterestPoint
 * @property {number} year - Année de la projection (0 = état initial).
 * @property {number} invested - Montant cumulé des versements réels effectués en euros.
 * @property {number} balance - Solde total accumulé (capital + intérêts composés réinvestis).
 * @property {number} interest - Plus-value globale brute générée en intérêts.
 */

/**
 * Espace de nom principal regroupant les fonctionnalités financières et arithmétiques.
 * @namespace FinanceTools
 */
const FinanceTools = {
  /**
   * Initialise l'ensemble des modules de calculs financiers au chargement de l'application.
   * Attache les écouteurs d'événements et lance les premiers calculs d'exemple.
   * @function init
   * @memberof FinanceTools
   * @returns {void}
   */
  init() {
    this.initPercentageCalculator();
    this.initSplitBill();
    this.initCompoundInterest();
  },

  /* ================= 1. CALCULATEUR DE POURCENTAGES ================= */
  /**
   * Initialise les 4 calculateurs de pourcentages interactifs en temps réel :
   * 1. Calcul d'une fraction : Que vaut X% de Y ?
   * 2. Calcul d'une proportion : Quel pourcentage représente X par rapport à Y ?
   * 3. Variation relative : Taux d'évolution en pourcentage de la valeur A vers la valeur B.
   * 4. Application commerciale : Valeur finale après remise ou taxe/TVA.
   * @function initPercentageCalculator
   * @memberof FinanceTools
   * @returns {void}
   */
  initPercentageCalculator() {
    // Mode 1: X% of Y
    const p1X = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-1-x'));
    const p1Y = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-1-y'));
    const p1Res = document.getElementById('pct-1-res');

    /**
     * Calcule la valeur absolue correspondant à X pourcent de Y.
     * @inner
     */
    const calc1 = () => {
      const x = parseFloat(p1X?.value || '0') || 0;
      const y = parseFloat(p1Y?.value || '0') || 0;
      const res = (x / 100) * y;
      if (p1Res) p1Res.textContent = Number.isInteger(res) ? String(res) : res.toFixed(2);
    };
    p1X?.addEventListener('input', calc1);
    p1Y?.addEventListener('input', calc1);

    // Mode 2: X is what % of Y?
    const p2X = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-2-x'));
    const p2Y = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-2-y'));
    const p2Res = document.getElementById('pct-2-res');

    /**
     * Calcule le ratio en pourcentage que représente X sur le total Y.
     * @inner
     */
    const calc2 = () => {
      const x = parseFloat(p2X?.value || '0') || 0;
      const y = parseFloat(p2Y?.value || '0') || 0;
      const res = y !== 0 ? (x / y) * 100 : 0;
      if (p2Res) p2Res.textContent = res.toFixed(2) + ' %';
    };
    p2X?.addEventListener('input', calc2);
    p2Y?.addEventListener('input', calc2);

    // Mode 3: % Change from A to B
    const p3A = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-3-a'));
    const p3B = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-3-b'));
    const p3Res = document.getElementById('pct-3-res');

    /**
     * Calcule la variation relative en pourcentage entre la valeur initiale A et la valeur finale B.
     * Applique une coloration dynamique verte pour une augmentation ou rouge pour une diminution.
     * @inner
     */
    const calc3 = () => {
      const a = parseFloat(p3A?.value || '0') || 0;
      const b = parseFloat(p3B?.value || '0') || 0;
      if (a === 0) {
        if (p3Res) p3Res.textContent = '—';
        return;
      }
      const change = ((b - a) / Math.abs(a)) * 100;
      const sign = change > 0 ? '+' : '';
      if (p3Res) {
        p3Res.textContent = `${sign}${change.toFixed(2)} %`;
        p3Res.style.color = change > 0 ? '#22c55e' : (change < 0 ? '#ef4444' : 'var(--text-primary)');
      }
    };
    p3A?.addEventListener('input', calc3);
    p3B?.addEventListener('input', calc3);

    // Mode 4: Value after discount/tax
    const p4Val = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-4-val'));
    const p4Pct = /** @type {HTMLInputElement|null} */ (document.getElementById('pct-4-pct'));
    const p4Type = /** @type {HTMLSelectElement|null} */ (document.getElementById('pct-4-type')); // 'remise' or 'taxe'
    const p4Res = document.getElementById('pct-4-res');

    /**
     * Calcule le prix final résultant de l'application d'une remise ou d'une majoration fiscale.
     * @inner
     */
    const calc4 = () => {
      const val = parseFloat(p4Val?.value || '0') || 0;
      const pct = parseFloat(p4Pct?.value || '0') || 0;
      const type = p4Type?.value || 'remise';
      const factor = type === 'remise' ? (1 - pct / 100) : (1 + pct / 100);
      const res = val * factor;
      if (p4Res) p4Res.textContent = `${res.toFixed(2)} €`;
    };
    p4Val?.addEventListener('input', calc4);
    p4Pct?.addEventListener('input', calc4);
    p4Type?.addEventListener('change', calc4);

    // Exécution des calculs initiaux avec les valeurs pré-remplies
    calc1();
    calc2();
    calc3();
    calc4();
  },

  /* ================= 2. PARTAGE D'ADDITION (SPLIT BILL) ================= */
  /**
   * Initialise le gestionnaire de partage de note et de calcul de pourboires.
   * Calcule instantanément le montant du pourboire, le total général et la quote-part par convive.
   * Permet la copie presse-papiers d'un récapitulatif formaté prêt pour messagerie instantanée.
   * @function initSplitBill
   * @memberof FinanceTools
   * @returns {void}
   */
  initSplitBill() {
    const totalInput = /** @type {HTMLInputElement|null} */ (document.getElementById('split-total'));
    const peopleInput = /** @type {HTMLInputElement|null} */ (document.getElementById('split-people'));
    const customTipInput = /** @type {HTMLInputElement|null} */ (document.getElementById('split-custom-tip'));
    const tipBtns = document.querySelectorAll('.split-tip-btn');
    const copySummaryBtn = document.getElementById('split-copy-summary');

    if (!totalInput || !peopleInput) return;

    /** @type {number} Pourcentage de pourboire sélectionné par défaut */
    let selectedTipPercent = 10;

    // Gestion des boutons de raccourci de pourboire (0%, 5%, 10%, 15%, 20%)
    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTipPercent = parseFloat(btn.getAttribute('data-tip') || '0') || 0;
        if (customTipInput) customTipInput.value = '';
        updateSplit();
      });
    });

    // Gestion du champ de pourboire personnalisé libre
    if (customTipInput) {
      customTipInput.addEventListener('input', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        selectedTipPercent = parseFloat(customTipInput.value || '0') || 0;
        updateSplit();
      });
    }

    /**
     * Recalcule la répartition financière et met à jour le DOM.
     * @inner
     */
    const updateSplit = () => {
      const bill = parseFloat(totalInput.value || '0') || 0;
      const people = Math.max(1, parseInt(peopleInput.value || '1', 10) || 1);
      const tipAmount = bill * (selectedTipPercent / 100);
      const grandTotal = bill + tipAmount;
      const perPerson = grandTotal / people;

      /**
       * Assigne le texte formaté à un élément cible identifié par son ID.
       * @param {string} id - Identifiant de l'élément HTML.
       * @param {string} val - Chaîne de caractères à injecter.
       */
      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setT('split-res-tip-amount', `${tipAmount.toFixed(2)} €`);
      setT('split-res-grand-total', `${grandTotal.toFixed(2)} €`);
      setT('split-res-per-person', `${perPerson.toFixed(2)} €`);
    };

    totalInput.addEventListener('input', updateSplit);
    peopleInput.addEventListener('input', updateSplit);

    // Bouton de copie du récapitulatif pour envoi par SMS / WhatsApp / etc.
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener('click', () => {
        const bill = parseFloat(totalInput.value || '0') || 0;
        const people = Math.max(1, parseInt(peopleInput.value || '1', 10) || 1);
        const tipAmount = bill * (selectedTipPercent / 100);
        const grandTotal = bill + tipAmount;
        const perPerson = grandTotal / people;

        const text = `🧾 Partage d'addition :\n• Total initial : ${bill.toFixed(2)} €\n• Pourboire (${selectedTipPercent}%) : ${tipAmount.toFixed(2)} €\n• Total à payer : ${grandTotal.toFixed(2)} €\n👉 À payer par personne (${people} pers.) : ${perPerson.toFixed(2)} €`;
        UI.copy(text, copySummaryBtn, 'Récapitulatif copié !');
      });
    }

    updateSplit();
  },

  /* ================= 3. INTÉRÊTS COMPOSÉS ================= */
  /**
   * Initialise le simulateur d'épargne et d'intérêts composés avec projection graphique sur Canvas.
   * Modélise la capitalisation mensuelle des versements programmés et le réinvestissement continu des gains.
   * @function initCompoundInterest
   * @memberof FinanceTools
   * @returns {void}
   */
  initCompoundInterest() {
    const initialInput = /** @type {HTMLInputElement|null} */ (document.getElementById('ci-initial'));
    const monthlyInput = /** @type {HTMLInputElement|null} */ (document.getElementById('ci-monthly'));
    const rateInput = /** @type {HTMLInputElement|null} */ (document.getElementById('ci-rate'));
    const yearsInput = /** @type {HTMLInputElement|null} */ (document.getElementById('ci-years'));
    const calcBtn = document.getElementById('ci-calc-btn');
    const canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById('ci-chart-canvas'));

    if (!calcBtn || !canvas) return;

    /**
     * Exécute le calcul itératif mois par mois de l'évolution du capital et des intérêts.
     * Met à jour les indicateurs chiffrés et déclenche le rendu vectoriel du graphique.
     * @inner
     */
    const runSimulation = () => {
      const P = parseFloat(initialInput?.value || '0') || 0; // Capital initial déposé
      const PMT = parseFloat(monthlyInput?.value || '0') || 0; // Versement mensuel programmé
      const r = (parseFloat(rateInput?.value || '0') || 0) / 100; // Taux de rendement annuel exprimé en décimal
      const years = Math.min(50, Math.max(1, parseInt(yearsInput?.value || '10', 10) || 10)); // Durée d'investissement

      /** @type {CompoundInterestPoint[]} */
      const yearlyData = [];
      let totalBalance = P;
      let totalInvested = P;

      // Année 0 : investissement initial
      yearlyData.push({ year: 0, invested: totalInvested, balance: totalBalance, interest: 0 });

      // Boucle annuelle avec composition mensuelle des intérêts
      for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) {
          totalBalance += PMT;
          totalInvested += PMT;
          totalBalance += totalBalance * (r / 12);
        }
        const totalInterest = Math.max(0, totalBalance - totalInvested);
        yearlyData.push({
          year: y,
          invested: Math.round(totalInvested),
          balance: Math.round(totalBalance),
          interest: Math.round(totalInterest)
        });
      }

      const finalState = yearlyData[yearlyData.length - 1];

      /**
       * Met à jour le texte d'un élément d'affichage.
       * @param {string} id - Sélecteur de l'élément cible.
       * @param {string} val - Texte formaté avec séparateurs de milliers.
       */
      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setT('ci-res-invested', `${finalState.invested.toLocaleString()} €`);
      setT('ci-res-interest', `+${finalState.interest.toLocaleString()} €`);
      setT('ci-res-total', `${finalState.balance.toLocaleString()} €`);

      // Dessiner le graphique Canvas 2D
      drawChart(yearlyData);
    };

    /**
     * Effectue le rendu graphique haute fidélité (compatible écrans Retina HiDPI) sur l'élément Canvas.
     * Trace la grille des montants, l'aire des versements cumulés et l'aire d'amplification des intérêts.
     * @inner
     * @param {CompoundInterestPoint[]} data - Tableau chronologique des données simulées.
     */
    const drawChart = (data) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = 280 * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = 280;
      const padLeft = 65;
      const padBottom = 35;
      const padTop = 20;
      const padRight = 20;
      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      ctx.clearRect(0, 0, w, h);

      // Calcul de l'échelle verticale maximale avec une marge visuelle de 5%
      const maxVal = Math.max(...data.map(d => d.balance)) * 1.05;
      const minVal = 0;

      // 1. Dessin des lignes de grille horizontales et ordonnées monétaires
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#888';
      ctx.font = '11px sans-serif';

      const gridLines = 4;
      for (let i = 0; i <= gridLines; i++) {
        const val = minVal + (maxVal - minVal) * (i / gridLines);
        const y = padTop + plotH - (i / gridLines) * plotH;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - padRight, y);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(val / 1000)}k €`, padLeft - 8, y + 4);
      }

      /**
       * Mappe l'index chronologique en coordonnée X sur le canvas.
       * @param {number} idx - Index de l'année dans le tableau.
       * @returns {number} Coordonnée X en pixels.
       */
      const getX = (idx) => padLeft + (idx / (data.length - 1)) * plotW;

      /**
       * Mappe un montant monétaire en ordonnée Y sur le canvas.
       * @param {number} val - Montant en euros.
       * @returns {number} Coordonnée Y en pixels.
       */
      const getY = (val) => padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

      // 2. Remplissage de l'aire des versements réels (gris ardoise subtil)
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(0));
      data.forEach((d, idx) => ctx.lineTo(getX(idx), getY(d.invested)));
      ctx.lineTo(getX(data.length - 1), getY(0));
      ctx.closePath();
      ctx.fillStyle = 'rgba(100, 116, 139, 0.25)';
      ctx.fill();

      // 3. Remplissage de l'aire de capitalisation totale (vert émeraude translucide)
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(0));
      data.forEach((d, idx) => ctx.lineTo(getX(idx), getY(d.balance)));
      ctx.lineTo(getX(data.length - 1), getY(0));
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fill();

      // 4. Tracé de la courbe supérieure du solde global
      ctx.beginPath();
      data.forEach((d, idx) => {
        const x = getX(idx);
        const y = getY(d.balance);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 5. Tracé de la ligne en pointillés du capital investi
      ctx.beginPath();
      data.forEach((d, idx) => {
        const x = getX(idx);
        const y = getY(d.invested);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]); // Réinitialisation du style de tirets

      // 6. Écriture des repères temporels sur l'axe horizontal
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      const step = Math.ceil(data.length / 6);
      for (let i = 0; i < data.length; i += step) {
        ctx.fillText(`An ${data[i].year}`, getX(i), h - 12);
      }
    };

    calcBtn.addEventListener('click', runSimulation);

    // Déclenchement automatique de la simulation au chargement initial
    setTimeout(runSimulation, 200);
  }
};

window.FinanceTools = FinanceTools;
