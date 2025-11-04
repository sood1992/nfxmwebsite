<?php
/**
 * Neofox Media Visual Editor - Logout
 */

// Initialize database session handler
require_once __DIR__ . '/includes/session-handler.php';
$sessionDbPath = __DIR__ . '/database/sessions.db';
initDatabaseSessions($sessionDbPath);

session_start();
session_destroy();

header('Location: login.php');
exit;
