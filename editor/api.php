<?php
/**
 * Neofox Media Visual Editor - API Endpoints
 */

// Initialize database session handler
require_once __DIR__ . '/includes/session-handler.php';
$sessionDbPath = __DIR__ . '/database/sessions.db';
initDatabaseSessions($sessionDbPath);

session_start();
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['editor_logged_in'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    case 'get_page':
        $page = $_GET['page'] ?? '';
        $content = getPageContent($page);
        if ($content !== false) {
            echo json_encode(['success' => true, 'content' => $content]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Page not found']);
        }
        break;

    case 'save_page':
        $page = $_POST['page'] ?? '';
        $content = $_POST['content'] ?? '';

        if (empty($page) || empty($content)) {
            echo json_encode(['success' => false, 'error' => 'Missing parameters']);
            break;
        }

        $result = savePageContent($page, $content);
        if ($result) {
            logActivity('page_saved', ['page' => $page]);
            echo json_encode(['success' => true, 'message' => 'Page saved successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to save page']);
        }
        break;

    case 'upload_media':
        if (!isset($_FILES['file'])) {
            echo json_encode(['success' => false, 'error' => 'No file uploaded']);
            break;
        }

        $result = uploadMedia($_FILES['file']);
        if ($result['success']) {
            logActivity('media_uploaded', ['filename' => $result['filename']]);
        }
        echo json_encode($result);
        break;

    case 'upload_multiple':
        $results = [];
        if (isset($_FILES['files'])) {
            $fileCount = count($_FILES['files']['name']);
            for ($i = 0; $i < $fileCount; $i++) {
                $file = [
                    'name' => $_FILES['files']['name'][$i],
                    'type' => $_FILES['files']['type'][$i],
                    'tmp_name' => $_FILES['files']['tmp_name'][$i],
                    'error' => $_FILES['files']['error'][$i],
                    'size' => $_FILES['files']['size'][$i]
                ];
                $results[] = uploadMedia($file);
            }
        }
        echo json_encode(['success' => true, 'results' => $results]);
        break;

    case 'get_media_library':
        $limit = $_GET['limit'] ?? 100;
        $offset = $_GET['offset'] ?? 0;
        $type = $_GET['type'] ?? null;

        $media = getMediaLibrary($limit, $offset, $type);
        echo json_encode(['success' => true, 'media' => $media]);
        break;

    case 'delete_media':
        $id = $_POST['id'] ?? 0;
        $result = deleteMedia($id);
        if ($result) {
            logActivity('media_deleted', ['id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Media deleted']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to delete media']);
        }
        break;

    case 'get_backups':
        $page = $_GET['page'] ?? '';
        $prefix = str_replace(['/', '.html'], ['_', ''], $page);
        $backups = glob(BACKUP_PATH . '/' . $prefix . '_*.html');

        $backupList = [];
        foreach ($backups as $backup) {
            $backupList[] = [
                'filename' => basename($backup),
                'size' => filesize($backup),
                'date' => filemtime($backup)
            ];
        }

        // Sort by date descending
        usort($backupList, function($a, $b) {
            return $b['date'] - $a['date'];
        });

        echo json_encode(['success' => true, 'backups' => $backupList]);
        break;

    case 'restore_backup':
        $backupFile = $_POST['backup'] ?? '';
        $page = $_POST['page'] ?? '';

        $backupPath = BACKUP_PATH . '/' . $backupFile;
        if (file_exists($backupPath)) {
            $content = file_get_contents($backupPath);
            $result = savePageContent($page, $content);
            if ($result) {
                logActivity('backup_restored', ['page' => $page, 'backup' => $backupFile]);
                echo json_encode(['success' => true, 'message' => 'Backup restored']);
            } else {
                echo json_encode(['success' => false, 'error' => 'Failed to restore backup']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Backup not found']);
        }
        break;

    case 'get_settings':
        $settings = [
            'theme' => getSetting('theme', EDITOR_THEME),
            'auto_save' => getSetting('auto_save', 'true'),
            'auto_save_interval' => getSetting('auto_save_interval', '60'),
            'grid_size' => getSetting('grid_size', '10')
        ];
        echo json_encode(['success' => true, 'settings' => $settings]);
        break;

    case 'save_settings':
        $settings = json_decode(file_get_contents('php://input'), true);
        foreach ($settings as $key => $value) {
            setSetting($key, $value);
        }
        logActivity('settings_updated', $settings);
        echo json_encode(['success' => true, 'message' => 'Settings saved']);
        break;

    case 'export_page':
        $page = $_GET['page'] ?? '';
        $content = getPageContent($page);
        if ($content !== false) {
            $filename = str_replace(['/', '.html'], ['_', ''], $page) . '_export.html';
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . strlen($content));
            echo $content;
            exit;
        } else {
            echo json_encode(['success' => false, 'error' => 'Page not found']);
        }
        break;

    case 'import_page':
        if (!isset($_FILES['file'])) {
            echo json_encode(['success' => false, 'error' => 'No file uploaded']);
            break;
        }

        $file = $_FILES['file'];
        $page = $_POST['page'] ?? '';

        if (empty($page)) {
            echo json_encode(['success' => false, 'error' => 'Page name required']);
            break;
        }

        $content = file_get_contents($file['tmp_name']);
        $result = savePageContent($page, $content);

        if ($result) {
            logActivity('page_imported', ['page' => $page]);
            echo json_encode(['success' => true, 'message' => 'Page imported successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to import page']);
        }
        break;

    case 'optimize_images':
        // Get all images from media library
        $media = getMediaLibrary(1000, 0, 'image');
        $optimized = 0;

        foreach ($media as $item) {
            $filepath = BASE_PATH . '/' . $item['file_path'];
            if (file_exists($filepath)) {
                $extension = strtolower(pathinfo($filepath, PATHINFO_EXTENSION));

                if ($extension === 'jpg' || $extension === 'jpeg') {
                    $image = imagecreatefromjpeg($filepath);
                    if ($image) {
                        imagejpeg($image, $filepath, 85);
                        imagedestroy($image);
                        $optimized++;
                    }
                } elseif ($extension === 'png') {
                    $image = imagecreatefrompng($filepath);
                    if ($image) {
                        imagepng($image, $filepath, 8);
                        imagedestroy($image);
                        $optimized++;
                    }
                }
            }
        }

        logActivity('images_optimized', ['count' => $optimized]);
        echo json_encode(['success' => true, 'optimized' => $optimized]);
        break;

    case 'get_page_analytics':
        $page = $_GET['page'] ?? '';
        $content = getPageContent($page);

        if ($content !== false) {
            $analytics = [
                'size' => strlen($content),
                'size_formatted' => formatFileSize(strlen($content)),
                'images' => substr_count($content, '<img'),
                'videos' => substr_count($content, '<video'),
                'links' => substr_count($content, '<a'),
                'scripts' => substr_count($content, '<script'),
                'styles' => substr_count($content, '<style')
            ];
            echo json_encode(['success' => true, 'analytics' => $analytics]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Page not found']);
        }
        break;

    case 'search_content':
        $query = $_GET['query'] ?? '';
        $pages = getAvailablePages();
        $results = [];

        foreach ($pages as $page) {
            $content = getPageContent($page);
            if ($content !== false && stripos($content, $query) !== false) {
                $results[] = [
                    'page' => $page,
                    'matches' => substr_count(strtolower($content), strtolower($query))
                ];
            }
        }

        echo json_encode(['success' => true, 'results' => $results]);
        break;

    case 'duplicate_page':
        $sourcePage = $_POST['source'] ?? '';
        $newPage = $_POST['new_page'] ?? '';

        if (empty($sourcePage) || empty($newPage)) {
            echo json_encode(['success' => false, 'error' => 'Missing parameters']);
            break;
        }

        $content = getPageContent($sourcePage);
        if ($content !== false) {
            $result = savePageContent($newPage, $content);
            if ($result) {
                logActivity('page_duplicated', ['source' => $sourcePage, 'new' => $newPage]);
                echo json_encode(['success' => true, 'message' => 'Page duplicated']);
            } else {
                echo json_encode(['success' => false, 'error' => 'Failed to duplicate page']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Source page not found']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}
