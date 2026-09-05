<?php
/**
 * ToolSuite - PHP Backend Utility & API Endpoint
 * 100% Native PHP - Diagnostic, info & file processing helper
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = isset($_GET['action']) ? trim($_GET['action']) : 'status';

switch ($action) {
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

    case 'echo_base64':
        // Optional server-side verification for Base64 payload
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = $input['data'] ?? '';
            echo json_encode([
                'success' => true,
                'length' => strlen($data),
                'md5' => md5($data)
            ]);
        } else {
            echo json_encode(['error' => 'POST method required']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action inconnue']);
        break;
}
