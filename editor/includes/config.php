<?php
/**
 * Neofox Media Visual Editor - Configuration
 * Update these settings for your environment
 */

// Database Configuration (SQLite for simplicity on shared hosting)
define('DB_PATH', __DIR__ . '/../database/editor.db');

// Security Configuration
define('EDITOR_USERNAME', 'admin'); // Change this!
define('EDITOR_PASSWORD', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); // Default: 'password' - Change this!
// To generate new password hash, use: password_hash('your_password', PASSWORD_DEFAULT);

// Upload Configuration
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
define('ALLOWED_VIDEO_TYPES', ['mp4', 'webm', 'ogg', 'mov']);

// Editor Settings
define('AUTO_BACKUP', true);
define('BACKUP_LIMIT', 10); // Keep last 10 backups
define('ENABLE_HISTORY', true);
define('HISTORY_LIMIT', 50); // Undo/Redo limit

// API Keys (optional - for advanced features)
define('UNSPLASH_API_KEY', ''); // For stock images
define('GIPHY_API_KEY', ''); // For GIF search

// Theme Settings
define('EDITOR_THEME', 'dark'); // 'light' or 'dark'

// Session Configuration - Moved to login.php to avoid "headers already sent" errors
// ini_set('session.gc_maxlifetime', 3600 * 24); // 24 hours
// session_set_cookie_params(3600 * 24);

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Initialize Database
function initDatabase() {
    if (!file_exists(DB_PATH)) {
        $dir = dirname(DB_PATH);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $db = new SQLite3(DB_PATH);

        // Create tables
        $db->exec("
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT UNIQUE NOT NULL,
                content TEXT,
                metadata TEXT,
                last_modified DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $db->exec("
            CREATE TABLE IF NOT EXISTS media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                original_filename TEXT NOT NULL,
                file_type TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                file_path TEXT NOT NULL,
                thumbnail_path TEXT,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            );
        ");

        $db->exec("
            CREATE TABLE IF NOT EXISTS revisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id)
            );
        ");

        $db->exec("
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $db->close();
    }
}

// Initialize on first load
initDatabase();