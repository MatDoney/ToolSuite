<?php
/**
 * ToolSuite - Web Application Suite (PHP Entry Point)
 * Modern HTML5/CSS3/Vanilla JS & PHP Application
 */

$is_php_server = true;
$php_version = PHP_VERSION;
$server_software = $_SERVER['SERVER_SOFTWARE'] ?? 'PHP Built-in Server';
$upload_max = ini_get('upload_max_filesize');
?>
<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ToolSuite - Suite d'Outils Web Polyvalente & Moderne (PHP)</title>
  <meta name="description" content="Suite moderne de 15 outils web : manipulation de PDF, OCR, éditeur Markdown, compresseur d'images, favicon, détourage, formateur JSON, testeur Regex, ombres CSS, QR codes et générateur de mots de passe.">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/tools.css">

  <!-- External Libraries (Loaded via CDN - Zero Node/npm required) -->
  <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.9/dist/pdf-lib.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
</head>
<body>

  <div class="app-container">
    
    <!-- Sidebar Navigation -->
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          <h1>ToolSuite</h1>
          <span>15 Outils Web Pro</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div>
          <div class="nav-section-title">Navigation</div>
          <ul class="nav-items">
            <li>
              <a class="nav-link active" data-nav-category="all">
                <span class="icon">🏠</span>
                <span>Tous les outils</span>
                <span class="nav-badge">15</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div class="nav-section-title">Catégories</div>
          <ul class="nav-items">
            <li>
              <a class="nav-link" data-nav-category="doc">
                <span class="icon">📑</span>
                <span>Documents & PDF</span>
                <span class="nav-badge">5</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-category="image">
                <span class="icon">🖼️</span>
                <span>Images & Médias</span>
                <span class="nav-badge">4</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-category="dev">
                <span class="icon">⚙️</span>
                <span>DevTools</span>
                <span class="nav-badge">4</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-category="util">
                <span class="icon">🛠️</span>
                <span>Utilitaires</span>
                <span class="nav-badge">3</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div class="nav-section-title">Accès Rapide</div>
          <ul class="nav-items">
            <li>
              <a class="nav-link" data-nav-tool="tool-pdf-merge">
                <span class="icon">📄</span>
                <span>Fusion de PDF</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-tool="tool-ocr">
                <span class="icon">👁️</span>
                <span>Extracteur OCR</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-tool="tool-img-compress">
                <span class="icon">🗜️</span>
                <span>Compresseur Image</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-tool="tool-bg-remover">
                <span class="icon">🪄</span>
                <span>Suppresseur Fond</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-tool="tool-json-formatter">
                <span class="icon">{ }</span>
                <span>Validateur JSON</span>
              </a>
            </li>
            <li>
              <a class="nav-link" data-nav-tool="tool-qrcode">
                <span class="icon">📱</span>
                <span>QR Codes</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="privacy-badge">
          <span class="privacy-dot"></span>
          <span>100% Local & Sécurisé</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      
      <!-- Top Sticky Header -->
      <header class="top-header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button class="action-icon-btn mobile-menu-btn" id="mobile-menu-btn" title="Menu">☰</button>
          <div class="search-trigger" id="search-trigger-btn">
            <span>🔍</span>
            <span>Rechercher un outil...</span>
            <span class="search-shortcut">Ctrl + K</span>
          </div>
        </div>

        <div class="header-actions">
          <div style="font-size: 0.75rem; color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-full); padding: 0.25rem 0.65rem; font-weight: 600;">
            PHP <?= htmlspecialchars($php_version) ?>
          </div>
          <button class="theme-toggle-btn" id="theme-toggle-btn" title="Bascule mode sombre/clair">☀️</button>
        </div>
      </header>

      <!-- Main Container -->
      <main class="content-container">
        
        <!-- ================= DASHBOARD VIEW ================= -->
        <section id="dashboard-view">
          
          <div class="hero-banner">
            <span class="hero-badge">⚡ Suite Tout-en-un • Traitement Local & Privé</span>
            <h1 class="hero-title">Tous vos outils du quotidien, réunis en un seul endroit.</h1>
            <p class="hero-desc">
              15 outils professionnels pour vos documents, images, code et tâches quotidiennes. 
              Vos données sont traitées directement dans votre navigateur, avec une rapidité instantanée et une confidentialité totale.
            </p>
            <div class="hero-stats">
              <div class="hero-stat-item">
                <span class="hero-stat-number">15</span>
                <span class="hero-stat-label">Outils Disponibles</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-number">100%</span>
                <span class="hero-stat-label">Local & Privé</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-number">0 Ko</span>
                <span class="hero-stat-label">Téléversé sur serveur</span>
              </div>
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div class="category-filter-bar">
            <button class="filter-btn active" data-category="all">⚡ Tous les outils (15)</button>
            <button class="filter-btn" data-category="doc">📑 Documents & PDF (5)</button>
            <button class="filter-btn" data-category="image">🖼️ Images & Médias (4)</button>
            <button class="filter-btn" data-category="dev">⚙️ DevTools (4)</button>
            <button class="filter-btn" data-category="util">🛠️ Utilitaires (3)</button>
          </div>

          <!-- Tools Cards Grid -->
          <div class="tools-grid" id="tools-dashboard-grid">
            <!-- Dynamically populated by App.renderDashboardCards() -->
          </div>
        </section>

        <!-- ================= 1. FUSION DE PDF ================= -->
        <section id="view-tool-pdf-merge" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Documents & PDF</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Fusion de documents PDF</h2>
              <p>Assemblez plusieurs fichiers PDF en un seul document complet. Réorganisez l'ordre avant la fusion.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📂 Sélection des fichiers</span>
                <button class="btn btn-secondary btn-sm" id="pdf-merge-clear-btn">Effacer tout</button>
              </div>
              <div class="pane-body">
                <div class="dropzone" id="pdf-merge-dropzone">
                  <input type="file" id="pdf-merge-input" multiple accept="application/pdf">
                  <div class="dropzone-icon">📑</div>
                  <div class="dropzone-title">Glissez vos fichiers PDF ici</div>
                  <div class="dropzone-subtitle">ou cliquez pour parcourir vos dossiers (sélection multiple)</div>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📋 Ordre des fichiers (<span id="pdf-merge-count">0</span>)</span>
                <button class="btn btn-gradient btn-sm" id="pdf-merge-action-btn" disabled>
                  <span>✨</span> Fusionner en un PDF
                </button>
              </div>
              <div class="pane-body">
                <div class="pdf-file-list" id="pdf-merge-list">
                  <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    Déposez au moins 2 fichiers PDF à gauche pour commencer.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 2. SÉPARATION DE PDF ================= -->
        <section id="view-tool-pdf-split" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Documents & PDF</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Séparation et Extraction de PDF</h2>
              <p>Isolez des pages spécifiques ou découpez votre document en plusieurs extraits.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📂 Document source</span>
              </div>
              <div class="pane-body">
                <div class="dropzone" id="pdf-split-dropzone">
                  <input type="file" id="pdf-split-input" accept="application/pdf">
                  <div class="dropzone-icon">✂️</div>
                  <div class="dropzone-title">Glissez le PDF à découper</div>
                  <div class="dropzone-subtitle">ou cliquez pour sélectionner un fichier</div>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">⚙️ Configuration de l'extraction</span>
              </div>
              <div class="pane-body">
                <div id="pdf-split-config-panel" style="display: none;">
                  <div style="background: var(--border-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
                    <div id="pdf-split-file-name" style="font-weight: 600;">Document.pdf</div>
                    <div id="pdf-split-file-info" style="font-size: 0.82rem; color: var(--text-muted);">0 page(s)</div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="pdf-split-range-input">
                      <span>Plages de pages à extraire</span>
                      <span style="font-size: 0.75rem; color: var(--text-muted);">Total : <strong id="pdf-split-total-pages">0</strong> pages</span>
                    </label>
                    <input type="text" id="pdf-split-range-input" class="form-input font-code" placeholder="Ex: 1-3, 5, 8">
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                      Exemples : <code>1-5</code> (pages 1 à 5), <code>1, 3, 5</code> (pages spécifiques), <code>2-4, 7</code>.
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-primary btn-lg" id="pdf-split-action-btn" style="width: 100%;">
                      Extraire en 1 seul PDF
                    </button>
                    <button class="btn btn-secondary btn-md" id="pdf-split-zip-btn" style="width: 100%;">
                      Extraire chaque page séparément (.ZIP)
                    </button>
                  </div>
                </div>

                <div id="pdf-split-empty-placeholder" class="empty-state" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                  Chargez un PDF à gauche pour afficher les options d'extraction.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 3. COMPRESSEUR DE PDF ================= -->
        <section id="view-tool-pdf-compress" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Documents & PDF</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Compresseur de PDF</h2>
              <p>Optimisez la taille de vos documents PDF sans altérer la clarté du texte.</p>
            </div>
          </div>

          <div style="max-width: 720px; margin: 0 auto;">
            <div class="dropzone" id="pdf-compress-dropzone" style="margin-bottom: 1.5rem;">
              <input type="file" id="pdf-compress-input" accept="application/pdf">
              <div class="dropzone-icon">🗜️</div>
              <div class="dropzone-title">Déposez votre PDF volumineux ici</div>
              <div class="dropzone-subtitle">Traitement 100% sécurisé et direct dans votre navigateur</div>
            </div>

            <div id="pdf-compress-options" style="display: none; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
              <div id="pdf-compress-info" style="margin-bottom: 1.25rem;"></div>

              <button class="btn btn-gradient btn-lg" id="pdf-compress-action-btn" style="width: 100%;">
                <span>⚡</span> Compresser et Optimiser le PDF
              </button>

              <div id="pdf-compress-result" style="display: none; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: center;">
                <div id="pdf-compress-stats" style="margin-bottom: 1rem;"></div>
                <button class="btn btn-primary btn-lg" id="pdf-compress-download-btn">
                  <span>📥</span> Télécharger le PDF Optimisé
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 4. EXTRACTEUR DE TEXTE (OCR) ================= -->
        <section id="view-tool-ocr" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Documents & PDF</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Extracteur de texte OCR</h2>
              <p>Reconnaissance optique de caractères en local via Tesseract.js. Transformez images et scans en texte.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🖼️ Image ou Scan source</span>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <label for="ocr-lang-select" style="font-size: 0.8rem; color: var(--text-muted);">Langue :</label>
                  <select id="ocr-lang-select" class="form-select" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.82rem;">
                    <option value="fra" selected>Français</option>
                    <option value="eng">English</option>
                    <option value="spa">Español</option>
                    <option value="deu">Deutsch</option>
                  </select>
                </div>
              </div>
              <div class="pane-body">
                <div class="dropzone" id="ocr-dropzone">
                  <input type="file" id="ocr-input" accept="image/*">
                  <div class="dropzone-icon">👁️</div>
                  <div class="dropzone-title">Glissez une image ou scan</div>
                  <div class="dropzone-subtitle">PNG, JPG, WebP, BMP</div>
                </div>

                <div id="ocr-preview-wrapper" style="display: none; margin-top: 1.25rem; text-align: center;">
                  <img id="ocr-preview-img" style="max-height: 220px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); object-fit: contain;" alt="Aperçu OCR">
                  <div style="margin-top: 1rem;">
                    <button class="btn btn-gradient btn-lg" id="ocr-start-btn">
                      <span>✨</span> Lancer l'extraction de texte
                    </button>
                  </div>
                </div>

                <div id="ocr-progress-container" style="display: none; margin-top: 1.25rem;">
                  <div id="ocr-progress-status" style="font-size: 0.82rem; color: var(--accent-primary); font-weight: 600;">Initialisation...</div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="ocr-progress-bar"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📝 Texte éditable extrait</span>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" id="ocr-copy-btn">Copier</button>
                  <button class="btn btn-primary btn-sm" id="ocr-download-btn">Télécharger .txt</button>
                </div>
              </div>
              <div class="pane-body">
                <textarea id="ocr-result-text" class="form-textarea" style="flex: 1; height: 100%; min-height: 350px;" placeholder="Le texte extrait de l'image apparaîtra ici..."></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 5. CONVERTISSEUR MARKDOWN ================= -->
        <section id="view-tool-markdown" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Documents & PDF</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Convertisseur et Éditeur Markdown</h2>
              <p>Rendu instantané en temps réel avec export en HTML propre ou impression/export PDF.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">✏️ Éditeur Markdown</span>
              </div>
              <div class="pane-body">
                <textarea id="md-editor-textarea" class="form-textarea font-code" style="flex: 1; min-height: 440px;" placeholder="Tapez votre Markdown ici..."></textarea>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🌐 Prévisualisation HTML</span>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" id="md-copy-html-btn">Copier HTML</button>
                  <button class="btn btn-secondary btn-sm" id="md-download-html-btn">Télécharger HTML</button>
                  <button class="btn btn-primary btn-sm" id="md-export-pdf-btn">Imprimer / PDF</button>
                </div>
              </div>
              <div class="pane-body">
                <div id="md-preview-pane" class="markdown-preview" style="flex: 1; overflow-y: auto;"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 6. CONVERTISSEUR D'IMAGES ================= -->
        <section id="view-tool-img-convert" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Images & Médias</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Convertisseur de formats universel</h2>
              <p>Passez du JPG ou PNG vers le WebP moderne haute performance, SVG, ou BMP.</p>
            </div>
          </div>

          <div style="max-width: 680px; margin: 0 auto;">
            <div class="dropzone" id="img-convert-dropzone">
              <input type="file" id="img-convert-input" accept="image/*">
              <div class="dropzone-icon">🔄</div>
              <div class="dropzone-title">Déposez une image à convertir</div>
              <div class="dropzone-subtitle">JPG, PNG, WebP, BMP, SVG</div>
            </div>

            <div id="img-convert-options" style="display: none; margin-top: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <img id="img-convert-preview" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" alt="Aperçu">
                <div>
                  <div id="img-convert-info" style="font-weight: 600;">image.png</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Prêt pour la conversion</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="img-convert-format-select">Format de destination</label>
                <select id="img-convert-format-select" class="form-select">
                  <option value="webp" selected>WebP (Optimisé pour le web - Recommandé)</option>
                  <option value="png">PNG (Sans perte avec transparence)</option>
                  <option value="jpeg">JPEG (Haute compatibilité)</option>
                  <option value="svg">SVG (Conteneur vectoriel)</option>
                </select>
              </div>

              <button class="btn btn-gradient btn-lg" id="img-convert-action-btn" style="width: 100%; margin-top: 0.5rem;">
                <span>⚡</span> Convertir et Télécharger
              </button>
            </div>
          </div>
        </section>

        <!-- ================= 7. COMPRESSEUR D'IMAGES ================= -->
        <section id="view-tool-img-compress" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Images & Médias</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Compresseur d'images intelligent</h2>
              <p>Réduisez le poids de vos images jusqu'à 85% sans perte de qualité visible.</p>
            </div>
          </div>

          <div class="dropzone" id="img-compress-dropzone" style="margin-bottom: 2rem;">
            <input type="file" id="img-compress-input" accept="image/*">
            <div class="dropzone-icon">⚡</div>
            <div class="dropzone-title">Glissez une image à compresser</div>
            <div class="dropzone-subtitle">JPG, PNG, WebP</div>
          </div>

          <div id="img-compress-workspace" style="display: none;">
            
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                <div class="slider-group">
                  <div class="slider-header">
                    <span>Qualité de compression</span>
                    <span class="slider-val-badge" id="img-compress-quality-val">80%</span>
                  </div>
                  <input type="range" id="img-compress-quality-slider" min="5" max="100" value="80">
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" for="img-compress-scale-select">Redimensionner</label>
                  <select id="img-compress-scale-select" class="form-select">
                    <option value="1" selected>Taille originale (100%)</option>
                    <option value="0.75">Échelle 75%</option>
                    <option value="0.5">Échelle 50% (Moitié)</option>
                    <option value="0.25">Échelle 25% (Vignette)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Side by side comparison -->
            <div class="comparison-container">
              <div class="comparison-box">
                <h4 style="margin-bottom: 0.5rem;">Originale</h4>
                <div class="comparison-img-wrapper">
                  <img id="img-compress-orig-img" alt="Originale">
                </div>
                <div id="img-compress-orig-info" style="font-size: 0.85rem; color: var(--text-muted);"></div>
              </div>

              <div class="comparison-box">
                <h4 style="margin-bottom: 0.5rem;">Compressée (WebP)</h4>
                <div class="comparison-img-wrapper">
                  <img id="img-compress-comp-img" alt="Compressée">
                </div>
                <div id="img-compress-comp-info" style="font-size: 0.85rem; color: var(--text-primary); font-weight: 600;"></div>
                <div id="img-compress-savings" class="saving-badge">Calcul en cours...</div>
                <button class="btn btn-primary btn-md" id="img-compress-download-btn" style="margin-top: 1rem; width: 100%;">
                  <span>📥</span> Télécharger l'image compressée
                </button>
              </div>
            </div>

          </div>
        </section>

        <!-- ================= 8. GÉNÉRATEUR DE FAVICON ================= -->
        <section id="view-tool-favicon" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Images & Médias</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Générateur de Favicon complet</h2>
              <p>Créez instantanément toutes les tailles d'icônes (16, 32, 48, 180, 192, 512px) et téléchargez le pack ZIP.</p>
            </div>
          </div>

          <div class="dropzone" id="favicon-dropzone" style="margin-bottom: 1.5rem;">
            <input type="file" id="favicon-input" accept="image/*">
            <div class="dropzone-icon">⭐</div>
            <div class="dropzone-title">Déposez votre logo ou icône haute résolution</div>
            <div class="dropzone-subtitle">PNG ou SVG carré de préférence (min 512x512px)</div>
          </div>

          <div id="favicon-workspace" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.1rem; font-weight: 700;">Déclinaisons générées</h3>
              <button class="btn btn-gradient btn-md" id="favicon-download-zip-btn">
                <span>📦</span> Télécharger le Pack Favicon (.ZIP)
              </button>
            </div>

            <!-- Favicons Grid -->
            <div class="favicon-grid" id="favicon-grid"></div>

            <div class="form-group" style="margin-top: 1.5rem;">
              <label class="form-label" for="favicon-head-snippet">
                <span>Code HTML à copier dans votre &lt;head&gt;</span>
                <button class="btn btn-secondary btn-sm" id="favicon-copy-head-btn">Copier le code</button>
              </label>
              <textarea id="favicon-head-snippet" class="form-textarea font-code" readonly style="height: 120px;"></textarea>
            </div>
          </div>
        </section>

        <!-- ================= 9. SUPPRESSEUR D'ARRIÈRE-PLAN ================= -->
        <section id="view-tool-bg-remover" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Images & Médias</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Suppresseur d'arrière-plan & Détourage</h2>
              <p>Supprimez le fond de vos photos avec la baguette magique, le détourage automatique et le pinceau de retouche.</p>
            </div>
          </div>

          <div class="dropzone" id="bg-remover-dropzone" style="margin-bottom: 1.5rem;">
            <input type="file" id="bg-remover-input" accept="image/*">
            <div class="dropzone-icon">🪄</div>
            <div class="dropzone-title">Déposez l'image à détourer</div>
            <div class="dropzone-subtitle">Cliquez ensuite sur le fond pour l'effacer instantanément</div>
          </div>

          <div id="bg-remover-workspace" style="display: none;" class="bg-remover-workspace">
            
            <div class="canvas-toolbar">
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-sm" id="bg-mode-wand-btn">🪄 Baguette magique</button>
                <button class="btn btn-secondary btn-sm" id="bg-mode-eraser-btn">🧹 Gomme manuelle</button>
                <button class="btn btn-secondary btn-sm" id="bg-mode-restore-btn">🖌️ Pinceau Restaurer</button>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto;">
                <button class="btn btn-secondary btn-sm" id="bg-auto-remove-btn" title="Supprime automatiquement la couleur des 4 coins">⚡ Détection auto des coins</button>
                <button class="btn btn-secondary btn-sm" id="bg-reset-btn">Réinitialiser</button>
                <button class="btn btn-gradient btn-sm" id="bg-download-btn">📥 Télécharger PNG transparent</button>
              </div>
            </div>

            <div style="display: flex; gap: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem 1.25rem;">
              <div class="slider-group" style="flex: 1;">
                <div class="slider-header">
                  <span>Tolérance couleur</span>
                  <span class="slider-val-badge" id="bg-tolerance-val">30%</span>
                </div>
                <input type="range" id="bg-tolerance-slider" min="1" max="90" value="30">
              </div>

              <div class="slider-group" id="bg-brush-controls-group" style="flex: 1; display: none;">
                <div class="slider-header">
                  <span>Taille du pinceau</span>
                  <span class="slider-val-badge" id="bg-brush-size-val">25px</span>
                </div>
                <input type="range" id="bg-brush-size-slider" min="5" max="120" value="25">
              </div>
            </div>

            <!-- Canvas display with transparency grid -->
            <div class="canvas-editor-wrapper transparency-grid">
              <canvas id="bg-remover-canvas"></canvas>
            </div>
          </div>
        </section>

        <!-- ================= 10. FORMATEUR JSON ================= -->
        <section id="view-tool-json-formatter" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">DevTools</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Formateur et Validateur JSON</h2>
              <p>Indentez, nettoyez, minifiez et explorez vos structures JSON avec validation syntaxique exacte.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📝 Données JSON</span>
                <span id="json-status-badge" style="font-size: 0.8rem; font-weight: 600;"></span>
              </div>
              <div class="pane-body">
                <textarea id="json-input-textarea" class="form-textarea font-code" style="flex: 1; min-height: 400px;" placeholder="Collez votre JSON ici..."></textarea>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                  <button class="btn btn-primary btn-sm" id="json-format-2-btn">Formater (2 espaces)</button>
                  <button class="btn btn-secondary btn-sm" id="json-format-4-btn">Formater (4 espaces)</button>
                  <button class="btn btn-secondary btn-sm" id="json-minify-btn">Minifier (1 ligne)</button>
                  <button class="btn btn-secondary btn-sm" id="json-copy-btn">Copier</button>
                  <button class="btn btn-secondary btn-sm" id="json-download-btn">Télécharger .json</button>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🌳 Arborescence colorisée</span>
              </div>
              <div class="pane-body">
                <div id="json-tree-view" class="json-tree-container" style="flex: 1; overflow-y: auto; background: var(--bg-input); padding: 1rem; border-radius: var(--radius-sm);"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 11. TESTEUR REGEX ================= -->
        <section id="view-tool-regex-tester" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">DevTools</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Testeur d'expressions régulières (Regex)</h2>
              <p>Testez visuellement vos regex avec surlignage temps réel et tableau des groupes de capture.</p>
            </div>
          </div>

          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
            <div class="form-group">
              <label class="form-label" for="regex-pattern-input">
                <span>Expression régulière (Pattern)</span>
                <span id="regex-match-count" class="slider-val-badge">0 correspondance</span>
              </label>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent-primary);">/</span>
                <input type="text" id="regex-pattern-input" class="form-input font-code" value="([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})">
                <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent-primary);">/</span>
              </div>
            </div>

            <div style="display: flex; gap: 1.5rem; align-items: center; margin-top: 0.75rem;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">Flags :</span>
              <label class="switch-label"><input type="checkbox" id="regex-flag-g" checked> <span>g (Global)</span></label>
              <label class="switch-label"><input type="checkbox" id="regex-flag-i"> <span>i (Insensible à la casse)</span></label>
              <label class="switch-label"><input type="checkbox" id="regex-flag-m"> <span>m (Multiligne)</span></label>
              <label class="switch-label"><input type="checkbox" id="regex-flag-s"> <span>s (DotAll)</span></label>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📄 Texte à tester (Surlignage en direct)</span>
              </div>
              <div class="pane-body">
                <div class="regex-highlight-box" style="flex: 1; min-height: 240px;">
                  <div id="regex-backdrop" class="regex-backdrop"></div>
                  <textarea id="regex-test-text" class="regex-input-textarea" placeholder="Collez votre texte à tester...">Contactez-nous à support@toolsuite.com ou dev@example.org pour toute question technique.</textarea>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🎯 Groupes de capture détectés</span>
              </div>
              <div class="pane-body">
                <div id="regex-groups-container" style="flex: 1; overflow-y: auto;"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 12. GÉNÉRATEUR D'OMBRES CSS ================= -->
        <section id="view-tool-css-shadow" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">DevTools</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Générateur d'ombres CSS & Neumorphisme</h2>
              <p>Concevez visuellement vos effets box-shadow et soft UI avec prévisualisation et export de code.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🎛️ Curseurs de réglage</span>
                <div style="display: flex; gap: 0.35rem;">
                  <button class="btn btn-secondary btn-sm neumorph-btn" data-type="flat">Flat</button>
                  <button class="btn btn-secondary btn-sm neumorph-btn" data-type="concave">Concave</button>
                  <button class="btn btn-secondary btn-sm neumorph-btn" data-type="convex">Convex</button>
                  <button class="btn btn-secondary btn-sm neumorph-btn" data-type="pressed">Pressed</button>
                </div>
              </div>
              <div class="pane-body" style="gap: 1.25rem;">
                <div class="slider-group">
                  <div class="slider-header">
                    <span>Décalage horizontal (X)</span>
                    <span class="slider-val-badge" id="shadow-x-val">0px</span>
                  </div>
                  <input type="range" id="shadow-x-slider" min="-50" max="50" value="0">
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span>Décalage vertical (Y)</span>
                    <span class="slider-val-badge" id="shadow-y-val">12px</span>
                  </div>
                  <input type="range" id="shadow-y-slider" min="-50" max="50" value="12">
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span>Flou (Blur radius)</span>
                    <span class="slider-val-badge" id="shadow-blur-val">28px</span>
                  </div>
                  <input type="range" id="shadow-blur-slider" min="0" max="100" value="28">
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span>Étalement (Spread radius)</span>
                    <span class="slider-val-badge" id="shadow-spread-val">0px</span>
                  </div>
                  <input type="range" id="shadow-spread-slider" min="-30" max="50" value="0">
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span>Opacité de l'ombre</span>
                    <span class="slider-val-badge" id="shadow-opacity-val">35%</span>
                  </div>
                  <input type="range" id="shadow-opacity-slider" min="0" max="100" value="35">
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.5rem;">
                  <label class="switch-label">
                    <input type="checkbox" id="shadow-inset-check">
                    <span>Ombre interne (Inset)</span>
                  </label>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 0.82rem; color: var(--text-muted);">Couleur :</span>
                    <input type="color" id="shadow-color-picker" value="#000000" style="width: 38px; height: 38px; border: none; background: transparent; cursor: pointer;">
                  </div>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">👁️ Aperçu interactif</span>
                <button class="btn btn-primary btn-sm" id="shadow-copy-btn">Copier le code CSS</button>
              </div>
              <div class="pane-body">
                <div class="shadow-preview-stage">
                  <div class="shadow-target-box" id="shadow-preview-box">Box Shadow</div>
                </div>

                <div class="form-group" style="margin-top: 1.25rem;">
                  <label class="form-label" for="shadow-css-code">Code CSS généré</label>
                  <pre style="background: #0f172a; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"><code id="shadow-css-code" class="font-code"></code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 13. ENCODEUR / DÉCODEUR BASE64 ================= -->
        <section id="view-tool-base64" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">DevTools</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Encodeur / Décodeur Base64</h2>
              <p>Convertissez textes (UTF-8) et fichiers/images en chaînes Base64 ou Data URLs prêtes pour le web.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">🔤 Base64 Texte (UTF-8)</span>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-primary btn-sm" id="b64-encode-text-btn">Encoder</button>
                  <button class="btn btn-secondary btn-sm" id="b64-decode-text-btn">Décoder</button>
                </div>
              </div>
              <div class="pane-body">
                <div class="form-group">
                  <label class="form-label" for="b64-text-input">Texte source</label>
                  <textarea id="b64-text-input" class="form-textarea font-code" style="height: 120px;" placeholder="Entrez le texte à encoder ou la chaîne Base64 à décoder...">Bonjour, bienvenue sur ToolSuite ! 🚀</textarea>
                </div>

                <div class="form-group" style="flex: 1;">
                  <div class="form-label">
                    <span>Résultat</span>
                    <button class="btn btn-secondary btn-sm" id="b64-copy-text-btn">Copier</button>
                  </div>
                  <textarea id="b64-text-output" class="form-textarea font-code" readonly style="flex: 1; min-height: 140px;"></textarea>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📁 Fichier / Image vers Base64 Data URL</span>
              </div>
              <div class="pane-body">
                <div class="dropzone" id="b64-file-dropzone">
                  <input type="file" id="b64-file-input">
                  <div class="dropzone-icon">🔒</div>
                  <div class="dropzone-title">Glissez un fichier ou image</div>
                  <div class="dropzone-subtitle">Génère automatiquement la chaîne data:...;base64,...</div>
                </div>

                <div id="b64-file-result-group" style="display: none; margin-top: 1rem;">
                  <div id="b64-file-info" style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.5rem;"></div>
                  <img id="b64-img-preview" style="max-height: 120px; border-radius: var(--radius-xs); margin-bottom: 0.75rem; display: none;" alt="Aperçu">
                  <textarea id="b64-file-output" class="form-textarea font-code" readonly style="height: 100px;"></textarea>
                  <button class="btn btn-primary btn-sm" id="b64-file-copy-btn" style="margin-top: 0.5rem; width: 100%;">
                    <span>📋</span> Copier le Data URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 14. GÉNÉRATEUR DE QR CODES ================= -->
        <section id="view-tool-qrcode" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Utilitaires</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Générateur de QR Codes dynamiques</h2>
              <p>Créez des QR Codes haute résolution pour Wi-Fi, Cartes de visite vCard, URL et menus de restaurant.</p>
            </div>
          </div>

          <div class="split-pane-container">
            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">⚙️ Paramètres du QR Code</span>
              </div>
              <div class="pane-body">
                <div class="form-group">
                  <label class="form-label" for="qr-type-select">Type de QR Code</label>
                  <select id="qr-type-select" class="form-select">
                    <option value="url" selected>🌐 Lien Web / URL</option>
                    <option value="wifi">📶 Connexion Wi-Fi rapide</option>
                    <option value="vcard">👤 Carte de visite (vCard)</option>
                    <option value="menu">🍽️ Menu de restaurant</option>
                    <option value="text">📝 Texte brut</option>
                  </select>
                </div>

                <!-- URL fields -->
                <div class="qr-type-fields" id="qr-fields-url">
                  <div class="form-group">
                    <label class="form-label" for="qr-url-input">Adresse URL</label>
                    <input type="url" id="qr-url-input" class="form-input qr-field-input" value="https://google.com">
                  </div>
                </div>

                <!-- Wi-Fi fields -->
                <div class="qr-type-fields" id="qr-fields-wifi" style="display: none;">
                  <div class="form-group">
                    <label class="form-label" for="qr-wifi-ssid">Nom du réseau (SSID)</label>
                    <input type="text" id="qr-wifi-ssid" class="form-input qr-field-input" value="MonReseauWiFi">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="qr-wifi-pass">Mot de passe</label>
                    <input type="text" id="qr-wifi-pass" class="form-input qr-field-input" placeholder="Mot de passe">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="qr-wifi-enc">Sécurité</label>
                    <select id="qr-wifi-enc" class="form-select qr-field-input">
                      <option value="WPA" selected>WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Aucun (Réseau Ouvert)</option>
                    </select>
                  </div>
                </div>

                <!-- vCard fields -->
                <div class="qr-type-fields" id="qr-fields-vcard" style="display: none;">
                  <div class="form-group">
                    <label class="form-label" for="qr-vcard-fn">Nom complet</label>
                    <input type="text" id="qr-vcard-fn" class="form-input qr-field-input" value="Alexandre Martin">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="qr-vcard-tel">Numéro de téléphone</label>
                    <input type="tel" id="qr-vcard-tel" class="form-input qr-field-input" value="+33 6 12 34 56 78">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="qr-vcard-email">Adresse e-mail</label>
                    <input type="email" id="qr-vcard-email" class="form-input qr-field-input" value="alexandre@example.com">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="qr-vcard-org">Entreprise</label>
                    <input type="text" id="qr-vcard-org" class="form-input qr-field-input" value="Studio Web">
                  </div>
                </div>

                <!-- Menu fields -->
                <div class="qr-type-fields" id="qr-fields-menu" style="display: none;">
                  <div class="form-group">
                    <label class="form-label" for="qr-menu-url">Lien vers le menu PDF ou site</label>
                    <input type="url" id="qr-menu-url" class="form-input qr-field-input" value="https://restaurant.com/carte.pdf">
                  </div>
                </div>

                <!-- Text fields -->
                <div class="qr-type-fields" id="qr-fields-text" style="display: none;">
                  <div class="form-group">
                    <label class="form-label" for="qr-text-input">Contenu texte</label>
                    <textarea id="qr-text-input" class="form-textarea qr-field-input" style="height: 100px;">Scannez ce QR Code pour afficher le message.</textarea>
                  </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                  <div style="flex: 1;">
                    <label class="form-label" for="qr-fg-color">Couleur motif</label>
                    <input type="color" id="qr-fg-color" value="#0f172a" style="width: 100%; height: 38px; border: none; background: transparent; cursor: pointer;">
                  </div>
                  <div style="flex: 1;">
                    <label class="form-label" for="qr-bg-color">Couleur fond</label>
                    <input type="color" id="qr-bg-color" value="#ffffff" style="width: 100%; height: 38px; border: none; background: transparent; cursor: pointer;">
                  </div>
                </div>
              </div>
            </div>

            <div class="pane-card">
              <div class="pane-header">
                <span class="pane-title">📱 Aperçu du QR Code</span>
              </div>
              <div class="pane-body" style="align-items: center; justify-content: center;">
                <div class="qr-preview-box">
                  <div id="qr-code-canvas-box"></div>
                </div>

                <div style="display: flex; gap: 0.75rem; margin-top: 2rem;">
                  <button class="btn btn-primary btn-md" id="qr-download-png-btn">
                    <span>📥</span> Télécharger PNG
                  </button>
                  <button class="btn btn-secondary btn-md" id="qr-download-svg-btn">
                    <span>📐</span> Télécharger SVG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 15. GÉNÉRATEUR DE MOTS DE PASSE ================= -->
        <section id="view-tool-password" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Utilitaires</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Générateur de mots de passe forts</h2>
              <p>Générez des mots de passe ultra-sécurisés avec mesure de l'entropie mathématique (Shannon entropy).</p>
            </div>
          </div>

          <div style="max-width: 680px; margin: 0 auto;">
            
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem;">
              
              <!-- Result box with copy -->
              <div style="position: relative; margin-bottom: 1.5rem;">
                <input type="text" id="pass-output" class="form-input font-code" readonly style="font-size: 1.25rem; font-weight: 700; padding: 1rem 1.25rem; text-align: center; letter-spacing: 0.05em; color: var(--accent-primary);">
                <button class="btn btn-gradient btn-md" id="pass-copy-btn" style="position: absolute; right: 8px; top: 8px;">
                  <span>📋</span> Copier
                </button>
              </div>

              <!-- Entropy meter -->
              <div style="margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                  <span>Robustesse & Entropie</span>
                  <span id="pass-entropy-label" style="font-weight: 600;"></span>
                </div>
                <div class="entropy-meter-bar">
                  <div class="entropy-meter-fill" id="pass-entropy-meter"></div>
                </div>
              </div>

              <!-- Controls -->
              <div class="slider-group" style="margin-bottom: 1.5rem;">
                <div class="slider-header">
                  <span>Longueur du mot de passe</span>
                  <span class="slider-val-badge" id="pass-length-val">20</span>
                </div>
                <input type="range" id="pass-length-slider" min="6" max="64" value="20">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <label class="switch-label">
                  <input type="checkbox" id="pass-upper-check" checked>
                  <span>Majuscules (A-Z)</span>
                </label>
                <label class="switch-label">
                  <input type="checkbox" id="pass-lower-check" checked>
                  <span>Minuscules (a-z)</span>
                </label>
                <label class="switch-label">
                  <input type="checkbox" id="pass-numbers-check" checked>
                  <span>Chiffres (0-9)</span>
                </label>
                <label class="switch-label">
                  <input type="checkbox" id="pass-symbols-check" checked>
                  <span>Symboles spéciaux (!@#$)</span>
                </label>
              </div>

              <label class="switch-label" style="margin-bottom: 1.5rem; display: flex;">
                <input type="checkbox" id="pass-no-ambiguous-check" checked>
                <span>Exclure les caractères ambigus (<code>l, 1, I, o, 0, O</code>)</span>
              </label>

              <button class="btn btn-primary btn-lg" id="pass-generate-btn" style="width: 100%;">
                <span>🔄</span> Régénérer un mot de passe
              </button>
            </div>

          </div>
        </section>

        <!-- ================= 16. EXTRACTEUR DE PALETTE ================= -->
        <section id="view-tool-color-palette" class="tool-view-wrapper">
          <div class="tool-header-bar">
            <div class="tool-breadcrumbs">
              <button class="back-to-dash-btn">← Tableau de bord</button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Utilitaires</span>
            </div>
            <div class="tool-view-title-group">
              <h2>Extracteur de palette de couleurs</h2>
              <p>Importez n'importe quel visuel pour en extraire instantanément les teintes dominantes en HEX, RGB et CSS.</p>
            </div>
          </div>

          <div class="dropzone" id="palette-dropzone" style="margin-bottom: 1.5rem;">
            <input type="file" id="palette-input" accept="image/*">
            <div class="dropzone-icon">🎯</div>
            <div class="dropzone-title">Glissez une image pour en extraire les couleurs</div>
            <div class="dropzone-subtitle">Photo, logo, illustration, capture d'écran</div>
          </div>

          <div id="palette-workspace" style="display: none;">
            <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h3 style="font-size: 1.1rem; font-weight: 700;">Couleurs dominantes (Cliquez pour copier)</h3>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" id="palette-copy-css-btn">Copier les variables CSS</button>
                <button class="btn btn-secondary btn-sm" id="palette-copy-json-btn">Copier en JSON</button>
              </div>
            </div>

            <div style="display: flex; gap: 1.5rem; margin-top: 1rem; align-items: flex-start; flex-wrap: wrap;">
              <div style="max-width: 260px; background: var(--bg-card); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <img id="palette-img-preview" style="max-width: 100%; border-radius: var(--radius-xs); object-fit: contain;" alt="Image analysée">
              </div>

              <div style="flex: 1; min-width: 280px;">
                <div class="color-palette-grid" id="palette-grid"></div>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>

  </div>

  <!-- Quick Search Modal (Ctrl + K) -->
  <div class="modal-backdrop" id="search-modal-backdrop">
    <div class="search-modal">
      <div class="search-modal-header">
        <span>🔍</span>
        <input type="text" id="search-modal-input" class="search-modal-input" placeholder="Rechercher parmi les 15 outils...">
        <span class="search-shortcut">ESC</span>
      </div>
      <div class="search-modal-results" id="search-modal-results"></div>
      <div class="search-modal-footer">
        <span>Utilisez <strong>↑</strong> <strong>↓</strong> pour naviguer, <strong>Entrée</strong> pour sélectionner</span>
        <span>ToolSuite 2026</span>
      </div>
    </div>
  </div>

  <!-- App Core Scripts -->
  <script src="js/ui.js"></script>
  <script src="js/tools/pdf-tools.js"></script>
  <script src="js/tools/ocr-tool.js"></script>
  <script src="js/tools/markdown-tool.js"></script>
  <script src="js/tools/image-tools.js"></script>
  <script src="js/tools/bg-remover.js"></script>
  <script src="js/tools/dev-tools.js"></script>
  <script src="js/tools/utility-tools.js"></script>
  <script src="js/app.js"></script>

</body>
</html>
