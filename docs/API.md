# ToolSuite — Référence Complète de l'API & Documentation Technique

> Généré automatiquement d'après les blocs de spécifications **JSDoc 3** et **PHPDoc** du projet.

## Table des Matières

- [app.js (`js/app.js`)](#jsappjs)
  - Namespace: `App`
  - Fonctions : 9 documentées
  - Types personnalisés : 1 typages
- [ui.js (`js/ui.js`)](#jsuijs)
  - Namespace: `UI`
  - Fonctions : 7 documentées
- [pdf-advanced-tools.js (`js/tools/pdf-advanced-tools.js`)](#jstoolspdfadvancedtoolsjs)
  - Namespace: `PdfAdvancedTools`
  - Fonctions : 33 documentées
- [pdf-tools.js (`js/tools/pdf-tools.js`)](#jstoolspdftoolsjs)
  - Namespace: `PDFTools`
  - Fonctions : 15 documentées
  - Types personnalisés : 1 typages
- [ocr-tool.js (`js/tools/ocr-tool.js`)](#jstoolsocrtooljs)
  - Namespace: `OCRTool`
  - Fonctions : 3 documentées
- [markdown-tool.js (`js/tools/markdown-tool.js`)](#jstoolsmarkdowntooljs)
  - Namespace: `MarkdownTool`
  - Fonctions : 2 documentées
- [bg-remover.js (`js/tools/bg-remover.js`)](#jstoolsbgremoverjs)
  - Namespace: `BgRemover`
  - Fonctions : 9 documentées
- [image-tools.js (`js/tools/image-tools.js`)](#jstoolsimagetoolsjs)
  - Namespace: `ImageTools`
  - Fonctions : 6 documentées
- [wheel-tool.js (`js/tools/wheel-tool.js`)](#jstoolswheeltooljs)
  - Namespace: `WheelTool`
  - Fonctions : 7 documentées
- [finance-tools.js (`js/tools/finance-tools.js`)](#jstoolsfinancetoolsjs)
  - Namespace: `FinanceTools`
  - Fonctions : 9 documentées
  - Types personnalisés : 1 typages
- [marketing-tools.js (`js/tools/marketing-tools.js`)](#jstoolsmarketingtoolsjs)
  - Namespace: `MarketingTools`
  - Fonctions : 6 documentées
  - Types personnalisés : 1 typages
- [productivity-tools.js (`js/tools/productivity-tools.js`)](#jstoolsproductivitytoolsjs)
  - Namespace: `ProductivityTools`
  - Fonctions : 8 documentées
  - Types personnalisés : 1 typages
- [text-tools.js (`js/tools/text-tools.js`)](#jstoolstexttoolsjs)
  - Namespace: `TextTools`
  - Fonctions : 10 documentées
  - Types personnalisés : 1 typages
- [utility-tools.js (`js/tools/utility-tools.js`)](#jstoolsutilitytoolsjs)
  - Namespace: `UtilityTools`
  - Fonctions : 11 documentées
  - Types personnalisés : 1 typages
- [dev-tools.js (`js/tools/dev-tools.js`)](#jstoolsdevtoolsjs)
  - Namespace: `DevTools`
  - Fonctions : 11 documentées
- [api.php (`api/api.php`)](#apiapiphp)
  - Fonctions : 3 documentées

---


## <a id="jsappjs"></a>app.js

**Fichier :** [`js/app.js`](../js/app.js)  

**Module :** `App`  

**Espace de noms (Namespace) :** `App`  


### Définitions de Types (`@typedef`)

#### `ToolItem` (Object)


| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | - Identifiant unique de l'outil correspondant à son ancre d'URL et à l'ID de sa vue HTML (ex: 'tool-pdf-merge'). |
| `name` | `string` | - Intitulé principal de l'outil affiché sur la carte et dans la barre de titre. |
| `category` | `string` | - Identifiant technique de la catégorie principale ('doc', 'image', 'dev', 'util', 'text', 'time', 'finance', 'marketing'). |
| `[categories]` | `string[]` | - Tableau optionnel de catégories secondaires pour indexation multiple (ex: ['util', 'image']). |
| `categoryLabel` | `string` | - Nom lisible de la catégorie affiché sur les badges. |
| `desc` | `string` | - Description synthétique des fonctionnalités offertes par l'outil. |
| `tag` | `string` | - Badge technique mettant en valeur les librairies ou spécificités (ex: 'PDF-Lib • Illimité', 'Canvas Alpha'). |
| `icon` | `string` | - Émoji ou symbole graphique distinctif. |
| `iconClass` | `string` | - Classe CSS d'habillage colorimétrique de l'icône ('icon-doc', 'icon-image', 'icon-dev', 'icon-util'). |



### Fonctions et Méthodes

#### `init()`

Point d'entrée principal de l'application déclenché au chargement du DOM.
Configure le thème sombre/clair, génère les cartes, attache la navigation et initialise les outils.


**Valeur de retour :**

- `void` : 

#### `handleHashChange()`

Interprète le fragment d'URL actif (hash) et affiche l'outil correspondant ou le tableau de bord.


**Valeur de retour :**

- `void` : 

#### `renderDashboardCards()`

Génère dynamiquement le balisage HTML des vignettes du tableau de bord selon la catégorie active.


**Valeur de retour :**

- `void` : 

#### `initNavigation()`

Attache les écouteurs d'événements pour les boutons de filtre, la barre latérale et le menu mobile.


**Valeur de retour :**

- `void` : 

#### `showDashboard()`

Affiche la vue principale du tableau de bord et masque toute vue d'outil ouverte.


**Valeur de retour :**

- `void` : 

#### `openTool(toolId)`

Ouvre la vue dédiée d'un outil et synchronise l'ancre d'URL correspondante.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `toolId` | `string` | **Requis** | - Identifiant unique de l'outil (ex: 'tool-ocr'). |



**Valeur de retour :**

- `void` : 

#### `initQuickSearch()`

Initialise le modal de recherche globale prédictive (Palette de commandes).
Gère le déclenchement par raccourci clavier (Ctrl+K ou touche '/') et la sélection au clavier.


**Valeur de retour :**

- `void` : 

#### `selectSearchResult(toolId)`

Sélectionne un résultat dans la recherche, ferme le modal et charge l'outil ciblé.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `toolId` | `string` | **Requis** | - Identifiant de l'outil sélectionné. |


#### `initTools()`

Déclenche l'initialisation sécurisée de chaque sous-module JavaScript de la suite.
Enveloppe chaque appel dans un bloc try/catch pour isoler les éventuelles exceptions locales.


**Valeur de retour :**

- `void` : 


---


## <a id="jsuijs"></a>ui.js

**Fichier :** [`js/ui.js`](../js/ui.js)  

**Module :** `UI`  

**Espace de noms (Namespace) :** `UI`  


### Fonctions et Méthodes

#### `toast(message, [type='info'], [duration=3500])`

Affiche une notification contextuelle éphémère (Toast) avec animation d'entrée et de sortie.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `message` | `string` | **Requis** | - Message texte ou HTML affiché dans le corps de la notification. |
| `[type='info']` | `('info'|'success'|'warning'|'error')` | Optionnel | - Type visuel déterminant la couleur et l'icône du toast. |
| `[duration=3500]` | `number` | Optionnel | - Durée de visibilité en millisecondes avant la disparition automatique. |



**Valeur de retour :**

- `void` : 


**Exemple :**
```javascript
UI.toast('Fichier compressé avec succès !', 'success', 4000);
UI.toast('Erreur lors du traitement', 'error');
```

#### `copy(text, [btnElement=null], [successMsg='Copié)`

Copie une chaîne de texte dans le presse-papier du système avec gestion de repli (fallback legacy)
et retour visuel temporaire sur le bouton déclencheur.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `text` | `string` | **Requis** | - Contenu textuel brut à copier dans le presse-papier. |
| `[btnElement=null]` | `HTMLElement|null` | Optionnel | - Élément bouton recevant la classe temporaire `.btn-copied` et l'étiquette 'Copié !'. |
| `[successMsg='Copié` | `string` | **Requis** | dans le presse-papier !'] - Texte de la notification toast affichée en cas de succès. |



**Valeur de retour :**

- `Promise<boolean>` : Renvoie `true` si la copie a réussi, sinon `false`.


**Exemple :**
```javascript
const btn = document.getElementById('copy-btn');
await UI.copy('Texte à copier', btn);
```

#### `formatBytes(bytes, [decimals=2])`

Formate une taille en octets en une chaîne lisible avec unité dynamique (Octets, Ko, Mo, Go, To).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `bytes` | `number` | **Requis** | - Nombre total d'octets à formater. |
| `[decimals=2]` | `number` | Optionnel | - Nombre de décimales après la virgule. |



**Valeur de retour :**

- `string` : Chaîne formatée (ex: "1.45 Mo", "512 Ko", "0 Octet").


**Exemple :**
```javascript
UI.formatBytes(1572864, 2); // "1.5 Mo"
UI.formatBytes(1024, 0);    // "1 Ko"
```

#### `initTheme()`

Initialise le système de thème clair / sombre de l'application.
Récupère la préférence persistée dans le `localStorage` ou applique le thème sombre par défaut.


**Valeur de retour :**

- `void` : 

#### `updateThemeButtonIcon(theme)`

Met à jour le glyphe et l'infobulle du bouton de bascule de thème.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `theme` | `('dark'|'light')` | **Requis** | - Thème actuellement appliqué. |



**Valeur de retour :**

- `void` : 

#### `setupDropzone(dropzoneId, fileInputId, onFileCallback, [multiple=false])`

Configure et synchronise une zone de glisser-déposer (Dropzone) avec un champ input file masqué.
Gère les événements natifs `dragenter`, `dragover`, `dragleave` et `drop` ainsi que le clic direct.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `dropzoneId` | `string` | **Requis** | - Identifiant HTML (`id`) de l'élément conteneur de dépôt. |
| `fileInputId` | `string` | **Requis** | - Identifiant HTML (`id`) du champ `<input type="file">` associé. |
| `onFileCallback` | `function(File|File[]): void` | **Requis** | - Fonction de rappel recevant le ou les fichiers sélectionnés. |
| `[multiple=false]` | `boolean` | Optionnel | - `true` pour accepter et transmettre une liste de fichiers, `false` pour le premier fichier unique. |



**Valeur de retour :**

- `void` : 


**Exemple :**
```javascript
UI.setupDropzone('dropzone-area', 'file-input', (file) => {
console.log('Fichier déposé :', file.name);
});
```

#### `download(content, filename, [mimeType='application/octet-stream'])`

Déclenche le téléchargement automatique d'un contenu en mémoire côté client sous la forme d'un fichier.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `content` | `Blob|Uint8Array|ArrayBuffer|string` | **Requis** | - Données brutes, blob ou chaîne texte à exporter. |
| `filename` | `string` | **Requis** | - Nom de fichier proposé pour l'enregistrement (ex: "document.pdf", "data.json"). |
| `[mimeType='application/octet-stream']` | `string` | Optionnel | - Type MIME associé au blob généré. |



**Valeur de retour :**

- `void` : 


**Exemple :**
```javascript
UI.download(pdfBytes, 'document_final.pdf', 'application/pdf');
UI.download(JSON.stringify(data), 'export.json', 'application/json');
```


---


## <a id="jstoolspdfadvancedtoolsjs"></a>pdf-advanced-tools.js

**Fichier :** [`js/tools/pdf-advanced-tools.js`](../js/tools/pdf-advanced-tools.js)  

**Module :** `PdfAdvancedTools`  

**Espace de noms (Namespace) :** `PdfAdvancedTools`  


### Fonctions et Méthodes

#### `md5(data)`

Calcule l'empreinte MD5 (Message Digest 5) d'une chaîne ou d'un tampon binaire selon la RFC 1321.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `data` | `string|Uint8Array` | **Requis** | - Données textuelles ou binaires à hacher. |



**Valeur de retour :**

- `Uint8Array` : Empreinte de hachage de 16 octets (128 bits).

#### `rc4(key, data)`

Chiffre ou déchiffre des données à l'aide de l'algorithme de chiffrement de flux RC4 (Rivest Cipher 4).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `key` | `Uint8Array` | **Requis** | - Clé de chiffrement symétrique. |
| `data` | `Uint8Array` | **Requis** | - Données d'entrée brutes. |



**Valeur de retour :**

- `Uint8Array` : Données résultantes après application du XOR avec le flux de clés.

#### `hexToBytes(hex)`

Convertit une chaîne de caractères hexadécimale en tableau d'octets.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `hex` | `string` | **Requis** | - Chaîne hexadécimale de longueur paire. |



**Valeur de retour :**

- `Uint8Array` : Tableau d'octets reconstitué.

#### `bytesToHex(bytes)`

Convertit un tableau d'octets en chaîne hexadécimale en minuscules.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `bytes` | `Uint8Array` | **Requis** | - Données binaires. |



**Valeur de retour :**

- `string` : Chaîne hexadécimale formatée.

#### `encodePassword(password)`

Encode une chaîne de mot de passe en séquence d'octets conforme au jeu de caractères PDFDocEncoding (ISO 32000-1).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `password` | `string` | **Requis** | - Mot de passe utilisateur ou propriétaire. |



**Valeur de retour :**

- `Uint8Array` : Séquence d'octets normalisée.

#### `padPassword(pwd)`

Tronque ou complète le mot de passe à exactement 32 octets avec la chaîne de remplissage standard PDF.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `pwd` | `string` | **Requis** | - Mot de passe à calibrer. |



**Valeur de retour :**

- `Uint8Array` : Bloc calibré de 32 octets.

#### `computeOwnerKey(ownerPassword, userPassword)`

Calcule la valeur de la clé propriétaire /O (Owner Key) selon l'Algorithme 3.3 de la norme PDF.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `ownerPassword` | `string` | **Requis** | - Mot de passe propriétaire. |
| `userPassword` | `string` | **Requis** | - Mot de passe utilisateur. |



**Valeur de retour :**

- `Uint8Array` : Valeur /O de 32 octets.

#### `computeEncryptionKey(userPassword, ownerKey, permissions, fileId)`

Calcule la clé de chiffrement principale du document selon l'Algorithme 3.2 de la spécification ISO 32000-1.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `userPassword` | `string` | **Requis** | - Mot de passe d'ouverture. |
| `ownerKey` | `Uint8Array` | **Requis** | - Clé propriétaire /O. |
| `permissions` | `number` | **Requis** | - Masque de permissions /P (entier 32 bits). |
| `fileId` | `Uint8Array` | **Requis** | - Identifiant de fichier issu du tableau /ID du trailer. |



**Valeur de retour :**

- `Uint8Array` : Clé de chiffrement du document de 16 octets (128 bits).

#### `computeUserKey(encryptionKey, fileId)`

Calcule la valeur de la clé utilisateur /U (User Key) selon l'Algorithme 3.4 / 3.5.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `encryptionKey` | `Uint8Array` | **Requis** | - Clé de chiffrement calculée. |
| `fileId` | `Uint8Array` | **Requis** | - Identifiant unique /ID du document. |



**Valeur de retour :**

- `Uint8Array` : Valeur /U de 32 octets.

#### `encryptObject(data, objectNum, generationNum, encryptionKey)`

Chiffre le contenu d'un objet indirect ou d'un flux PDF selon l'Algorithme 3.1.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `data` | `Uint8Array` | **Requis** | - Données brutes à chiffrer. |
| `objectNum` | `number` | **Requis** | - Numéro d'objet indirect. |
| `generationNum` | `number` | **Requis** | - Numéro de génération de l'objet. |
| `encryptionKey` | `Uint8Array` | **Requis** | - Clé de chiffrement principale. |



**Valeur de retour :**

- `Uint8Array` : Données chiffrées par RC4 avec la clé dérivée d'objet.

#### `bytesToPDFStringValue(bytes)`

Échappe une séquence binaire pour l'intégrer sous forme de chaîne littérale PDF sécurisée.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `bytes` | `Uint8Array` | **Requis** | - Octets binaires. |



**Valeur de retour :**

- `string` : Chaîne avec échappement des parenthèses, antislashs et retours charriot.

#### `encryptPDF(pdfBytes, userPassword, [ownerPassword=null])`

Chiffre l'intégralité d'un document PDF avec un mot de passe utilisateur en appliquant l'algorithme RC4 128-bit.
Parcourt le graphe des objets indirects du PDFDocument pour chiffrer leurs flux et chaînes sans altérer les structures indispensables.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `pdfBytes` | `Uint8Array` | **Requis** | - Données binaires du PDF source à verrouiller. |
| `userPassword` | `string` | **Requis** | - Mot de passe requis pour ouvrir et consulter le document. |
| `[ownerPassword=null]` | `string|null` | Optionnel | - Mot de passe maître optionnel conférant tous les privilèges. |



**Valeur de retour :**

- `Promise<Uint8Array>` : Fichier PDF chiffré prêt pour sauvegarde ou téléchargement.


**Exceptions levées (`@throws`) :**

- `Error` : Si le document est déjà chiffré ou si la librairie PDF-Lib n'est pas disponible.

#### `init()`

Déclenche l'initialisation de l'ensemble des 12 modules d'outils PDF avancés.


**Valeur de retour :**

- `void` : 

#### `ensurePdfLib()`

Charge de façon asynchrone la bibliothèque PDF-Lib depuis le dossier vendor ou un CDN de secours.


**Valeur de retour :**

- `Promise<any>` : Instance globale window.PDFLib prête pour manipulation de documents.

#### `ensurePdfJs()`

Charge de façon asynchrone le moteur de rendu PDF.js et attache son Web Worker dédié.


**Valeur de retour :**

- `Promise<any>` : Instance globale window.pdfjsLib configurée.

#### `isPdf(file)`

Vérifie la validité d'un fichier PDF d'après son extension de nom ou son type MIME.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `file` | `File|null` | **Requis** | - Fichier inspecté. |



**Valeur de retour :**

- `boolean` : Vrai si le fichier est identifié comme un document PDF.

#### `initRedact()`

Initialise l'outil de caviardage destructif (Redact Tool).
Permet à l'utilisateur de tracer des rectangles noirs opaques sur les données confidentielles (noms, IBAN, etc.).
Au moment de l'application, chaque page est rendue en bitmap haute définition (300 DPI) avec les zones noires
fusionnées dans les pixels, détruisant ainsi physiquement et irréversiblement le texte vectoriel sous-jacent.


**Valeur de retour :**

- `void` : 

#### `initPassword()`

Initialise le gestionnaire de sécurité des mots de passe PDF.
Volet Déverrouillage : Accepte un document protégé par mot de passe, déchiffre son contenu via PDF.js,
et reconstruit une copie vectorielle ou matricielle 100% saine exempte de toute restriction DRM ou mot de passe.
Volet Verrouillage : Applique un chiffrement standard ISO 32000-1 RC4 128 bits via PdfEncryptEngine,
rendant le mot de passe obligatoire pour toute ouverture dans Adobe Acrobat, Edge, Chrome ou macOS Preview.


**Valeur de retour :**

- `void` : 

#### `initFlatten()`

Initialise l'outil d'aplatissement de documents PDF (Flattening).
Mode Formulaires : Fige les champs éditables AcroForms (champs texte, cases à cocher, listes)
pour les convertir en vecteurs graphiques non modifiables.
Mode Intégral : Rastérise l'ensemble des pages en calques bitmap uniques pour neutraliser
les superpositions, calques optionnels (OCG) et annotations interactives.


**Valeur de retour :**

- `void` : 

#### `initReorderRotate()`

Initialise l'interface visuelle de réorganisation et de rotation des pages PDF en Drag & Drop.
Génère dynamiquement une grille de cartes miniatures avec vignettes rendues par PDF.js,
permet l'inversion d'ordre par glisser-déposer natif HTML5, la rotation individuelle (90° horaire/anti-horaire)
et la suppression définitive de pages indésirables avant recompilation vectorielle via PDF-Lib.


**Valeur de retour :**

- `void` : 

#### `rotatePage(index, angle)`

Applique une rotation angulaire à la page spécifiée et rafraîchit la prévisualisation.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Index séquentiel de la page dans la liste de réorganisation. |
| `angle` | `number` | **Requis** | - Incrément d'angle en degrés (-90 pour gauche, +90 pour droite). |



**Valeur de retour :**

- `void` : 

#### `deletePage(index)`

Supprime une page de la liste de réorganisation après vérification du seuil minimal (au moins 1 page restante).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Index de la page à retirer. |



**Valeur de retour :**

- `void` : 

#### `initCrop()`

Initialise l'outil de recadrage de marges PDF (Crop Tool).
Permet l'ajustement interactif des 4 marges (haut, bas, gauche, droite) avec prévisualisation en temps réel,
ainsi qu'un algorithme de détection automatique des marges blanches basé sur l'analyse de luminance pixel par pixel sur Canvas.
Modifie la boîte de découpe (/CropBox) de chaque page sans ré-encoder les flux vectoriels d'origine.


**Valeur de retour :**

- `void` : 

#### `initExtractImages()`

Initialise l'extracteur d'images incorporées dans les documents PDF.
Analyse la table des opérateurs PDF (`paintImageXObject`) pour extraire les objets matriciels XObject,
convertit les flux binaires (RGBA, RGB, niveaux de gris) en images PNG sur Canvas,
affiche une galerie de prévisualisation avec dimensions, et permet l'export individuel ou groupé en archive ZIP via JSZip.


**Valeur de retour :**

- `void` : 

#### `downloadSingleImage(idx)`

Déclenche le téléchargement d'un fichier image individuel extrait de la galerie.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `idx` | `number` | **Requis** | - Index de l'élément dans le tableau des images extraites. |



**Valeur de retour :**

- `void` : 

#### `initSignature()`

Initialise l'outil de signature électronique manuscrite de PDF.
Propose 3 modes de création de paraphe :
1. Dessin à la souris ou au doigt/stylet tactile avec choix de couleur (noir ou bleu).
2. Saisie textuelle en police cursive stylisée.
3. Téléversement d'un scan avec suppression automatique du fond blanc par transparence alpha.
Permet le positionnement libre par glisser-déposer sur la page choisie et l'incrustation définitive via PDF-Lib.


**Valeur de retour :**

- `void` : 

#### `initWatermark()`

Initialise le générateur de filigranes textuels personnalisés (Watermark Tool).
Applique un texte de marquage (ex: "CONFIDENTIEL", "COPIE", "BROUILLON") centré sur toutes les pages,
avec réglage libre de la couleur, de la transparence (opacité de 5% à 100%) et de l'orientation angulaire (ex: 45°).


**Valeur de retour :**

- `void` : 

#### `initPageNumbering()`

Initialise l'outil de numérotation automatique de pages (Bates & Pagination).
Insère des numéros formatés ("1/N", "Page 1 sur N", "- 1 -") à l'emplacement souhaité
(haut/bas de page, centré, aligné à gauche ou à droite), avec possibilité d'exclure la première page de couverture.


**Valeur de retour :**

- `void` : 

#### `initUrlToPdf()`

Initialise l'outil de conversion d'URL web en document PDF épuré (Mode Lecture et Archivage pérenne).
Récupère le code HTML distant via le point de terminaison proxy PHP local ou relais CORS,
filtre et élimine l'ensemble des éléments parasites (publicités, bannières de cookies, barres de navigation, scripts),
segmente les blocs textuels structurés (titres H2-H4, listes à puces, citations, paragraphes réguliers),
et génère un PDF multi-pages A4 avec calcul précis de césure de texte (word-wrap), en-tête de rappel et pied de page numéroté.


**Valeur de retour :**

- `void` : 

#### `initPdfToExcel()`

Initialise l'extracteur de structures tabulaires depuis les documents PDF.
Regroupe les glyphes de texte par proximité d'ordonnée Y (lignes) avec une tolérance de 8 pixels,
ordonne les cellules par abscisse X (colonnes), normalise le nombre de colonnes par ligne,
présente une prévisualisation tabulaire HTML et permet l'export au format CSV (délimiteur configurable) ou Excel (.xls).


**Valeur de retour :**

- `void` : 

#### `initImagesToPdf()`

Initialise l'assembleur d'images multiples en un document PDF unique.
Accepte le téléversement simultané de photos et graphiques (JPG, PNG, WebP),
propose une interface visuelle pour réorganiser l'ordre séquentiel des clichés ou en retirer,
et offre 3 modes de cadrage (Taille ajustée à l'image, A4 portrait centré, ou A4 paysage) avec gestion de marges.


**Valeur de retour :**

- `void` : 

#### `moveImage(index, dir)`

Décale une image vers la gauche (-1) ou vers la droite (+1) dans la liste d'assemblage.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Index actuel de l'image. |
| `dir` | `number` | **Requis** | - Direction relative du déplacement (-1 ou +1). |



**Valeur de retour :**

- `void` : 

#### `removeImage(index)`

Retire une image spécifique de la liste d'assemblage PDF.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Index de l'image à supprimer. |



**Valeur de retour :**

- `void` : 


---


## <a id="jstoolspdftoolsjs"></a>pdf-tools.js

**Fichier :** [`js/tools/pdf-tools.js`](../js/tools/pdf-tools.js)  

**Module :** `PDFTools`  

**Espace de noms (Namespace) :** `PDFTools`  


### Définitions de Types (`@typedef`)

#### `MergeFileItem` (Object)


| Propriété | Type | Description |
|---|---|---|
| `name` | `string` | - Nom d'origine du fichier PDF. |
| `size` | `number` | - Taille en octets du fichier. |
| `bytes` | `Uint8Array` | - Données binaires du PDF chargées en mémoire. |



### Fonctions et Méthodes

#### `init()`

Initialise les 3 outils PDF de base : fusion, séparation et compresseur.


**Valeur de retour :**

- `void` : 

#### `isPdfFile(file)`

Détermine si un fichier sélectionné est un document PDF selon son extension et son type MIME.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `file` | `File` | **Requis** | - Fichier à analyser. |



**Valeur de retour :**

- `boolean` : `true` si le fichier est un PDF valide.

#### `initMerge()`

Initialise la zone de glisser-déposer de fusion, le bouton d'action et le vidage de la liste.


**Valeur de retour :**

- `void` : 

#### `handleMergeFiles(files)`

Lit et stocke en mémoire les fichiers PDF déposés dans la file d'attente de fusion.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `files` | `File[]` | **Requis** | - Liste des fichiers déposés par l'utilisateur. |



**Valeur de retour :**

- `Promise<void>` : 

#### `renderMergeFileList()`

Rend la liste ordonnable des fichiers PDF prêts à être fusionnés avec contrôles de montée/descente et suppression.


**Valeur de retour :**

- `void` : 

#### `moveMergeFile(index, direction)`

Déplace un élément dans la file d'attente de fusion pour modifier l'ordre final d'assemblage.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Position actuelle de l'élément dans le tableau `mergeFiles`. |
| `direction` | `(-1|1)` | **Requis** | - Décalage vers le haut (-1) ou vers le bas (+1). |



**Valeur de retour :**

- `void` : 

#### `removeMergeFile(index)`

Retire un document de la liste de fusion.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `index` | `number` | **Requis** | - Index de l'élément à supprimer. |



**Valeur de retour :**

- `void` : 

#### `getPdfLib()`

Récupère l'objet global PDF-Lib si déjà disponible dans la portée.


**Valeur de retour :**

- `object|null` : 

#### `ensurePdfLib()`

S'assure de la disponibilité de la bibliothèque PDF-Lib en tentant le chargement local puis CDN.


**Valeur de retour :**

- `Promise<object>` : Instance globale de `PDFLib`.


**Exceptions levées (`@throws`) :**

- `Error` : Si le chargement échoue.

#### `executeMerge()`

Assemble tous les documents PDF de la file d'attente en un fichier fusionné unique.
Copie l'intégralité des pages de chaque PDF source dans un nouveau document `PDFDocument`.


**Valeur de retour :**

- `Promise<void>` : 

#### `initSplit()`

Initialise les écouteurs de séparation de PDF (dépôt, export PDF unique ou archive ZIP).


**Valeur de retour :**

- `void` : 

#### `loadSplitPdf(file)`

Charge et analyse le document PDF pour la séparation : lecture du nombre de pages et affichage du panneau d'options.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `file` | `File` | **Requis** | - Fichier PDF sélectionné. |



**Valeur de retour :**

- `Promise<void>` : 

#### `executeSplit([asZip=false])`

Extrait les pages demandées selon la chaîne de plage (ex: "1-3, 5") et exporte soit un PDF unifié,
soit un fichier ZIP avec une page par fichier PDF.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `[asZip=false]` | `boolean` | Optionnel | - Si `true`, produit une archive ZIP contenant chaque page séparée. |



**Valeur de retour :**

- `Promise<void>` : 

#### `parsePageRanges(rangeStr, maxPage)`

Parse une chaîne de sélection de pages au format humain (1-indexé) et renvoie un tableau d'entiers uniques triés.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `rangeStr` | `string` | **Requis** | - Chaîne de plage (ex: "1-4, 7, 9-12"). |
| `maxPage` | `number` | **Requis** | - Nombre total maximal de pages du document. |



**Valeur de retour :**

- `number[]` : Tableau ordonné des numéros de pages 1-indexés à extraire.


**Exemple :**
```javascript
PDFTools.parsePageRanges("1-3, 5", 10); // [1, 2, 3, 5]
```

#### `initCompress()`

Initialise le compresseur de PDF : optimise les dictionnaires d'objets, compresse les flux
et élimine les doublons de métadonnées inutilisées via `useObjectStreams: true`.


**Valeur de retour :**

- `void` : 


---


## <a id="jstoolsocrtooljs"></a>ocr-tool.js

**Fichier :** [`js/tools/ocr-tool.js`](../js/tools/ocr-tool.js)  

**Module :** `OCRTool`  

**Espace de noms (Namespace) :** `OCRTool`  


### Fonctions et Méthodes

#### `init()`

Initialise les écouteurs d'événements de la vue OCR : zone de dépôt d'image,
bouton de lancement, copie dans le presse-papier et téléchargement du texte brut extrait.


**Valeur de retour :**

- `void` : 

#### `loadImage(file)`

Lit et charge le fichier image déposé sous forme de Data URL pour l'affichage de l'aperçu
et l'injection dans le moteur Tesseract.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `file` | `File` | **Requis** | - Fichier image sélectionné par l'utilisateur. |



**Valeur de retour :**

- `void` : 

#### `recognize()`

Exécute l'analyse OCR sur l'image chargée en instanciant un worker Tesseract.js.
Met à jour la barre de progression en temps réel et remplit la zone de résultat avec le texte reconnu.


**Valeur de retour :**

- `Promise<void>` : 


**Exceptions levées (`@throws`) :**

- `Error` : Si la bibliothèque Tesseract n'est pas disponible ou si le worker échoue.


---


## <a id="jstoolsmarkdowntooljs"></a>markdown-tool.js

**Fichier :** [`js/tools/markdown-tool.js`](../js/tools/markdown-tool.js)  

**Module :** `MarkdownTool`  

**Espace de noms (Namespace) :** `MarkdownTool`  


### Fonctions et Méthodes

#### `init()`

Initialise l'éditeur Markdown, l'écouteur de frappe pour la prévisualisation réactive,
ainsi que les actions de copie du code HTML, d'export sous forme de fichier HTML complet
et d'impression PDF via la fenêtre d'impression native du navigateur.


**Valeur de retour :**

- `void` : 

#### `updatePreview()`

Met à jour le panneau de prévisualisation en convertissant la chaîne Markdown en HTML via Marked.


---


## <a id="jstoolsbgremoverjs"></a>bg-remover.js

**Fichier :** [`js/tools/bg-remover.js`](../js/tools/bg-remover.js)  

**Module :** `BgRemover`  

**Espace de noms (Namespace) :** `BgRemover`  


### Fonctions et Méthodes

#### `init()`

Initialise les éléments de l'interface, les curseurs de réglage (tolérance, taille du pinceau),
les boutons de mode, la zone de dépôt et les écouteurs de souris sur le canvas.


**Valeur de retour :**

- `void` : 

#### `setMode(mode)`

Définit le mode d'interaction actif et adapte la visibilité des contrôles de pinceau.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `mode` | `('wand'|'eraser'|'restore')` | **Requis** | - Nouveau mode d'édition à activer. |



**Valeur de retour :**

- `void` : 

#### `loadImage(file)`

Charge une image locale, la redimensionne proportionnellement si elle dépasse la limite
de performance de 1200px, et stocke son calque brut d'origine.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `file` | `File` | **Requis** | - Fichier image déposé par l'utilisateur. |



**Valeur de retour :**

- `void` : 

#### `saveHistory()`

Enregistre l'état actuel du canvas dans l'historique d'annulation (maximum 8 étapes).


**Valeur de retour :**

- `void` : 

#### `resetCanvas()`

Restaure l'état initial de l'image en rechargeant la copie `originalImageData`.


**Valeur de retour :**

- `void` : 

#### `setupCanvasEvents()`

Attache les écouteurs d'événements souris (clic baguette magique, tracé continu à la gomme ou au pinceau).


**Valeur de retour :**

- `void` : 

#### `magicWandRemove(startX, startY)`

Supprime l'arrière-plan par échantillonnage de couleur au point `(startX, startY)`.
Calcule la distance euclidienne tridimensionnelle dans l'espace RGB :
`dist = sqrt((r - r0)^2 + (g - g0)^2 + (b - b0)^2)`
et applique un fondu alpha progressif (alpha feathering) sur la bordure de tolérance pour éviter les crénelages.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `startX` | `number` | **Requis** | - Coordonnée X du pixel cliqué sur le canvas. |
| `startY` | `number` | **Requis** | - Coordonnée Y du pixel cliqué sur le canvas. |



**Valeur de retour :**

- `void` : 

#### `autoDetectAndRemove()`

Échantillonne automatiquement les couleurs des 4 coins de l'image (zones typiques d'arrière-plan)
et applique successivement la suppression de couleur.


**Valeur de retour :**

- `void` : 

#### `paintAt(})`

Applique le pinceau circulaire à la position indiquée selon le mode actif :
- `eraser` : découpe transparente avec `destination-out`.
- `restore` : réinjecte les canaux RGBA de `originalImageData` pour tous les pixels dans le rayon.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `}` | `{x: number, y: number` | **Requis** | pos - Coordonnées du centre du pinceau. |



**Valeur de retour :**

- `void` : 


---


## <a id="jstoolsimagetoolsjs"></a>image-tools.js

**Fichier :** [`js/tools/image-tools.js`](../js/tools/image-tools.js)  

**Module :** `ImageTools`  

**Espace de noms (Namespace) :** `ImageTools`  


### Fonctions et Méthodes

#### `init()`

Initialise les 3 sous-modules d'outils d'image (convertisseur, compresseur, favicons).


**Valeur de retour :**

- `void` : 

#### `initConverter()`

Initialise la vue de conversion de formats d'image : écouteur de glisser-déposer,
lecture des dimensions de l'image source, gestion du fond blanc pour JPEG (éviter les fonds noirs sur transparence),
encapsulation SVG et téléchargement dynamique dans le format ciblé.


**Valeur de retour :**

- `void` : 

#### `initCompressor()`

Initialise le compresseur d'images : réglages de qualité (0 à 100%), mise à l'échelle (scale factor),
zone de dépôt d'image et déclenchement réactif du calcul de compression.


**Valeur de retour :**

- `void` : 

#### `runCompression(img, origSize, fileName)`

Exécute l'algorithme de compression réactive sur l'image fournie via encodage WebP.
Calcule le pourcentage de réduction et le volume d'octets économisés en temps réel.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `img` | `HTMLImageElement|null` | **Requis** | - Élément image source chargé. |
| `origSize` | `number` | **Requis** | - Taille en octets du fichier image d'origine. |
| `fileName` | `string` | **Requis** | - Nom d'origine du fichier pour la nomenclature d'export. |



**Valeur de retour :**

- `void` : 

#### `initFavicon()`

Initialise le générateur de pack de favicons : définition des résolutions cibles,
zone de dépôt de logo, et copie dans le presse-papier des balises HTML `<link rel="icon">`.


**Valeur de retour :**

- `void` : 

#### `generateFaviconPack(img, >})`

Génère la grille de prévisualisation des favicons, crée les blobs PNG haute fidélité
pour chaque taille et configure le téléchargement de l'archive ZIP finale via JSZip.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `img` | `HTMLImageElement` | **Requis** | - Logo source servant de matrice. |
| `>}` | `Array<{size: number, name: string` | **Requis** | sizes - Liste des formats et noms de fichiers cibles. |



**Valeur de retour :**

- `void` : 


---


## <a id="jstoolswheeltooljs"></a>wheel-tool.js

**Fichier :** [`js/tools/wheel-tool.js`](../js/tools/wheel-tool.js)  

**Module :** `WheelTool`  

**Espace de noms (Namespace) :** `WheelTool`  


### Fonctions et Méthodes

#### `init()`

Initialise l'ensemble du système de la roue : lecture de la liste des participants,
rendu géométrique trigonométrique des secteurs sur canvas Retina/HiDPI,
physique d'inertie de rotation et gestionnaire d'effets visuels/sonores.


**Valeur de retour :**

- `void` : 

#### `playTickSound()`

Joue un son synthétisé de 'clic' mécanique à chaque passage d'un secteur sous l'aiguille.

#### `playWinSound()`

Joue un arpège de victoire harmonique lors de l'arrêt de la roue sur le gagnant.

#### `getItems()`

Parse la liste des participants depuis le champ textarea (une ligne par entrée).


**Valeur de retour :**

- `string[]` : 

#### `drawWheel()`

Dessine la roue avec mise à l'échelle HiDPI (devicePixelRatio), découpage en secteurs,
textes orientés par trigonométrie et moyeu central.

#### `spin()`

Lance l'animation physique de rotation avec décélération exponentielle (courbe de frottement).
Calcule le vainqueur désigné par la flèche située à 12h (270 degrés / 1.5 * PI).

#### `launchConfetti()`

Déclenche une projection de confettis multicolores avec gravité et rotation.


---


## <a id="jstoolsfinancetoolsjs"></a>finance-tools.js

**Fichier :** [`js/tools/finance-tools.js`](../js/tools/finance-tools.js)  

**Module :** `FinanceTools`  

**Espace de noms (Namespace) :** `FinanceTools`  


### Définitions de Types (`@typedef`)

#### `CompoundInterestPoint` (Object)


| Propriété | Type | Description |
|---|---|---|
| `year` | `number` | - Année de la projection (0 = état initial). |
| `invested` | `number` | - Montant cumulé des versements réels effectués en euros. |
| `balance` | `number` | - Solde total accumulé (capital + intérêts composés réinvestis). |
| `interest` | `number` | - Plus-value globale brute générée en intérêts. |



### Fonctions et Méthodes

#### `init()`

Initialise l'ensemble des modules de calculs financiers au chargement de l'application.
Attache les écouteurs d'événements et lance les premiers calculs d'exemple.


**Valeur de retour :**

- `void` : 

#### `initPercentageCalculator()`

Initialise les 4 calculateurs de pourcentages interactifs en temps réel :
1. Calcul d'une fraction : Que vaut X% de Y ?
2. Calcul d'une proportion : Quel pourcentage représente X par rapport à Y ?
3. Variation relative : Taux d'évolution en pourcentage de la valeur A vers la valeur B.
4. Application commerciale : Valeur finale après remise ou taxe/TVA.


**Valeur de retour :**

- `void` : 

#### `initSplitBill()`

Initialise le gestionnaire de partage de note et de calcul de pourboires.
Calcule instantanément le montant du pourboire, le total général et la quote-part par convive.
Permet la copie presse-papiers d'un récapitulatif formaté prêt pour messagerie instantanée.


**Valeur de retour :**

- `void` : 

#### `setT(id, val)`

Assigne le texte formaté à un élément cible identifié par son ID.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `id` | `string` | **Requis** | - Identifiant de l'élément HTML. |
| `val` | `string` | **Requis** | - Chaîne de caractères à injecter. |


#### `initCompoundInterest()`

Initialise le simulateur d'épargne et d'intérêts composés avec projection graphique sur Canvas.
Modélise la capitalisation mensuelle des versements programmés et le réinvestissement continu des gains.


**Valeur de retour :**

- `void` : 

#### `setT(id, val)`

Met à jour le texte d'un élément d'affichage.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `id` | `string` | **Requis** | - Sélecteur de l'élément cible. |
| `val` | `string` | **Requis** | - Texte formaté avec séparateurs de milliers. |


#### `drawChart(data)`

Effectue le rendu graphique haute fidélité (compatible écrans Retina HiDPI) sur l'élément Canvas.
Trace la grille des montants, l'aire des versements cumulés et l'aire d'amplification des intérêts.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `data` | `CompoundInterestPoint[]` | **Requis** | - Tableau chronologique des données simulées. |


#### `getX(idx)`

Mappe l'index chronologique en coordonnée X sur le canvas.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `idx` | `number` | **Requis** | - Index de l'année dans le tableau. |



**Valeur de retour :**

- `number` : Coordonnée X en pixels.

#### `getY(val)`

Mappe un montant monétaire en ordonnée Y sur le canvas.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `val` | `number` | **Requis** | - Montant en euros. |



**Valeur de retour :**

- `number` : Coordonnée Y en pixels.


---


## <a id="jstoolsmarketingtoolsjs"></a>marketing-tools.js

**Fichier :** [`js/tools/marketing-tools.js`](../js/tools/marketing-tools.js)  

**Module :** `MarketingTools`  

**Espace de noms (Namespace) :** `MarketingTools`  


### Définitions de Types (`@typedef`)

#### `InstagramCroppedTile` (Object)


| Propriété | Type | Description |
|---|---|---|
| `blob` | `Blob` | - Données binaires de la vignette découpée en JPEG. |
| `order` | `number` | - Ordre chronologique de publication sur Instagram (le post #1 se publiant en premier pour finir en bas à droite). |
| `filename` | `string` | - Nom de fichier séquentiel préconisé pour l'export. |



### Fonctions et Méthodes

#### `init()`

Initialise l'ensemble des modules d'outils marketing au démarrage de l'application.


**Valeur de retour :**

- `void` : 

#### `initMetaPreview()`

Initialise le simulateur d'aperçu de partage sur les réseaux sociaux (Facebook, Twitter/X, LinkedIn)
et le générateur de balises méta HTML correspondantes.
Met à jour en temps réel le DOM des aperçus visuels et le bloc de code HTML copiable.


**Valeur de retour :**

- `void` : 

#### `initUtmBuilder()`

Initialise le constructeur de paramètres UTM (Urchin Tracking Module).
Assemble en direct une URL enrichie pour le suivi des campagnes (source, medium, campaign, term, content).
Fournit des pastilles de raccourcis rapides pour les sources d'acquisition courantes (LinkedIn, Facebook, Email, CPC).


**Valeur de retour :**

- `void` : 

#### `setParam(key, val)`

Définit ou supprime un paramètre de requête dans l'URL.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `key` | `string` | **Requis** | - Nom du paramètre d'URL (ex: 'utm_source'). |
| `val` | `string|undefined` | **Requis** | - Valeur à assigner. |


#### `initInstagramGrid()`

Initialise l'outil de découpe d'images pour grilles Instagram en disposition 3 colonnes (1x3, 2x3 ou 3x3 carrés).
Gère le centrage automatique, le découpage Canvas haute définition, la numérotation inversée
adaptée à l'algorithme d'affichage d'Instagram, ainsi que l'archivage ZIP structuré via JSZip.


**Valeur de retour :**

- `void` : 

#### `processImage(img)`

Découpe l'image source en carrés parfaits selon la disposition choisie.
Calcule l'ordre de publication spécifique à Instagram : les nouveaux posts étant insérés en haut à gauche,
la première photo à publier doit obligatoirement être le carré situé en bas à droite de la fresque.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `img` | `HTMLImageElement` | **Requis** | - Image source chargée. |



---


## <a id="jstoolsproductivitytoolsjs"></a>productivity-tools.js

**Fichier :** [`js/tools/productivity-tools.js`](../js/tools/productivity-tools.js)  

**Module :** `ProductivityTools`  

**Espace de noms (Namespace) :** `ProductivityTools`  


### Définitions de Types (`@typedef`)

#### `CityTimezoneItem` (Object)


| Propriété | Type | Description |
|---|---|---|
| `id` | `string` | - Identifiant technique unique de la ville. |
| `name` | `string` | - Nom usuel de la métropole ou de l'agglomération. |
| `tz` | `string` | - Identifiant IANA de fuseau horaire (ex: 'Europe/Paris', 'America/New_York'). |
| `flag` | `string` | - Émoji représentant le drapeau national correspondant. |



### Fonctions et Méthodes

#### `init()`

Initialise l'ensemble des sous-modules de productivité au démarrage.


**Valeur de retour :**

- `void` : 

#### `initTimezonePlanner()`

Initialise le planificateur matriciel de fuseaux horaires mondiaux.
Affiche une frise de 24 heures par ville sélectionnée, identifie les heures de travail locales (09:00 - 18:00)
et calcule automatiquement les créneaux communs de collaboration simultanée (overlap) entre toutes les villes actives.


**Valeur de retour :**

- `void` : 

#### `getCityOffsetHours(tz)`

Calcule le décalage horaire relatif (en heures) entre le fuseau IANA cible et l'heure locale du navigateur.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `tz` | `string` | **Requis** | - Identifiant IANA de la zone horaire. |



**Valeur de retour :**

- `number` : Différence d'heures (positive ou négative).

#### `initDateCalculator()`

Initialise le calculateur d'intervalles calendaires et de projections temporelles.
Mode 1 : Mesure précise de la durée entre deux dates (jours réels, semaines résiduelles, jours ouvrés du lundi au vendredi, total d'heures).
Mode 2 : Projection de date par addition ou soustraction de jours, semaines, mois ou années.


**Valeur de retour :**

- `void` : 

#### `toYMD(d)`

Formate un objet Date au standard ISO 'YYYY-MM-DD'.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `d` | `Date` | **Requis** | - Date à formater. |



**Valeur de retour :**

- `string` : Chaîne au format ISO YYYY-MM-DD.

#### `setVal(id, val)`

Assigne le texte formaté à un élément HTML.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `id` | `string` | **Requis** | - Identifiant de l'élément. |
| `val` | `string` | **Requis** | - Valeur textuelle. |


#### `initPomodoro()`

Initialise le minuteur de concentration selon la méthode Pomodoro.
Gère trois modes temporels (Focus 25 min, Pause courte 5 min, Pause longue 15 min),
une synthèse audio procédurale en temps réel de bruits d'ambiance relaxants (pluie rose filtrée, café brun, vagues modulées par LFO),
et un gestionnaire de liste de tâches rapides intégrée à la session.


**Valeur de retour :**

- `void` : 

#### `playNoise(type)`

Génère dynamiquement en mémoire un tampon audio de bruit procédural (Rain, Cafe ou Waves).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `type` | `string` | **Requis** | - Type d'ambiance ('rain', 'cafe', 'waves' ou 'none'). |



---


## <a id="jstoolstexttoolsjs"></a>text-tools.js

**Fichier :** [`js/tools/text-tools.js`](../js/tools/text-tools.js)  

**Module :** `TextTools`  

**Espace de noms (Namespace) :** `TextTools`  


### Définitions de Types (`@typedef`)

#### `DiffEntry` (Object)


| Propriété | Type | Description |
|---|---|---|
| `type` | `'same'|'add'|'del'` | - Nature de la ligne différentielle ('same' = inchangée, 'add' = ajoutée dans B, 'del' = supprimée de A). |
| `text` | `string` | - Contenu brut de la ligne de texte. |
| `lineA` | `number|string` | - Numéro de ligne dans le document d'origine A (ou chaîne vide si ajoutée). |
| `lineB` | `number|string` | - Numéro de ligne dans le document révisé B (ou chaîne vide si supprimée). |



### Fonctions et Méthodes

#### `init()`

Initialise l'ensemble des modules d'outils textuels au démarrage.


**Valeur de retour :**

- `void` : 

#### `initDiffTool()`

Initialise le comparateur visuel de différences textuelles (Diff Tool).
Implémente la programmation dynamique de la Plus Longue Sous-Séquence Commune (LCS)
pour produire une vue unifiée avec numérotation de lignes et coloration syntaxique des ajouts/suppressions.


**Valeur de retour :**

- `void` : 

#### `computeLCS(a, b)`

Construit la matrice de programmation dynamique pour l'algorithme LCS (Longest Common Subsequence).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `a` | `string[]` | **Requis** | - Tableau des lignes du document A. |
| `b` | `string[]` | **Requis** | - Tableau des lignes du document B. |



**Valeur de retour :**

- `Int32Array[]` : Matrice 2D (m+1) x (n+1) contenant les longueurs des sous-séquences communes.

#### `buildDiff(a, b)`

Remonte la matrice LCS pour générer la liste séquentielle des lignes avec leur statut différentiel.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `a` | `string[]` | **Requis** | - Lignes du document original. |
| `b` | `string[]` | **Requis** | - Lignes du document comparé. |



**Valeur de retour :**

- `DiffEntry[]` : Liste chronologique ordonnée des lignes avec métadonnées.

#### `escapeHtml(str)`

Échappe les caractères HTML dangereux pour prévenir les injections XSS.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `str` | `string` | **Requis** | - Chaîne brute. |



**Valeur de retour :**

- `string` : Chaîne sécurisée avec entités HTML.

#### `initWordCounter()`

Initialise le compteur de mots, de caractères, de phrases et de paragraphes en temps réel.
Fournit une estimation du temps de lecture (200 mots/min) et de prise de parole (130 mots/min),
ainsi qu'un tableau de densité lexicale extrayant les mots-clés les plus fréquents après élimination des mots vides (stop-words).


**Valeur de retour :**

- `void` : 

#### `setText(id, val)`

Assigne la valeur textuelle formatée à l'élément cible.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `id` | `string` | **Requis** | - Identifiant DOM. |
| `val` | `string` | **Requis** | - Chaîne de caractères. |


#### `initCaseConverter()`

Initialise le convertisseur de casse prenant en charge 9 notations courantes :
camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, UPPERCASE, lowercase, Sentence case.


**Valeur de retour :**

- `void` : 

#### `getWords(str)`

Découpe une chaîne en liste de mots élémentaires indépendamment du format d'entrée (camelCase, snake_case, etc.).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `str` | `string` | **Requis** | - Texte d'entrée brut. |



**Valeur de retour :**

- `string[]` : Liste des mots identifiés.

#### `initTextCleaner()`

Initialise l'outil de nettoyage et d'assainissement de texte typographique.
Propose différentes options configurables : suppression des balises HTML, conversion des tabulations en espaces,
suppression des espaces multiples, élimination des lignes vides consécutives et normalisation des guillemets.


**Valeur de retour :**

- `void` : 


---


## <a id="jstoolsutilitytoolsjs"></a>utility-tools.js

**Fichier :** [`js/tools/utility-tools.js`](../js/tools/utility-tools.js)  

**Module :** `UtilityTools`  

**Espace de noms (Namespace) :** `UtilityTools`  


### Définitions de Types (`@typedef`)

#### `ExtractedColor` (Object)


| Propriété | Type | Description |
|---|---|---|
| `hex` | `string` | - Valeur hexadécimale de la couleur au format '#RRGGBB'. |
| `rgb` | `string` | - Formatage textuel CSS fonctionnel 'rgb(r, g, b)'. |
| `r` | `number` | - Composante rouge (0 à 255). |
| `g` | `number` | - Composante verte (0 à 255). |
| `b` | `number` | - Composante bleue (0 à 255). |



### Fonctions et Méthodes

#### `init()`

Initialise les trois sous-modules utilitaires au démarrage du script.


**Valeur de retour :**

- `void` : 

#### `initQrCode()`

Initialise le constructeur interactif de codes QR.
Prend en charge les protocoles standard : URL web, configuration réseau Wi-Fi, fiche contact vCard 3.0,
message brut et carte de restaurant. Permet la personnalisation des teintes (fond / premier plan)
et le téléchargement en haute définition matricielle PNG ou vectorielle SVG.


**Valeur de retour :**

- `void` : 

#### `getPayload()`

Formate la charge utile textuelle (payload) du QR code selon le standard sélectionné.


**Valeur de retour :**

- `string` : Chaîne standardisée encodée dans le symbole 2D.

#### `initPasswordGenerator()`

Initialise le générateur aléatoire de mots de passe cryptographiquement sûrs.
Utilise l'API native window.crypto.getRandomValues pour garantir l'absence de biais pseudo-aléatoire,
calcule l'entropie de Shannon en bits (E = L * log2(Taille_Pool)) et fournit une jauge de robustesse dynamique.


**Valeur de retour :**

- `void` : 

#### `initPaletteExtractor()`

Initialise l'extracteur de palette de couleurs dominantes depuis une image téléversée.
Prend en charge le glisser-déposer, l'API EyeDropper native, la copie en bloc HEX, CSS Variables et JSON.


**Valeur de retour :**

- `void` : 

#### `hexToRgbString(hex)`

Convertit un code hexadécimal '#RRGGBB' en chaîne fonctionnelle 'rgb(r, g, b)'.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `hex` | `string` | **Requis** | - Code hexadécimal précédé ou non d'un dièse. |



**Valeur de retour :**

- `string` : Chaîne fonctionnelle CSS formatée.

#### `generateSamplePaletteImage()`

Génère une composition picturale colorée sur un Canvas temporaire pour tester l'extracteur.


**Valeur de retour :**

- `void` : 

#### `extractDominantColors(img)`

Extrait jusqu'à 8 couleurs dominantes et distinctes à partir d'une image HTML.
Utilise un sous-échantillonnage matriciel (largeur 100px), une quantification par pas de 24 niveaux
et une distance euclidienne 3D (seuil > 38) pour éviter les teintes trop proches.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `img` | `HTMLImageElement` | **Requis** | - Image source analysée. |



**Valeur de retour :**

- `void` : 

#### `rgbToHex(r, g, b)`

Formate un triplet RGB en code hexadécimal.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `r` | `number` | **Requis** | - Composante rouge. |
| `g` | `number` | **Requis** | - Composante verte. |
| `b` | `number` | **Requis** | - Composante bleue. |



**Valeur de retour :**

- `string` : Code hexadécimal majuscule.

#### `colorDistance(}, })`

Calcule la distance euclidienne tridimensionnelle entre deux teintes RGB.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `}` | `{ r: number, g: number, b: number ` | **Requis** | c1 - Première couleur. |
| `}` | `{ r: number, g: number, b: number ` | **Requis** | c2 - Seconde couleur. |



**Valeur de retour :**

- `number` : Distance euclidienne dans l'espace RGB.

#### `renderPaletteGrid(palette)`

Génère les cartes d'échantillons de couleur dans la grille DOM.
Calcule dynamiquement le contraste perçu (formule ITU-R BT.601) pour adapter la couleur du texte (noir ou blanc).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `palette` | `ExtractedColor[]` | **Requis** | - Nuancier à afficher. |



**Valeur de retour :**

- `void` : 


---


## <a id="jstoolsdevtoolsjs"></a>dev-tools.js

**Fichier :** [`js/tools/dev-tools.js`](../js/tools/dev-tools.js)  

**Module :** `DevTools`  

**Espace de noms (Namespace) :** `DevTools`  


### Fonctions et Méthodes

#### `init()`

Initialise les quatre sous-modules d'ingénierie au démarrage.


**Valeur de retour :**

- `void` : 

#### `initJsonFormatter()`

Initialise le formateur, validateur syntaxique et minificateur de documents JSON.
Propose une indentation configurable (2 espaces, 4 espaces ou compacte minifiée),
la génération d'un arbre syntaxique HTML enrichi en styles CSS, et le téléchargement du résultat.


**Valeur de retour :**

- `void` : 

#### `validateAndFormat([indentSpaces=2])`

Valide la syntaxe JSON du champ de saisie et met à jour l'arbre syntaxique ou le message d'erreur.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `[indentSpaces=2]` | `number` | Optionnel | - Nombre d'espaces d'indentation (0 pour minifier). |


#### `colorizeJson(obj, [indent=0])`

Produit récursivement le code HTML colorisé correspondant aux types de données JSON
(clés, chaînes, nombres, booléens, valeurs nulles, tableaux et objets).


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `obj` | `any` | **Requis** | - Objet ou valeur primitive JSON à représenter. |
| `[indent=0]` | `number` | Optionnel | - Niveau d'indentation hiérarchique actuel. |



**Valeur de retour :**

- `string` : Fragment HTML balisé avec les classes CSS de coloration.

#### `initRegexTester()`

Initialise le banc d'évaluation d'expressions régulières en temps réel.
Analyse le motif Regex et les drapeaux (g = global, i = insensible à la casse, m = multiligne, s = dotAll),
synchronise le calque de surlignage avec le défilement de la zone de texte, et dresse le tableau des groupes de capture.


**Valeur de retour :**

- `void` : 

#### `initShadowGenerator()`

Initialise le générateur visuel d'ombres portées CSS (box-shadow) et de presets neumorphiques.
Gère les curseurs de déplacement horizontal (X), vertical (Y), flou (blur), étalement (spread), opacité et incrustation (inset).
Fournit des préréglages neumorphiques pour interfaces modernes (effet plat, concave, convexe et pressé).


**Valeur de retour :**

- `void` : 

#### `hexToRgba(hex, alpha)`

Convertit une couleur hexadécimale et une opacité décimale en chaîne CSS 'rgba(r, g, b, a)'.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `hex` | `string` | **Requis** | - Code hexadécimal '#RRGGBB'. |
| `alpha` | `number` | **Requis** | - Taux d'opacité entre 0 et 1. |



**Valeur de retour :**

- `string` : Chaîne fonctionnelle CSS rgba.

#### `initBase64Tool()`

Initialise le module d'encodage et décodage Base64.
Utilise TextEncoder / TextDecoder pour garantir la prise en charge intégrale des caractères UTF-8 (accents, émojis),
et gère la conversion de fichiers physiques en Data URLs base64 via FileReader avec prévisualisation pour images.


**Valeur de retour :**

- `void` : 

#### `utf8ToBase64(str)`

Encode une chaîne de caractères Unicode en Base64 de manière sécurisée via TextEncoder.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `str` | `string` | **Requis** | - Chaîne UTF-8 source. |



**Valeur de retour :**

- `string` : Chaîne binaire encodée en Base64.

#### `base64ToUtf8(base64)`

Décode une chaîne Base64 vers son texte d'origine UTF-8 via TextDecoder.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `base64` | `string` | **Requis** | - Données encodées en Base64. |



**Valeur de retour :**

- `string` : Texte décodé en UTF-8.

#### `escapeHtml(str)`

Échappe les caractères réservés HTML pour prémunir les injections XSS lors de l'injection dynamique dans le DOM.


**Paramètres :**

| Paramètre | Type | Statut | Description |
|---|---|---|---|
| `str` | `any` | **Requis** | - Valeur à sécuriser. |



**Valeur de retour :**

- `string` : Chaîne sécurisée avec entités HTML standard (&amp;, &lt;, &gt;, &quot;, &#039;).


---


## <a id="apiapiphp"></a>api.php

**Fichier :** [`api/api.php`](../api/api.php)  


### Fonctions et Méthodes

#### `Endpoint REST : ?action=status()`

Diagnostic d'état et capacités de l'environnement d'exécution PHP.
Renvoie la version de PHP, le système d'exploitation, les quotas de téléversement et les extensions actives.

#### `Endpoint REST : ?action=echo_base64()`

Vérification de charge utile Base64 (calcul de longueur et empreinte MD5).
Reçoit un objet JSON en POST : `{"data": "<string>"}`.

#### `Endpoint REST : ?action=fetch_url()`

Proxy de récupération HTTP pour la conversion de pages distantes en PDF.
Valide l'URL cible, restreint les protocoles à http/https et télécharge le code HTML avec un User-Agent de lecture.
Paramètre GET attendu : `url=<target_url>`


---
