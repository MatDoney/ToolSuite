/**
 * Markdown Converter - Éditeur et Convertisseur en direct
 * Uses Marked.js (loaded via CDN)
 */

const MarkdownTool = {
  defaultContent: `# 🚀 Bienvenue sur l'Éditeur Markdown

Cet éditeur transforme votre texte Markdown en **HTML propre** en temps réel.

## Fonctionnalités incluses :
- **Mise en forme riche** : *italique*, **gras**, ~~barré~~
- **Listes à puces** et [liens web](https://example.com)
- Blocs de code avec coloration :

\`\`\`javascript
function saluer(nom) {
  console.log(\`Bonjour \${nom} !\`);
}
saluer('Monde');
\`\`\`

### Tableaux faciles :
| Outil | Catégorie | Statut |
| :--- | :--- | :--- |
| Fusion PDF | Documents | ✅ Actif |
| Compresseur WebP | Images | ✅ Actif |
| Formateur JSON | DevTools | ✅ Actif |

> "La simplicité est la sophistication suprême." — Léonard de Vinci

1. Exportez en **HTML** prêt à l'emploi
2. Imprimez ou exportez directement en **PDF**
`,

  init() {
    const textarea = document.getElementById('md-editor-textarea');
    const preview = document.getElementById('md-preview-pane');

    if (textarea && preview) {
      if (!textarea.value.trim()) {
        textarea.value = this.defaultContent;
      }

      const updatePreview = () => {
        const raw = textarea.value;
        if (typeof marked !== 'undefined') {
          preview.innerHTML = marked.parse(raw);
        } else {
          preview.textContent = raw;
        }
      };

      textarea.addEventListener('input', updatePreview);
      updatePreview();
    }

    const copyHtmlBtn = document.getElementById('md-copy-html-btn');
    if (copyHtmlBtn) {
      copyHtmlBtn.addEventListener('click', () => {
        const preview = document.getElementById('md-preview-pane');
        if (preview) {
          UI.copy(preview.innerHTML, copyHtmlBtn, 'Code HTML copié !');
        }
      });
    }

    const downloadHtmlBtn = document.getElementById('md-download-html-btn');
    if (downloadHtmlBtn) {
      downloadHtmlBtn.addEventListener('click', () => {
        const preview = document.getElementById('md-preview-pane');
        if (!preview) return;
        const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Document Exporté</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    pre { background: #f4f4f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { font-family: monospace; background: #f4f4f5; padding: 2px 4px; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; }
    th { background: #f8fafc; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #64748b; }
  </style>
</head>
<body>
${preview.innerHTML}
</body>
</html>`;
        UI.download(fullHtml, 'document_markdown.html', 'text/html');
        UI.toast('Fichier HTML téléchargé !', 'success');
      });
    }

    const exportPdfBtn = document.getElementById('md-export-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        const preview = document.getElementById('md-preview-pane');
        if (!preview) return;
        const printWin = window.open('', '_blank');
        printWin.document.write(`
          <html>
            <head>
              <title>Impression / Export PDF</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 30px; color: #111; }
                pre { background: #f4f4f5; padding: 12px; border-radius: 6px; }
                code { font-family: monospace; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                blockquote { border-left: 4px solid #6366f1; padding-left: 12px; color: #555; }
              </style>
            </head>
            <body>
              ${preview.innerHTML}
              <script>
                window.onload = function() { window.print(); window.close(); }
              <\/script>
            </body>
          </html>
        `);
        printWin.document.close();
      });
    }
  }
};

window.MarkdownTool = MarkdownTool;
