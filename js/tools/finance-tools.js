/**
 * Finance & Fast Calculations Tools
 * 1. Calculateur de pourcentages (4 modes)
 * 2. Partage d'addition (Split Bill & pourboires)
 * 3. Simulateur d'intérêts composés + Graphique Canvas
 * 100% Client-side Vanilla JS
 */

const FinanceTools = {
  init() {
    this.initPercentageCalculator();
    this.initSplitBill();
    this.initCompoundInterest();
  },

  /* ================= 1. CALCULATEUR DE POURCENTAGES ================= */
  initPercentageCalculator() {
    // Mode 1: X% of Y
    const p1X = document.getElementById('pct-1-x');
    const p1Y = document.getElementById('pct-1-y');
    const p1Res = document.getElementById('pct-1-res');

    const calc1 = () => {
      const x = parseFloat(p1X?.value) || 0;
      const y = parseFloat(p1Y?.value) || 0;
      const res = (x / 100) * y;
      if (p1Res) p1Res.textContent = Number.isInteger(res) ? res : res.toFixed(2);
    };
    p1X?.addEventListener('input', calc1);
    p1Y?.addEventListener('input', calc1);

    // Mode 2: X is what % of Y?
    const p2X = document.getElementById('pct-2-x');
    const p2Y = document.getElementById('pct-2-y');
    const p2Res = document.getElementById('pct-2-res');

    const calc2 = () => {
      const x = parseFloat(p2X?.value) || 0;
      const y = parseFloat(p2Y?.value) || 0;
      const res = y !== 0 ? (x / y) * 100 : 0;
      if (p2Res) p2Res.textContent = res.toFixed(2) + ' %';
    };
    p2X?.addEventListener('input', calc2);
    p2Y?.addEventListener('input', calc2);

    // Mode 3: % Change from A to B
    const p3A = document.getElementById('pct-3-a');
    const p3B = document.getElementById('pct-3-b');
    const p3Res = document.getElementById('pct-3-res');

    const calc3 = () => {
      const a = parseFloat(p3A?.value) || 0;
      const b = parseFloat(p3B?.value) || 0;
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
    const p4Val = document.getElementById('pct-4-val');
    const p4Pct = document.getElementById('pct-4-pct');
    const p4Type = document.getElementById('pct-4-type'); // 'remise' or 'taxe'
    const p4Res = document.getElementById('pct-4-res');

    const calc4 = () => {
      const val = parseFloat(p4Val?.value) || 0;
      const pct = parseFloat(p4Pct?.value) || 0;
      const type = p4Type?.value || 'remise';
      const factor = type === 'remise' ? (1 - pct / 100) : (1 + pct / 100);
      const res = val * factor;
      if (p4Res) p4Res.textContent = `${res.toFixed(2)} €`;
    };
    p4Val?.addEventListener('input', calc4);
    p4Pct?.addEventListener('input', calc4);
    p4Type?.addEventListener('change', calc4);

    // Initial calculations
    calc1();
    calc2();
    calc3();
    calc4();
  },

  /* ================= 2. PARTAGE D'ADDITION (SPLIT BILL) ================= */
  initSplitBill() {
    const totalInput = document.getElementById('split-total');
    const peopleInput = document.getElementById('split-people');
    const customTipInput = document.getElementById('split-custom-tip');
    const tipBtns = document.querySelectorAll('.split-tip-btn');
    const copySummaryBtn = document.getElementById('split-copy-summary');

    if (!totalInput || !peopleInput) return;

    let selectedTipPercent = 10;

    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTipPercent = parseFloat(btn.getAttribute('data-tip')) || 0;
        if (customTipInput) customTipInput.value = '';
        updateSplit();
      });
    });

    if (customTipInput) {
      customTipInput.addEventListener('input', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        selectedTipPercent = parseFloat(customTipInput.value) || 0;
        updateSplit();
      });
    }

    const updateSplit = () => {
      const bill = parseFloat(totalInput.value) || 0;
      const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
      const tipAmount = bill * (selectedTipPercent / 100);
      const grandTotal = bill + tipAmount;
      const perPerson = grandTotal / people;

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

    if (copySummaryBtn) {
      copySummaryBtn.addEventListener('click', () => {
        const bill = parseFloat(totalInput.value) || 0;
        const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
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
  initCompoundInterest() {
    const initialInput = document.getElementById('ci-initial');
    const monthlyInput = document.getElementById('ci-monthly');
    const rateInput = document.getElementById('ci-rate');
    const yearsInput = document.getElementById('ci-years');
    const calcBtn = document.getElementById('ci-calc-btn');
    const canvas = document.getElementById('ci-chart-canvas');

    if (!calcBtn || !canvas) return;

    const runSimulation = () => {
      const P = parseFloat(initialInput?.value) || 0; // Capital initial
      const PMT = parseFloat(monthlyInput?.value) || 0; // Versement mensuel
      const r = (parseFloat(rateInput?.value) || 0) / 100; // Taux annuel
      const years = Math.min(50, Math.max(1, parseInt(yearsInput?.value, 10) || 10));

      const yearlyData = [];
      let totalBalance = P;
      let totalInvested = P;

      yearlyData.push({ year: 0, invested: totalInvested, balance: totalBalance, interest: 0 });

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

      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setT('ci-res-invested', `${finalState.invested.toLocaleString()} €`);
      setT('ci-res-interest', `+${finalState.interest.toLocaleString()} €`);
      setT('ci-res-total', `${finalState.balance.toLocaleString()} €`);

      // Draw Chart on Canvas
      drawChart(yearlyData);
    };

    const drawChart = (data) => {
      const ctx = canvas.getContext('2d');
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

      const maxVal = Math.max(...data.map(d => d.balance)) * 1.05;
      const minVal = 0;

      // Draw grid lines
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

      // Points helper
      const getX = (idx) => padLeft + (idx / (data.length - 1)) * plotW;
      const getY = (val) => padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

      // Draw Invested Area (Subtle slate)
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(0));
      data.forEach((d, idx) => ctx.lineTo(getX(idx), getY(d.invested)));
      ctx.lineTo(getX(data.length - 1), getY(0));
      ctx.closePath();
      ctx.fillStyle = 'rgba(100, 116, 139, 0.25)';
      ctx.fill();

      // Draw Total Balance Area (Soft Green)
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(0));
      data.forEach((d, idx) => ctx.lineTo(getX(idx), getY(d.balance)));
      ctx.lineTo(getX(data.length - 1), getY(0));
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fill();

      // Draw Total Line
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

      // Draw Invested Line
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
      ctx.setLineDash([]);

      // Draw X-axis labels
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      const step = Math.ceil(data.length / 6);
      for (let i = 0; i < data.length; i += step) {
        ctx.fillText(`An ${data[i].year}`, getX(i), h - 12);
      }
    };

    calcBtn.addEventListener('click', runSimulation);

    // Run on initial load
    setTimeout(runSimulation, 200);
  }
};

window.FinanceTools = FinanceTools;
