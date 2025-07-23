<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Vérifier si Laravel est en mode maintenance
if (file_exists(__DIR__.'/storage/framework/maintenance.php')) {
    require __DIR__.'/storage/framework/maintenance.php';
}

// Définir le chemin vers le dossier public
$publicPath = __DIR__ . '/public';

// Vérifier si un fichier statique est demandé
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri !== '/' && file_exists($publicPath . $uri)) {
    return false;
}

// Charger Laravel
require __DIR__.'/vendor/autoload.php';

// Démarrer Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$app->handleRequest(Request::capture());
