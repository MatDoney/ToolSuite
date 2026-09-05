<?php
/**
 * ToolSuite - Mentions Légales & Politique de Confidentialité (PHP)
 */
$php_version = PHP_VERSION;
?>
<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentions Légales & Politique de Confidentialité • ToolSuite (PHP)</title>
  <meta name="description" content="Mentions légales, informations éditeur, hébergeur et politique de confidentialité de l'application web ToolSuite. Traitement local et respect du RGPD.">
  <meta name="robots" content="noindex, follow">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>

  <!-- Sticky Top Navigation Bar -->
  <header class="legal-nav-bar">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <a href="index.php" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
        ← Retour aux outils
      </a>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">⚡ ToolSuite</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">• Mentions Légales (PHP <?= htmlspecialchars($php_version) ?>)</span>
      </div>
    </div>

    <div class="header-actions">
      <button class="theme-toggle-btn" id="theme-toggle-btn" title="Bascule mode sombre/clair">☀️</button>
    </div>
  </header>

  <!-- Legal Container -->
  <main class="legal-container">
    
    <div class="legal-header">
      <h1 class="legal-title">Mentions Légales & Politique de Confidentialité</h1>
      <p class="legal-subtitle">
        Conformément aux dispositions de l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN) 
        et au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).
      </p>
    </div>

    <!-- Notice explicative sur les balises à compléter -->
    <div class="legal-notice-box">
      <strong>ℹ️ Note à l'attention de l'administrateur :</strong><br>
      Les éléments ci-dessous signalés par les balises <a-completer>&lt;À COMPLÉTER&gt;</a-completer> représentent des 
      <strong>obligations légales obligatoires</strong> en droit français et européen. Vous devez renseigner vos coordonnées exactes avant la mise en production du site.
    </div>

    <!-- 1. Éditeur du Site -->
    <section class="legal-card">
      <h2 class="legal-card-title">1. Identification de l'Éditeur du Site</h2>
      <div class="legal-card-content">
        <p>Le site web <strong>ToolSuite</strong> est édité et exploité par :</p>
        <ul>
          <li><strong>Dénomination ou Raison Sociale :</strong> <a-completer>&lt;À COMPLÉTER : Nom de la Société ou Nom et Prénom de l'exploitant&gt;</a-completer></li>
          <li><strong>Statut juridique & Capital social :</strong> <a-completer>&lt;À COMPLÉTER : Forme juridique (ex. SAS, SARL, EI, Association) au capital de [Montant en euros] €&gt;</a-completer></li>
          <li><strong>Siège social / Adresse :</strong> <a-completer>&lt;À COMPLÉTER : Numéro, rue, code postal, ville et pays&gt;</a-completer></li>
          <li><strong>Numéro d'immatriculation :</strong> <a-completer>&lt;À COMPLÉTER : Immatriculé au Registre du Commerce et des Sociétés (RCS) de [Ville] sous le numéro [Numéro SIREN / RCS]&gt;</a-completer></li>
          <li><strong>Numéro SIRET :</strong> <a-completer>&lt;À COMPLÉTER : [Numéro SIRET à 14 chiffres]&gt;</a-completer></li>
          <li><strong>Numéro de TVA intracommunautaire :</strong> <a-completer>&lt;À COMPLÉTER : FR [Code TVA] ou mention « Non assujetti à la TVA en vertu de l'article 293 B du CGI »&gt;</a-completer></li>
          <li><strong>Adresse de courrier électronique (Email) :</strong> <a-completer>&lt;À COMPLÉTER : contact@votredomaine.fr&gt;</a-completer></li>
          <li><strong>Numéro de téléphone :</strong> <a-completer>&lt;À COMPLÉTER : +33 (0)X XX XX XX XX&gt;</a-completer></li>
        </ul>
      </div>
    </section>

    <!-- 2. Direction de la Publication -->
    <section class="legal-card">
      <h2 class="legal-card-title">2. Directeur de la Publication</h2>
      <div class="legal-card-content">
        <p>
          <strong>Directeur de la publication :</strong> <a-completer>&lt;À COMPLÉTER : Nom et prénom du Directeur de publication (ex. représentant légal)&gt;</a-completer><br>
          <strong>Qualité :</strong> <a-completer>&lt;À COMPLÉTER : Président / Gérant / Fondateur&gt;</a-completer><br>
          <strong>Responsable de la rédaction :</strong> <a-completer>&lt;À COMPLÉTER : Nom et prénom du responsable de la rédaction&gt;</a-completer>
        </p>
      </div>
    </section>

    <!-- 3. Hébergement du Site -->
    <section class="legal-card">
      <h2 class="legal-card-title">3. Hébergement du Site Internet</h2>
      <div class="legal-card-content">
        <p>Le site est hébergé conformément aux exigences de l'article 6-I-4 de la LCEN par :</p>
        <ul>
          <li><strong>Nom de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Nom de l'hébergeur (ex: OVH SAS, Cloudflare Inc., Scaleway, GitHub Inc.)&gt;</a-completer></li>
          <li><strong>Raison sociale :</strong> <a-completer>&lt;À COMPLÉTER : Raison sociale et forme de l'hébergeur&gt;</a-completer></li>
          <li><strong>Siège social de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Adresse postale complète de l'hébergeur&gt;</a-completer></li>
          <li><strong>Contact de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Téléphone de l'hébergeur ou URL d'assistance&gt;</a-completer></li>
        </ul>
      </div>
    </section>

    <!-- 4. Architecture Technique & Confidentialité 100% Locale -->
    <section class="legal-card">
      <h2 class="legal-card-title">4. Architecture Technique & Traitement Local (Vie Privée)</h2>
      <div class="legal-card-content">
        <p>
          L'application <strong>ToolSuite</strong> se distingue par une architecture technique conçue pour garantir la <strong>confidentialité absolue</strong> de ses utilisateurs :
        </p>
        <ul>
          <li><strong>Zéro téléversement serveur (Zero-Upload) :</strong> Tous les calculs, conversions, compressions et manipulations de documents (PDF, images, textes, fichiers audio, codes) s'exécutent <strong>exclusivement en local dans le navigateur web (RAM)</strong> de votre terminal au moyen des technologies standards HTML5, Canvas 2D, Web Audio API et JavaScript.</li>
          <li><strong>Absence de transmission :</strong> Aucun fichier ou document soumis dans les outils n'est transmis, stocké, intercepté ni enregistré sur un quelconque serveur de l'éditeur ou de tiers.</li>
          <li><strong>Effacement automatique :</strong> Dès la fermeture de l'onglet ou de la fenêtre de votre navigateur, les données temporaires chargées en mémoire vive sont définitivement détruites.</li>
        </ul>
      </div>
    </section>

    <!-- 5. Protection des Données Personnelles (RGPD) -->
    <section class="legal-card">
      <h2 class="legal-card-title">5. Protection des Données Personnelles (RGPD & CNIL)</h2>
      <div class="legal-card-content">
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la Loi Informatique et Libertés du 6 janvier 1978 modifiée :
        </p>
        <ul>
          <li><strong>Responsable de traitement :</strong> <a-completer>&lt;À COMPLÉTER : Nom de la personne ou entité responsable du traitement des données&gt;</a-completer></li>
          <li><strong>Délégué à la Protection des Données (DPO) :</strong> <a-completer>&lt;À COMPLÉTER : Coordonnées du DPO (ou mention « Aucun DPO n'est requis au titre de l'article 37 du RGPD »)&gt;</a-completer></li>
          <li><strong>Données collectées :</strong> ToolSuite ne procède à aucune création de compte obligatoire, aucune collecte de profilage et aucun stockage de documents personnels. Seules des données de connexion purement techniques (logs serveurs standards anonymisés : adresse IP tronquée, horodatage) peuvent être conservées par l'hébergeur pour des motifs légitimes de sécurité informatique et de prévention des attaques DDoS.</li>
          <li><strong>Exercice de vos droits :</strong> Vous disposez d'un droit d'accès, de rectification, de limitation et d'effacement de vos données personnelles. Vous pouvez exercer ces droits en vous adressant par courriel à : <a-completer>&lt;À COMPLÉTER : dpo@votredomaine.fr ou email dédié&gt;</a-completer>.</li>
          <li><strong>Réclamation :</strong> Si vous estimez que vos droits ne sont pas respectés, vous avez la faculté d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés – <a href="https://www.cnil.fr" target="_blank" rel="noopener" style="color: var(--accent-primary);">www.cnil.fr</a>).</li>
        </ul>
      </div>
    </section>

    <!-- 6. Cookies et Stockage Local -->
    <section class="legal-card">
      <h2 class="legal-card-title">6. Politique de Cookies & Traceurs</h2>
      <div class="legal-card-content">
        <p>
          Ce site applique une stricte politique de sobriété numérique :
        </p>
        <ul>
          <li><strong>Aucun cookie publicitaire ni traceur commercial tiers :</strong> ToolSuite n'utilise aucun cookie de ciblage publicitaire ni tracker intrusif.</li>
          <li><strong>Stockage local technique (localStorage) :</strong> Le site utilise exclusivement le stockage local de votre navigateur (<code>localStorage</code>) pour conserver votre préférence esthétique (thème sombre ou clair). Ce traceur étant strictement technique et indispensable au service, il est exempté de consentement préalable conformément aux lignes directrices de la CNIL.</li>
        </ul>
      </div>
    </section>

    <!-- 7. Propriété Intellectuelle & Mention IA -->
    <section class="legal-card">
      <h2 class="legal-card-title">7. Propriété Intellectuelle & Transparence IA</h2>
      <div class="legal-card-content">
        <p>
          <strong>Licence du Code Source :</strong> L'ensemble du code source, de la structure et des composants de ToolSuite est distribué sous licence libre <strong>MIT</strong>. Vous êtes libre de l'utiliser, le copier, le modifier et l'adapter sous réserve du respect des conditions de la licence.
        </p>
        <p>
          <strong>🤖 Mention de Génération par Intelligence Artificielle :</strong><br>
          En toute transparence, l'architecture logicielle, le design visuel ainsi que l'intégralité du code source (HTML, CSS, JavaScript, PHP) de cette application ont été <strong>entièrement générés et conçus par Intelligence Artificielle (IA - Google DeepMind / Antigravity)</strong>.
        </p>
        <p>
          <strong>Bibliothèques open source tierces :</strong> Les bibliothèques intégrées demeurent la propriété exclusive de leurs auteurs respectifs sous leurs licences associées (PDF-Lib, Tesseract.js, Marked.js, JSZip, QRCode.js).
        </p>
      </div>
    </section>

    <!-- 8. Limitation de Responsabilité -->
    <section class="legal-card">
      <h2 class="legal-card-title">8. Limitation de Responsabilité & Avertissements</h2>
      <div class="legal-card-content">
        <p>
          ToolSuite met à la disposition des utilisateurs ses 30 outils informatiques à titre purement gracieux et indicatif (« en l'état ») :
        </p>
        <ul>
          <li><strong>Outils financiers et de calcul :</strong> Les résultats issus des simulateurs d'intérêts composés, du calculateur de pourcentages ou du partage de note ont une valeur strictement indicative et illustrative. Ils ne sauraient se substituer à un conseil professionnel, fiscal, comptable ou juridique agréé.</li>
          <li><strong>Sauvegarde :</strong> L'utilisateur demeure seul responsable de la conservation et de la sauvegarde de ses documents originaux préalablement à tout traitement. L'éditeur décline toute responsabilité en cas de perte de données résultant d'une manipulation inadaptée ou d'une défaillance du terminal de l'utilisateur.</li>
        </ul>
      </div>
    </section>

    <!-- 9. Droit Applicable -->
    <section class="legal-card">
      <h2 class="legal-card-title">9. Droit Applicable et Juridiction Compétente</h2>
      <div class="legal-card-content">
        <p>
          Les présentes mentions légales sont soumises au <strong>droit français</strong>. Tout litige relatif à l'interprétation, la validité ou l'exécution des présentes sera porté, à défaut de résolution amiable, devant les tribunaux compétents de :<br>
          <a-completer>&lt;À COMPLÉTER : Tribunal de Commerce compétent (ex: Tribunal de Commerce de Paris)&gt;</a-completer>.
        </p>
        <p style="margin-top: 1rem; font-size: 0.78rem; color: var(--text-muted);">
          Dernière mise à jour : <strong>5 septembre 2026</strong>.
        </p>
      </div>
    </section>

  </main>

  <!-- Script minimaliste pour le thème -->
  <script src="js/ui.js"></script>
  <script>
    UI.initTheme();
  </script>

</body>
</html>
