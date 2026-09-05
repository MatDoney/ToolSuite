<?php
/**
 * ToolSuite - Mentions Légales & Politique de Confidentialité (PHP)
 * Adapté pour Éditeur Particulier (Site non professionnel)
 */
$php_version = PHP_VERSION;
?>
<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentions Légales & Politique de Confidentialité • ToolSuite (PHP)</title>
  <meta name="description" content="Mentions légales de ToolSuite pour éditeur particulier : respect de la loi LCEN, anonymat préservé, hébergement et politique de confidentialité RGPD.">
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
        Site internet édité à titre personnel et non professionnel par un particulier.<br>
        En conformité avec l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN) 
        et le Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).
      </p>
    </div>

    <!-- Notice explicative sur le statut de particulier -->
    <div class="legal-notice-box">
      <strong>ℹ️ Statut d'Éditeur Particulier (Site non professionnel) :</strong><br>
      Conformément à <strong>l'article 6, III, 2° de la loi LCEN n° 2004-575 du 21 juin 2004</strong>, les personnes physiques éditant un site web à titre non professionnel ont le droit légal de préserver leur anonymat public (non-divulgation de leur nom, prénom et domicile personnel sur le site), dès lors qu'elles ont transmis ces éléments d'identification complets à leur hébergeur.<br>
      Les balises <a-completer>&lt;À COMPLÉTER&gt;</a-completer> ci-dessous vous permettent soit d'indiquer votre identité publiquement, soit d'opter pour la clause d'anonymat prévue par la loi.
    </div>

    <!-- 1. Éditeur du Site (Particulier) -->
    <section class="legal-card">
      <h2 class="legal-card-title">1. Identification de l'Éditeur du Site (Particulier)</h2>
      <div class="legal-card-content">
        <p>Le site internet <strong>ToolSuite</strong> est un service gratuit, bénévole et non commercial, créé et édité par une personne physique à titre non professionnel.</p>

        <p><strong>Option A — Si vous souhaitez afficher votre identité :</strong></p>
        <ul>
          <li><strong>Nom et prénom de l'éditeur :</strong> <a-completer>&lt;À COMPLÉTER : Nom et Prénom de l'exploitant&gt;</a-completer></li>
          <li><strong>Adresse de courrier électronique (Email) :</strong> <a-completer>&lt;À COMPLÉTER : contact@votredomaine.fr&gt;</a-completer></li>
          <li><strong>Localisation / Domicile (facultatif si transmis à l'hébergeur) :</strong> <a-completer>&lt;À COMPLÉTER : Ville / Pays ou Adresse complète si souhaité&gt;</a-completer></li>
        </ul>

        <p><strong>Option B — Si vous préférez préserver votre anonymat public (Article 6, III, 2 de la LCEN) :</strong></p>
        <p style="padding: 0.85rem 1rem; background: var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.85rem; line-height: 1.6;">
          <em>« Conformément aux dispositions de l'article 6, III, 2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, l'éditeur a choisi de préserver son anonymat. Les coordonnées personnelles complètes permettant son identification ont été valablement transmises et sont conservées par l'hébergeur du site, tenu au secret professionnel, qui ne peut les communiquer que sur réquisition judiciaire. »</em>
        </p>
        <p style="margin-top: 0.75rem;">
          Pour toute question, remarque ou signalement, l'éditeur reste joignable à l'adresse suivante :<br>
          <strong>Courriel de contact :</strong> <a-completer>&lt;À COMPLÉTER : contact-toolsuite@votredomaine.fr ou lien GitHub / Réseau&gt;</a-completer>
        </p>
      </div>
    </section>

    <!-- 2. Direction de la Publication -->
    <section class="legal-card">
      <h2 class="legal-card-title">2. Directeur de la Publication</h2>
      <div class="legal-card-content">
        <p>
          En application de l'article 6, III, 1° de la LCEN, le directeur de la publication d'un site non professionnel est la personne physique éditrice :<br>
          <strong>Directeur de la publication :</strong> <a-completer>&lt;À COMPLÉTER : Nom et prénom de l'éditeur (ou mention « L'Éditeur du site » si option d'anonymat)&gt;</a-completer><br>
          <strong>Contact :</strong> <a-completer>&lt;À COMPLÉTER : email de contact de l'éditeur&gt;</a-completer>
        </p>
      </div>
    </section>

    <!-- 3. Hébergement du Site -->
    <section class="legal-card">
      <h2 class="legal-card-title">3. Hébergement du Site Internet</h2>
      <div class="legal-card-content">
        <p>
          La mention de l'hébergeur constitue la <strong>mention légale obligatoire principale</strong> pour les sites édités par des particuliers (Article 6-I-4 de la LCEN). Le site ToolSuite est hébergé par :
        </p>
        <ul>
          <li><strong>Nom / Raison sociale de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Nom de l'hébergeur (ex. GitHub Inc. via GitHub Pages, Cloudflare Inc., OVH SAS, Vercel Inc., Scaleway)&gt;</a-completer></li>
          <li><strong>Adresse postale du siège de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Adresse complète du siège de l'hébergeur (ex. 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA)&gt;</a-completer></li>
          <li><strong>Contact de l'hébergeur :</strong> <a-completer>&lt;À COMPLÉTER : Téléphone de l'hébergeur ou page web de support / contact&gt;</a-completer></li>
        </ul>
      </div>
    </section>

    <!-- 4. Architecture Technique & Confidentialité 100% Locale -->
    <section class="legal-card">
      <h2 class="legal-card-title">4. Architecture Technique & Traitement Local (Vie Privée)</h2>
      <div class="legal-card-content">
        <p>
          L'application <strong>ToolSuite</strong> a été conçue pour respecter scrupuleusement la vie privée de ses visiteurs grâce à une architecture <strong>100% locale (Zero-Upload)</strong> :
        </p>
        <ul>
          <li><strong>Zéro téléversement :</strong> Tous les calculs, conversions, compressions et manipulations de fichiers (documents PDF, images, textes, calculs financiers, générateur de QR code, etc.) s'exécutent <strong>exclusivement en local dans la mémoire vive (RAM) de votre propre navigateur</strong> à l'aide des technologies standards HTML5, Web Audio API, Canvas 2D et Vanilla JavaScript.</li>
          <li><strong>Absence de serveur intermédiaire :</strong> Aucun fichier, texte ou document soumis dans les outils n'est transmis, scanné, enregistré ou archivé sur un serveur de l'éditeur ou d'un tiers.</li>
          <li><strong>Destruction instantanée :</strong> Les données traitées disparaissent automatiquement de la mémoire de votre appareil dès la fermeture de la page ou de votre navigateur.</li>
        </ul>
      </div>
    </section>

    <!-- 5. Protection des Données Personnelles (RGPD) -->
    <section class="legal-card">
      <h2 class="legal-card-title">5. Protection des Données Personnelles (RGPD & CNIL)</h2>
      <div class="legal-card-content">
        <p>
          En tant que site personnel fonctionnant sans compte utilisateur :
        </p>
        <ul>
          <li><strong>Responsable du traitement :</strong> <a-completer>&lt;À COMPLÉTER : L'éditeur du site (courriel : votre-email@domaine.fr)&gt;</a-completer></li>
          <li><strong>Absence de collecte de données personnelles :</strong> ToolSuite ne demande aucune inscription, ne crée aucun compte utilisateur et n'effectue aucun profilage publicitaire. Seules les données techniques de connexion anonymisées (logs serveurs bruts : IP tronquée, horodatage) peuvent être conservées par l'hébergeur pour des motifs légitimes d'intégrité et de sécurité des réseaux.</li>
          <li><strong>Délégué à la protection des données (DPO) :</strong> Conformément à l'article 37 du RGPD, la désignation d'un DPO n'est pas requise pour un site personnel n'effectuant aucun traitement de données sensibles ou à grande échelle.</li>
          <li><strong>Droits des utilisateurs :</strong> Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données que vous pouvez exercer en contactant l'éditeur à : <a-completer>&lt;À COMPLÉTER : contact-rgpd@votredomaine.fr&gt;</a-completer>.</li>
          <li><strong>Réclamation :</strong> Vous conservez la possibilité d'introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener" style="color: var(--accent-primary);">www.cnil.fr</a>).</li>
        </ul>
      </div>
    </section>

    <!-- 6. Cookies et Stockage Local -->
    <section class="legal-card">
      <h2 class="legal-card-title">6. Politique de Cookies & Traceurs</h2>
      <div class="legal-card-content">
        <p>
          Le site respecte les recommandations de la CNIL relatives à la sobriété numérique :
        </p>
        <ul>
          <li><strong>Aucun cookie publicitaire ou traceur tiers :</strong> Aucun service de tracking invasif ni régie publicitaire n'est implémenté.</li>
          <li><strong>Stockage local technique (localStorage) :</strong> Le site recourt uniquement au stockage local de votre navigateur pour mémoriser votre préférence d'affichage (mode sombre ou mode clair). Ce dispositif strictement technique ne fait l'objet d'aucun croisement de données et ne requiert pas de consentement préalable au titre de l'article 82 de la loi Informatique et Libertés.</li>
        </ul>
      </div>
    </section>

    <!-- 7. Propriété Intellectuelle & Mention IA -->
    <section class="legal-card">
      <h2 class="legal-card-title">7. Propriété Intellectuelle & Transparence IA</h2>
      <div class="legal-card-content">
        <p>
          <strong>Licence MIT :</strong> Le code source de l'application est mis à disposition sous licence libre open-source <strong>MIT</strong>, autorisant une réutilisation libre dans le respect des termes de la licence.
        </p>
        <p>
          <strong>🤖 Mention de Génération par Intelligence Artificielle :</strong><br>
          En toute transparence, la structure logicielle, le design visuel et le code informatique (HTML, CSS, JavaScript, PHP) de ce projet personnel ont été <strong>entièrement conçus et générés par Intelligence Artificielle (IA - Google DeepMind / Antigravity)</strong>.
        </p>
        <p>
          <strong>Bibliothèques open source :</strong> Les bibliothèques tierces intégrées (PDF-Lib, Marked.js, Tesseract.js, JSZip, QRCode.js) demeurent la propriété exclusive de leurs auteurs respectifs sous leurs licences libres respectives.
        </p>
      </div>
    </section>

    <!-- 8. Gratuité, Absence de Garantie & Responsabilité -->
    <section class="legal-card">
      <h2 class="legal-card-title">8. Gratuité, Absence de Garantie & Responsabilité</h2>
      <div class="legal-card-content">
        <p>
          Ce site est fourni à titre bénévole, gratuit et récréatif (« en l'état ») :
        </p>
        <ul>
          <li><strong>Outils de calcul et financiers :</strong> Les résultats (pourcentages, simulateur d'intérêts composés, split bill, etc.) sont fournis à des fins purement indicatives et ne constituent en aucun cas un conseil en investissement, comptable ou juridique certifié.</li>
          <li><strong>Conservation des données :</strong> Les opérations étant effectuées localement, l'utilisateur est tenu de conserver des copies de ses fichiers d'origine. L'éditeur ne saurait être tenu responsable d'une éventuelle perte de données ou d'une mauvaise manipulation sur l'appareil de l'utilisateur.</li>
        </ul>
      </div>
    </section>

    <!-- 9. Droit Applicable -->
    <section class="legal-card">
      <h2 class="legal-card-title">9. Droit Applicable et Litiges</h2>
      <div class="legal-card-content">
        <p>
          Les présentes mentions légales sont soumises au <strong>droit français</strong>. En cas de différend ou de question concernant le service, vous êtes invité à contacter l'éditeur afin de privilégier un règlement amiable.<br>
          À défaut de conciliation amiable, les juridictions compétentes seront déterminées selon les règles du droit commun français :<br>
          <a-completer>&lt;À COMPLÉTER : Tribunal compétent (ex. Tribunaux compétents du ressort de [Votre Ville ou département])&gt;</a-completer>.
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
