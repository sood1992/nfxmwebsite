<?php
/**
 * Neofox Media Visual Editor - Helper Functions
 */

/**
 * Get database connection
 */
function getDB() {
    return new SQLite3(DB_PATH);
}

/**
 * Get all available pages
 */
function getAvailablePages() {
    $pages = [];
    $baseDir = BASE_PATH;

    // Main pages
    $mainPages = glob($baseDir . '/*.html');
    foreach ($mainPages as $page) {
        $pages[] = basename($page);
    }

    // Pages in subdirectories
    $subdirs = ['about-pages', 'contact-pages', 'home-pages', 'works-pages', 'product', 'project', 'post', 'legal'];
    foreach ($subdirs as $dir) {
        $dirPath = $baseDir . '/' . $dir;
        if (is_dir($dirPath)) {
            $subPages = glob($dirPath . '/*.html');
            foreach ($subPages as $page) {
                $pages[] = $dir . '/' . basename($page);
            }
        }
    }

    return $pages;
}

/**
 * Get page content
 */
function getPageContent($filename) {
    $filepath = BASE_PATH . '/' . $filename;
    if (file_exists($filepath)) {
        return file_get_contents($filepath);
    }
    return false;
}

/**
 * Save page content
 */
function savePageContent($filename, $content) {
    $filepath = BASE_PATH . '/' . $filename;

    // Create backup before saving
    if (AUTO_BACKUP && file_exists($filepath)) {
        createBackup($filename);
    }

    // Save to file
    $result = file_put_contents($filepath, $content);

    // Save to database
    if ($result !== false) {
        $db = getDB();
        $stmt = $db->prepare("
            INSERT OR REPLACE INTO pages (filename, content, metadata, last_modified)
            VALUES (:filename, :content, :metadata, datetime('now'))
        ");
        $stmt->bindValue(':filename', $filename, SQLITE3_TEXT);
        $stmt->bindValue(':content', $content, SQLITE3_TEXT);
        $stmt->bindValue(':metadata', json_encode(['size' => strlen($content)]), SQLITE3_TEXT);
        $stmt->execute();
        $db->close();
    }

    return $result !== false;
}

/**
 * Create backup
 */
function createBackup($filename) {
    $backupDir = BACKUP_PATH;
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }

    $filepath = BASE_PATH . '/' . $filename;
    if (file_exists($filepath)) {
        $timestamp = date('Y-m-d_H-i-s');
        $backupName = str_replace(['/', '.html'], ['_', ''], $filename) . '_' . $timestamp . '.html';
        $backupPath = $backupDir . '/' . $backupName;

        copy($filepath, $backupPath);

        // Clean old backups
        cleanOldBackups($filename);
    }
}

/**
 * Clean old backups
 */
function cleanOldBackups($filename) {
    $backupDir = BACKUP_PATH;
    $prefix = str_replace(['/', '.html'], ['_', ''], $filename);
    $backups = glob($backupDir . '/' . $prefix . '_*.html');

    if (count($backups) > BACKUP_LIMIT) {
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });

        $toDelete = array_slice($backups, 0, count($backups) - BACKUP_LIMIT);
        foreach ($toDelete as $backup) {
            unlink($backup);
        }
    }
}

/**
 * Upload media file
 */
function uploadMedia($file) {
    $uploadDir = UPLOAD_PATH;
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $originalName = $file['name'];
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $fileType = in_array($extension, ALLOWED_IMAGE_TYPES) ? 'image' : 'video';

    // Validate file type
    $allowedTypes = array_merge(ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES);
    if (!in_array($extension, $allowedTypes)) {
        return ['success' => false, 'error' => 'File type not allowed'];
    }

    // Validate file size
    if ($file['size'] > MAX_UPLOAD_SIZE) {
        return ['success' => false, 'error' => 'File too large. Maximum size: ' . (MAX_UPLOAD_SIZE / 1024 / 1024) . 'MB'];
    }

    // Generate unique filename
    $filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $originalName);
    $filepath = $uploadDir . '/' . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Create thumbnail for images
        $thumbnailPath = null;
        if ($fileType === 'image' && in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
            $thumbnailPath = createThumbnail($filepath, $uploadDir);
        }

        // Save to database
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO media (filename, original_filename, file_type, file_size, file_path, thumbnail_path, metadata)
            VALUES (:filename, :original_filename, :file_type, :file_size, :file_path, :thumbnail_path, :metadata)
        ");
        $stmt->bindValue(':filename', $filename, SQLITE3_TEXT);
        $stmt->bindValue(':original_filename', $originalName, SQLITE3_TEXT);
        $stmt->bindValue(':file_type', $fileType, SQLITE3_TEXT);
        $stmt->bindValue(':file_size', $file['size'], SQLITE3_INTEGER);
        $stmt->bindValue(':file_path', 'images/' . $filename, SQLITE3_TEXT);
        $stmt->bindValue(':thumbnail_path', $thumbnailPath, SQLITE3_TEXT);
        $stmt->bindValue(':metadata', json_encode(['extension' => $extension]), SQLITE3_TEXT);
        $stmt->execute();

        $mediaId = $db->lastInsertRowID();
        $db->close();

        return [
            'success' => true,
            'id' => $mediaId,
            'filename' => $filename,
            'url' => 'images/' . $filename,
            'thumbnail' => $thumbnailPath,
            'type' => $fileType
        ];
    }

    return ['success' => false, 'error' => 'Failed to upload file'];
}

/**
 * Create thumbnail
 */
function createThumbnail($filepath, $uploadDir, $width = 300, $height = 300) {
    $extension = strtolower(pathinfo($filepath, PATHINFO_EXTENSION));

    // Create image resource
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            $source = imagecreatefromjpeg($filepath);
            break;
        case 'png':
            $source = imagecreatefrompng($filepath);
            break;
        case 'gif':
            $source = imagecreatefromgif($filepath);
            break;
        default:
            return null;
    }

    if (!$source) return null;

    // Get dimensions
    list($origWidth, $origHeight) = getimagesize($filepath);

    // Calculate thumbnail dimensions
    $ratio = min($width / $origWidth, $height / $origHeight);
    $newWidth = $origWidth * $ratio;
    $newHeight = $origHeight * $ratio;

    // Create thumbnail
    $thumbnail = imagecreatetruecolor($newWidth, $newHeight);

    // Preserve transparency for PNG and GIF
    if ($extension === 'png' || $extension === 'gif') {
        imagealphablending($thumbnail, false);
        imagesavealpha($thumbnail, true);
    }

    imagecopyresampled($thumbnail, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);

    // Save thumbnail
    $thumbnailFilename = 'thumb_' . basename($filepath);
    $thumbnailPath = $uploadDir . '/' . $thumbnailFilename;

    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            imagejpeg($thumbnail, $thumbnailPath, 85);
            break;
        case 'png':
            imagepng($thumbnail, $thumbnailPath, 8);
            break;
        case 'gif':
            imagegif($thumbnail, $thumbnailPath);
            break;
    }

    imagedestroy($source);
    imagedestroy($thumbnail);

    return 'images/' . $thumbnailFilename;
}

/**
 * Get media library
 */
function getMediaLibrary($limit = 100, $offset = 0, $type = null) {
    $db = getDB();

    $query = "SELECT * FROM media";
    if ($type) {
        $query .= " WHERE file_type = :type";
    }
    $query .= " ORDER BY uploaded_at DESC LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($query);
    if ($type) {
        $stmt->bindValue(':type', $type, SQLITE3_TEXT);
    }
    $stmt->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $stmt->bindValue(':offset', $offset, SQLITE3_INTEGER);

    $result = $stmt->execute();
    $media = [];

    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $media[] = $row;
    }

    $db->close();
    return $media;
}

/**
 * Delete media
 */
function deleteMedia($id) {
    $db = getDB();

    // Get media info
    $stmt = $db->prepare("SELECT * FROM media WHERE id = :id");
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $media = $result->fetchArray(SQLITE3_ASSOC);

    if ($media) {
        // Delete files
        $filepath = BASE_PATH . '/' . $media['file_path'];
        if (file_exists($filepath)) {
            unlink($filepath);
        }

        if ($media['thumbnail_path']) {
            $thumbPath = BASE_PATH . '/' . $media['thumbnail_path'];
            if (file_exists($thumbPath)) {
                unlink($thumbPath);
            }
        }

        // Delete from database
        $stmt = $db->prepare("DELETE FROM media WHERE id = :id");
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();

        $db->close();
        return true;
    }

    $db->close();
    return false;
}

/**
 * Get setting
 */
function getSetting($key, $default = null) {
    $db = getDB();
    $stmt = $db->prepare("SELECT value FROM settings WHERE key = :key");
    $stmt->bindValue(':key', $key, SQLITE3_TEXT);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
    $db->close();

    return $row ? $row['value'] : $default;
}

/**
 * Set setting
 */
function setSetting($key, $value) {
    $db = getDB();
    $stmt = $db->prepare("
        INSERT OR REPLACE INTO settings (key, value, updated_at)
        VALUES (:key, :value, datetime('now'))
    ");
    $stmt->bindValue(':key', $key, SQLITE3_TEXT);
    $stmt->bindValue(':value', $value, SQLITE3_TEXT);
    $stmt->execute();
    $db->close();
}

/**
 * Format file size
 */
function formatFileSize($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < 3) {
        $bytes /= 1024;
        $i++;
    }
    return round($bytes, 2) . ' ' . $units[$i];
}

/**
 * Sanitize filename
 */
function sanitizeFilename($filename) {
    return preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
}

/**
 * Generate unique ID
 */
function generateUniqueId($prefix = 'nfx') {
    return $prefix . '_' . uniqid() . '_' . bin2hex(random_bytes(4));
}

/**
 * Minify HTML
 */
function minifyHTML($html) {
    $search = [
        '/\>[^\S ]+/s',
        '/[^\S ]+\</s',
        '/(\s)+/s',
        '/<!--(.|\s)*?-->/'
    ];
    $replace = ['>', '<', '\\1', ''];
    return preg_replace($search, $replace, $html);
}

/**
 * Log activity
 */
function logActivity($action, $details = []) {
    $logFile = __DIR__ . '/../logs/activity.log';
    $logDir = dirname($logFile);

    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'details' => $details,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];

    file_put_contents($logFile, json_encode($entry) . PHP_EOL, FILE_APPEND);
}
