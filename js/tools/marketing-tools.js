/**
 * Marketing & Social Media Tools
 * 1. Aperçu de balises Meta (Twitter, LinkedIn, Facebook)
 * 2. Générateur de liens UTM pour analytics
 * 3. Créateur de grilles Instagram (3, 6 ou 9 carrés + ZIP)
 * 100% Client-side Vanilla JS
 */

const MarketingTools = {
  init() {
    this.initMetaPreview();
    this.initUtmBuilder();
    this.initInstagramGrid();
  },

  /* ================= 1. APERÇU DE BALISES META ================= */
  initMetaPreview() {
    const titleInput = document.getElementById('meta-title');
    const descInput = document.getElementById('meta-desc');
    const urlInput = document.getElementById('meta-url');
    const imgInput = document.getElementById('meta-img');
    const sampleBtn = document.getElementById('meta-sample-btn');
    const copyHtmlBtn = document.getElementById('meta-copy-html-btn');

    if (!titleInput) return;

    const updatePreview = () => {
      const title = titleInput.value.trim() || 'Titre de la page partagée';
      const desc = descInput.value.trim() || 'Description concise du contenu telle qu\'elle apparaîtra sur les réseaux sociaux.';
      let url = urlInput.value.trim() || 'https://votre-site.com/article';
      const img = imgInput.value.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop';

      let domain = 'votre-site.com';
      try {
        domain = new URL(url).hostname;
      } catch (e) {}

      // Update text in previews
      const setAll = (sel, val) => document.querySelectorAll(sel).forEach(el => el.textContent = val);
      setAll('.social-prev-title', title);
      setAll('.social-prev-desc', desc);
      setAll('.social-prev-domain', domain);

      // Update preview images
      document.querySelectorAll('.social-prev-img').forEach(el => {
        if (el.tagName === 'IMG') el.src = img;
        else el.style.backgroundImage = `url("${img}")`;
      });

      // Update generated HTML code block
      const codeEl = document.getElementById('meta-generated-code');
      if (codeEl) {
        const html = `<!-- Balises Standards & Référencement -->
<title>${title}</title>
<meta name="description" content="${desc}">

<!-- Open Graph (Facebook, LinkedIn, Discord) -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${img}">

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${url}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${img}">`;
        codeEl.textContent = html;
      }
    };

    [titleInput, descInput, urlInput, imgInput].forEach(inp => inp?.addEventListener('input', updatePreview));

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        titleInput.value = 'ToolSuite — Suite Complète de 30 Outils Web 100% Locaux';
        descInput.value = 'Manipulez vos PDF, compressez vos images, calculez vos devises et testez vos expressions régulières en direct sans aucun serveur.';
        urlInput.value = 'https://toolsuite.dev/tools';
        imgInput.value = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop';
        updatePreview();
      });
    }

    if (copyHtmlBtn) {
      copyHtmlBtn.addEventListener('click', () => {
        const codeEl = document.getElementById('meta-generated-code');
        if (codeEl) {
          UI.copy(codeEl.textContent, copyHtmlBtn, 'Balises HTML copiées !');
        }
      });
    }

    updatePreview();
  },

  /* ================= 2. GÉNÉRATEUR DE LIENS UTM ================= */
  initUtmBuilder() {
    const baseInput = document.getElementById('utm-base-url');
    const sourceInput = document.getElementById('utm-source');
    const mediumInput = document.getElementById('utm-medium');
    const campaignInput = document.getElementById('utm-campaign');
    const termInput = document.getElementById('utm-term');
    const contentInput = document.getElementById('utm-content');
    const outputEl = document.getElementById('utm-output-url');
    const copyBtn = document.getElementById('utm-copy-btn');
    const sampleBtn = document.getElementById('utm-sample-btn');

    if (!baseInput || !outputEl) return;

    const generateUrl = () => {
      let rawBase = baseInput.value.trim();
      if (!rawBase) {
        outputEl.value = '';
        return;
      }

      if (!rawBase.startsWith('http://') && !rawBase.startsWith('https://')) {
        rawBase = 'https://' + rawBase;
      }

      try {
        const url = new URL(rawBase);
        const setParam = (key, val) => {
          if (val && val.trim()) url.searchParams.set(key, val.trim());
          else url.searchParams.delete(key);
        };

        setParam('utm_source', sourceInput?.value);
        setParam('utm_medium', mediumInput?.value);
        setParam('utm_campaign', campaignInput?.value);
        setParam('utm_term', termInput?.value);
        setParam('utm_content', contentInput?.value);

        outputEl.value = url.toString();
      } catch (e) {
        outputEl.value = 'URL invalide';
      }
    };

    [baseInput, sourceInput, mediumInput, campaignInput, termInput, contentInput].forEach(inp => {
      inp?.addEventListener('input', generateUrl);
    });

    // Quick tag buttons for source and medium
    document.querySelectorAll('.utm-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const targetId = pill.getAttribute('data-target');
        const val = pill.getAttribute('data-val');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.value = val;
          generateUrl();
        }
      });
    });

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        baseInput.value = 'https://mon-entreprise.com/lancement-produit';
        sourceInput.value = 'linkedin';
        mediumInput.value = 'cpc';
        campaignInput.value = 'promo_printemps_2026';
        termInput.value = 'outil_productivite';
        contentInput.value = 'banniere_bleue';
        generateUrl();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!outputEl.value || outputEl.value === 'URL invalide') {
          UI.toast('Aucune URL UTM valide à copier.', 'warning');
          return;
        }
        UI.copy(outputEl.value, copyBtn, 'Lien UTM copié !');
      });
    }

    generateUrl();
  },

  /* ================= 3. CRÉATEUR DE GRILLES INSTAGRAM ================= */
  initInstagramGrid() {
    const layoutSelect = document.getElementById('insta-layout');
    const container = document.getElementById('insta-grid-tiles');
    const downloadZipBtn = document.getElementById('insta-download-zip-btn');
    const sampleBtn = document.getElementById('insta-sample-btn');

    if (!layoutSelect || !container) return;

    let currentImg = null;
    let croppedTiles = []; // Array of { blob, dataUrl, order, col, row }

    const processImage = (img) => {
      currentImg = img;
      const count = parseInt(layoutSelect.value, 10) || 9; // 3, 6 or 9
      const cols = 3;
      const rows = count / cols; // 1, 2 or 3

      container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      container.innerHTML = '';
      croppedTiles = [];

      // Calculate square size based on image width
      const tileSize = Math.floor(img.width / cols);
      const totalWidth = tileSize * cols;
      const totalHeight = tileSize * rows;

      // Center crop vertically if image is taller, or take top
      const offsetY = Math.max(0, Math.floor((img.height - totalHeight) / 2));

      let tileIdx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          tileIdx++;
          // Order for Instagram publishing:
          // Instagram displays new posts at top-left. So post 1 must be BOTTOM-RIGHT!
          const instaPublishOrder = count - tileIdx + 1;

          const canvas = document.createElement('canvas');
          canvas.width = tileSize;
          canvas.height = tileSize;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(
            img,
            c * tileSize, offsetY + r * tileSize, tileSize, tileSize,
            0, 0, tileSize, tileSize
          );

          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

          const tileEl = document.createElement('div');
          tileEl.className = 'insta-tile';
          tileEl.title = `Carré #${instaPublishOrder} (Cliquez pour télécharger individuellement)`;
          tileEl.innerHTML = `
            <img src="${dataUrl}" alt="Carré ${instaPublishOrder}">
            <span class="insta-badge-order">#${instaPublishOrder}</span>
          `;

          // Download single tile on click
          tileEl.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `insta_post_${instaPublishOrder.toString().padStart(2, '0')}.jpg`;
            link.href = dataUrl;
            link.click();
            UI.toast(`Image #${instaPublishOrder} téléchargée !`, 'success');
          });

          container.appendChild(tileEl);

          canvas.toBlob((blob) => {
            croppedTiles.push({
              blob,
              order: instaPublishOrder,
              filename: `insta_post_${instaPublishOrder.toString().padStart(2, '0')}.jpg`
            });
          }, 'image/jpeg', 0.95);
        }
      }

      document.getElementById('insta-workspace').style.display = 'block';
      UI.toast(`Image découpée en ${count} carrés parfaits !`, 'success');
    };

    UI.setupDropzone('insta-dropzone', 'insta-input', (file) => {
      if (!file.type.startsWith('image/')) {
        UI.toast('Veuillez déposer une image valide.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    layoutSelect.addEventListener('change', () => {
      if (currentImg) processImage(currentImg);
    });

    // Sample image generator
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');

        // Draw geometric artwork
        const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#3b82f6');
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1200);

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 10;
        for (let i = 100; i < 1200; i += 150) {
          ctx.beginPath();
          ctx.arc(600, 600, i / 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TOOLSUITE 2026', 600, 580);
        ctx.font = '36px sans-serif';
        ctx.fillText('Grille Instagram Parfaite', 600, 640);

        const img = new Image();
        img.onload = () => processImage(img);
        img.src = canvas.toDataURL('image/jpeg');
      });
    }

    // ZIP Export using JSZip
    if (downloadZipBtn) {
      downloadZipBtn.addEventListener('click', async () => {
        if (!croppedTiles.length || typeof JSZip === 'undefined') {
          UI.toast('Erreur lors de la création de l\'archive ZIP.', 'error');
          return;
        }

        downloadZipBtn.disabled = true;
        downloadZipBtn.textContent = 'Création du ZIP...';

        try {
          const zip = new JSZip();
          croppedTiles.sort((a, b) => a.order - b.order);

          croppedTiles.forEach(tile => {
            zip.file(tile.filename, tile.blob);
          });

          // Add a instructions text file
          zip.file('ORDRE_DE_PUBLICATION.txt', `Ordre de publication pour votre grille Instagram :
Postez les images dans l'ordre croissant de leurs noms :
- insta_post_01.jpg en premier
- insta_post_02.jpg en deuxième
...
L'image finale se reconstituera parfaitement sur votre profil Instagram !`);

          const content = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = `instagram_grid_${croppedTiles.length}_photos.zip`;
          link.click();
          UI.toast('Archive ZIP téléchargée avec succès !', 'success');
        } catch (err) {
          console.error(err);
          UI.toast('Erreur de génération ZIP.', 'error');
        } finally {
          downloadZipBtn.disabled = false;
          downloadZipBtn.textContent = '📦 Télécharger tous les carrés (ZIP)';
        }
      });
    }
  }
};

window.MarketingTools = MarketingTools;
