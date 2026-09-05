<?php
/**
 * @file api.php
 * @package ToolSuite\API
 * @description Point d'entrée de l'API utilitaire REST PHP pour ToolSuite.
 * Fournit des services d'assistance côté serveur : diagnostic du serveur hôte, proxy de lecture
 * d'articles distants sans restriction CORS pour l'outil 'URL vers PDF', et validation de charges utiles.
 * @author MatDoney
 * @version 1.1.0
 * @license MIT
 */

// Configuration des en-têtes HTTP de sécurité et de négociation de contenu
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gestion des requêtes préliminaires CORS (Pre-flight OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/** @var string $action Action API sollicitée dans la chaîne de requête (défaut: 'status') */
$action = isset($_GET['action']) ? trim($_GET['action']) : 'status';

switch ($action) {
    /**
     * Diagnostic d'état et capacités de l'environnement d'exécution PHP.
     * Renvoie la version de PHP, le système d'exploitation, les quotas de téléversement et les extensions actives.
     */
    case 'status':
        echo json_encode([
            'status' => 'online',
            'server' => 'PHP ' . PHP_VERSION,
            'os' => PHP_OS,
            'max_upload_size' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'memory_limit' => ini_get('memory_limit'),
            'extensions' => [
                'gd' => extension_loaded('gd'),
                'mbstring' => extension_loaded('mbstring'),
                'fileinfo' => extension_loaded('fileinfo'),
                'zip' => extension_loaded('zip')
            ],
            'timestamp' => time()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        break;

    /**
     * Vérification de charge utile Base64 (calcul de longueur et empreinte MD5).
     * Reçoit un objet JSON en POST : `{"data": "<string>"}`.
     */
    case 'echo_base64':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = $input['data'] ?? '';
            echo json_encode([
                'success' => true,
                'length' => strlen($data),
                'md5' => md5($data)
            ]);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Méthode POST requise']);
        }
        break;

    /**
     * Proxy de récupération HTTP pour la conversion de pages distantes en PDF.
     * Valide l'URL cible, restreint les protocoles à http/https et télécharge le code HTML avec un User-Agent de lecture.
     * Paramètre GET attendu : `url=<target_url>`
     */
    case 'fetch_url':
        $target_url = isset($_GET['url']) ? trim($_GET['url']) : '';
        if (empty($target_url) || !filter_var($target_url, FILTER_VALIDATE_URL)) {
            http_response_code(400);
            echo json_encode(['error' => 'URL invalide ou manquante']);
            exit;
        }

        $scheme = parse_url($target_url, PHP_URL_SCHEME);
        if (!in_array(strtolower($scheme), ['http', 'https'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Protocole non autorisé']);
            exit;
        }

        // Configuration du contexte HTTP pour la requête distante
        $context = stream_context_create([
            'http' => [
                'timeout' => 8,
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToolSuite-Reader/1.0',
                'header' => "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);

        $html = @file_get_contents($target_url, false, $context);
        if ($html === false) {
            http_response_code(502);
            echo json_encode(['error' => 'Impossible de récupérer la page distante']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'url' => $target_url,
            'html' => $html
        ]);
        break;

    /**
     * Action non reconnue.
     */
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action inconnue']);
        break;
}
