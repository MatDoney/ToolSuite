/**
 * ToolSuite - UI Utilities & Global Helpers
 * Zero-dependency Vanilla JS for Toasts, Theme, Clipboard, Modals, Drag & Drop
 */

const UI = {
  // Toast notifications
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

  // Copy to clipboard with visual button feedback
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

  // Format bytes into readable string (Ko, Mo, etc.)
  formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Octet';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Theme management
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

  updateThemeButtonIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.title = theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
    }
  },

  // Setup generic drag and drop zone
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

  // Download blob or dataUrl as file
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
