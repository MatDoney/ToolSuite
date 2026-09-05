/**
 * @file ui.js
 * @module UI
 * @description Boîte à outils d'interface utilisateur pour ToolSuite.
 * Fournit des utilitaires réutilisables, légers et sans dépendance externe pour les notifications toast,
 * la gestion du thème (clair / sombre), la copie dans le presse-papier avec retour visuel,
 * le formatage d'octets, les zones de glisser-déposer (Drag & Drop) et le téléchargement de fichiers.
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

/**
 * @namespace UI
 * @description Espace de noms global regroupant les méthodes utilitaires de l'interface utilisateur.
 */
const UI = {
  /**
   * Affiche une notification contextuelle éphémère (Toast) avec animation d'entrée et de sortie.
   *
   * @function toast
   * @memberof UI
   * @param {string} message - Message texte ou HTML affiché dans le corps de la notification.
   * @param {('info'|'success'|'warning'|'error')} [type='info'] - Type visuel déterminant la couleur et l'icône du toast.
   * @param {number} [duration=3500] - Durée de visibilité en millisecondes avant la disparition automatique.
   * @returns {void}
   * @example
   * UI.toast('Fichier compressé avec succès !', 'success', 4000);
   * UI.toast('Erreur lors du traitement', 'error');
   */
  toast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'warning') icon = '⚡';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  },

  /**
   * Copie une chaîne de texte dans le presse-papier du système avec gestion de repli (fallback legacy)
   * et retour visuel temporaire sur le bouton déclencheur.
   *
   * @async
   * @function copy
   * @memberof UI
   * @param {string} text - Contenu textuel brut à copier dans le presse-papier.
   * @param {HTMLElement|null} [btnElement=null] - Élément bouton recevant la classe temporaire `.btn-copied` et l'étiquette 'Copié !'.
   * @param {string} [successMsg='Copié dans le presse-papier !'] - Texte de la notification toast affichée en cas de succès.
   * @returns {Promise<boolean>} Renvoie `true` si la copie a réussi, sinon `false`.
   * @example
   * const btn = document.getElementById('copy-btn');
   * await UI.copy('Texte à copier', btn);
   */
  async copy(text, btnElement = null, successMsg = 'Copié dans le presse-papier !') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }

      this.toast(successMsg, 'success');

      if (btnElement) {
        const originalHTML = btnElement.innerHTML;
        btnElement.classList.add('btn-copied');
        btnElement.innerHTML = `<span>✓</span> Copié !`;
        setTimeout(() => {
          btnElement.innerHTML = originalHTML;
          btnElement.classList.remove('btn-copied');
        }, 2000);
      }
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      this.toast('Erreur lors de la copie', 'error');
      return false;
    }
  },

  /**
   * Formate une taille en octets en une chaîne lisible avec unité dynamique (Octets, Ko, Mo, Go, To).
   *
   * @function formatBytes
   * @memberof UI
   * @param {number} bytes - Nombre total d'octets à formater.
   * @param {number} [decimals=2] - Nombre de décimales après la virgule.
   * @returns {string} Chaîne formatée (ex: "1.45 Mo", "512 Ko", "0 Octet").
   * @example
   * UI.formatBytes(1572864, 2); // "1.5 Mo"
   * UI.formatBytes(1024, 0);    // "1 Ko"
   */
  formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Octet';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  /**
   * Initialise le système de thème clair / sombre de l'application.
   * Récupère la préférence persistée dans le `localStorage` ou applique le thème sombre par défaut.
   *
   * @function initTheme
   * @memberof UI
   * @returns {void}
   */
  initTheme() {
    const savedTheme = localStorage.getItem('toolsuite_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('toolsuite_theme', newTheme);
        this.updateThemeButtonIcon(newTheme);
      });
    }
  },

  /**
   * Met à jour le glyphe et l'infobulle du bouton de bascule de thème.
   *
   * @function updateThemeButtonIcon
   * @memberof UI
   * @param {('dark'|'light')} theme - Thème actuellement appliqué.
   * @returns {void}
   */
  updateThemeButtonIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.title = theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
    }
  },

  /**
   * Configure et synchronise une zone de glisser-déposer (Dropzone) avec un champ input file masqué.
   * Gère les événements natifs `dragenter`, `dragover`, `dragleave` et `drop` ainsi que le clic direct.
   *
   * @function setupDropzone
   * @memberof UI
   * @param {string} dropzoneId - Identifiant HTML (`id`) de l'élément conteneur de dépôt.
   * @param {string} fileInputId - Identifiant HTML (`id`) du champ `<input type="file">` associé.
   * @param {function(File|File[]): void} onFileCallback - Fonction de rappel recevant le ou les fichiers sélectionnés.
   * @param {boolean} [multiple=false] - `true` pour accepter et transmettre une liste de fichiers, `false` pour le premier fichier unique.
   * @returns {void}
   * @example
   * UI.setupDropzone('dropzone-area', 'file-input', (file) => {
   *   console.log('Fichier déposé :', file.name);
   * });
   */
  setupDropzone(dropzoneId, fileInputId, onFileCallback, multiple = false) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (multiple) {
          onFileCallback(Array.from(files));
        } else {
          onFileCallback(files[0]);
        }
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        if (multiple) {
          onFileCallback(Array.from(files));
        } else {
          onFileCallback(files[0]);
        }
      }
    });
  },

  /**
   * Déclenche le téléchargement automatique d'un contenu en mémoire côté client sous la forme d'un fichier.
   *
   * @function download
   * @memberof UI
   * @param {Blob|Uint8Array|ArrayBuffer|string} content - Données brutes, blob ou chaîne texte à exporter.
   * @param {string} filename - Nom de fichier proposé pour l'enregistrement (ex: "document.pdf", "data.json").
   * @param {string} [mimeType='application/octet-stream'] - Type MIME associé au blob généré.
   * @returns {void}
   * @example
   * UI.download(pdfBytes, 'document_final.pdf', 'application/pdf');
   * UI.download(JSON.stringify(data), 'export.json', 'application/json');
   */
  download(content, filename, mimeType = 'application/octet-stream') {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

window.UI = UI;
