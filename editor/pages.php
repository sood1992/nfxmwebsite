<?php
/**
 * Neofox Media Visual Editor - Page Management
 * Create, duplicate, delete, and manage pages
 */

// Initialize database session handler
require_once __DIR__ . '/includes/session-handler.php';
$sessionDbPath = __DIR__ . '/database/sessions.db';
initDatabaseSessions($sessionDbPath);

session_start();
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

// Check authentication
if (!isset($_SESSION['editor_logged_in'])) {
    header('Location: login.php');
    exit;
}

$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create':
            $pageName = $_POST['page_name'] ?? '';
            $template = $_POST['template'] ?? 'blank';

            if (!empty($pageName)) {
                $filename = sanitizeFilename($pageName) . '.html';
                $filepath = BASE_PATH . '/' . $filename;

                if (file_exists($filepath)) {
                    $message = 'Page already exists!';
                    $messageType = 'error';
                } else {
                    // Create page from template
                    $content = getTemplate($template, $pageName);
                    file_put_contents($filepath, $content);

                    // Save to database
                    $db = getDB();
                    $stmt = $db->prepare("
                        INSERT INTO pages (filename, content, metadata, last_modified)
                        VALUES (:filename, :content, :metadata, datetime('now'))
                    ");
                    $stmt->bindValue(':filename', $filename, SQLITE3_TEXT);
                    $stmt->bindValue(':content', $content, SQLITE3_TEXT);
                    $stmt->bindValue(':metadata', json_encode(['created' => date('Y-m-d H:i:s')]), SQLITE3_TEXT);
                    $stmt->execute();
                    $db->close();

                    logActivity('page_created', ['filename' => $filename]);
                    $message = 'Page created successfully!';
                    $messageType = 'success';
                }
            }
            break;

        case 'duplicate':
            $source = $_POST['source'] ?? '';
            $newName = $_POST['new_name'] ?? '';

            if (!empty($source) && !empty($newName)) {
                $newFilename = sanitizeFilename($newName) . '.html';
                $newPath = BASE_PATH . '/' . $newFilename;

                if (file_exists($newPath)) {
                    $message = 'Page already exists!';
                    $messageType = 'error';
                } else {
                    $content = getPageContent($source);
                    if ($content !== false) {
                        file_put_contents($newPath, $content);

                        $db = getDB();
                        $stmt = $db->prepare("
                            INSERT INTO pages (filename, content, metadata, last_modified)
                            VALUES (:filename, :content, :metadata, datetime('now'))
                        ");
                        $stmt->bindValue(':filename', $newFilename, SQLITE3_TEXT);
                        $stmt->bindValue(':content', $content, SQLITE3_TEXT);
                        $stmt->bindValue(':metadata', json_encode(['duplicated_from' => $source]), SQLITE3_TEXT);
                        $stmt->execute();
                        $db->close();

                        logActivity('page_duplicated', ['source' => $source, 'new' => $newFilename]);
                        $message = 'Page duplicated successfully!';
                        $messageType = 'success';
                    }
                }
            }
            break;

        case 'delete':
            $filename = $_POST['filename'] ?? '';

            if (!empty($filename)) {
                $filepath = BASE_PATH . '/' . $filename;

                // Prevent deletion of main pages
                if (in_array($filename, ['index.html', 'blog.html', 'services.html'])) {
                    $message = 'Cannot delete main pages!';
                    $messageType = 'error';
                } else {
                    if (file_exists($filepath)) {
                        // Create backup before deletion
                        createBackup($filename);

                        // Delete file
                        unlink($filepath);

                        // Delete from database
                        $db = getDB();
                        $stmt = $db->prepare("DELETE FROM pages WHERE filename = :filename");
                        $stmt->bindValue(':filename', $filename, SQLITE3_TEXT);
                        $stmt->execute();
                        $db->close();

                        logActivity('page_deleted', ['filename' => $filename]);
                        $message = 'Page deleted successfully!';
                        $messageType = 'success';
                    }
                }
            }
            break;
    }
}

// Get all pages
$allPages = getAvailablePages();

// Helper function to get page template
function getTemplate($templateType, $pageName) {
    $title = ucfirst(str_replace('-', ' ', $pageName));

    $templates = [
        'blank' => <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title - Neofox Media</title>
    <meta name="description" content="$title page">
    <link href="css/neofoxmedia.webflow.shared.69e34b75e.css" rel="stylesheet" type="text/css"/>
</head>
<body>
    <main class="content">
        <section style="padding: 60px 20px; text-align: center;">
            <h1>$title</h1>
            <p>Start editing this page by clicking on any element.</p>
        </section>
    </main>
    <script src="js/jquery.js"></script>
</body>
</html>
HTML,

        'full' => <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title - Neofox Media</title>
    <meta name="description" content="$title page">
    <link href="css/neofoxmedia.webflow.shared.69e34b75e.css" rel="stylesheet" type="text/css"/>
</head>
<body>
    <main id="main" class="content">
        <!-- Hero Section -->
        <section style="padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 3em; margin-bottom: 20px;">$title</h1>
                <p style="font-size: 1.3em; margin-bottom: 30px;">Your subtitle goes here</p>
                <button style="padding: 15px 40px; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer;">Get Started</button>
            </div>
        </section>

        <!-- Content Section -->
        <section style="padding: 80px 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="font-size: 2.5em; text-align: center; margin-bottom: 50px;">Section Title</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
                    <div style="padding: 30px; background: #f9fafb; border-radius: 12px; text-align: center;">
                        <i class="fas fa-star" style="font-size: 3em; color: #667eea; margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Feature One</h3>
                        <p>Description of your first feature goes here.</p>
                    </div>
                    <div style="padding: 30px; background: #f9fafb; border-radius: 12px; text-align: center;">
                        <i class="fas fa-rocket" style="font-size: 3em; color: #764ba2; margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Feature Two</h3>
                        <p>Description of your second feature goes here.</p>
                    </div>
                    <div style="padding: 30px; background: #f9fafb; border-radius: 12px; text-align: center;">
                        <i class="fas fa-heart" style="font-size: 3em; color: #667eea; margin-bottom: 20px;"></i>
                        <h3 style="margin-bottom: 15px;">Feature Three</h3>
                        <p>Description of your third feature goes here.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
    <script src="js/jquery.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</body>
</html>
HTML
    ];

    return $templates[$templateType] ?? $templates['blank'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Management - Neofox Visual Editor</title>
    <link rel="stylesheet" href="assets/css/editor.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .page-management {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }

        .page-header h1 {
            font-size: 2em;
            color: var(--text-primary);
        }

        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .page-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 25px;
            transition: var(--transition);
        }

        .page-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }

        .page-card-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
        }

        .page-card-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5em;
        }

        .page-card-title h3 {
            color: var(--text-primary);
            margin-bottom: 5px;
            font-size: 1.2em;
        }

        .page-card-title p {
            color: var(--text-secondary);
            font-size: 0.85em;
        }

        .page-card-actions {
            display: flex;
            gap: 8px;
            margin-top: 20px;
        }

        .create-page-card {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: 2px dashed rgba(255,255,255,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            text-align: center;
            padding: 40px 20px;
        }

        .create-page-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .create-page-card i {
            font-size: 3em;
            margin-bottom: 15px;
            opacity: 0.9;
        }

        .create-page-card h3 {
            font-size: 1.3em;
            margin-bottom: 10px;
        }

        .modal-body .form-group {
            margin-bottom: 20px;
        }

        .modal-body label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .modal-body input,
        .modal-body select {
            width: 100%;
            padding: 12px 15px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
        }

        .template-preview {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .template-option {
            padding: 20px;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: var(--transition);
        }

        .template-option:hover {
            border-color: var(--primary-color);
        }

        .template-option.selected {
            border-color: var(--primary-color);
            background: rgba(102, 126, 234, 0.1);
        }

        .template-option i {
            font-size: 2em;
            margin-bottom: 10px;
            color: var(--primary-color);
        }
    </style>
</head>
<body class="editor-body">
    <div class="page-management">
        <div class="page-header">
            <div>
                <h1><i class="fas fa-file-alt"></i> Page Management</h1>
                <p style="color: var(--text-secondary); margin-top: 10px;">Create, edit, duplicate, or delete pages</p>
            </div>
            <div>
                <a href="dashboard.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="notification <?= $messageType ?>" style="margin-bottom: 30px; padding: 15px 20px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-<?= $messageType === 'success' ? 'check-circle' : 'exclamation-circle' ?>"></i>
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <div class="pages-grid">
            <!-- Create New Page Card -->
            <div class="create-page-card page-card" onclick="openCreateModal()">
                <i class="fas fa-plus-circle"></i>
                <h3>Create New Page</h3>
                <p style="opacity: 0.9;">Start from scratch or use a template</p>
            </div>

            <!-- Existing Pages -->
            <?php foreach ($allPages as $page):
                $pageTitle = ucfirst(str_replace(['.html', '-', '/'], [' ', ' ', ' › '], $page));
                $isMainPage = in_array($page, ['index.html', 'blog.html', 'services.html']);
            ?>
                <div class="page-card">
                    <div class="page-card-header">
                        <div class="page-card-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                    </div>
                    <div class="page-card-title">
                        <h3><?= htmlspecialchars($pageTitle) ?></h3>
                        <p><i class="fas fa-folder"></i> <?= htmlspecialchars($page) ?></p>
                        <?php if ($isMainPage): ?>
                            <p style="color: var(--warning-color); margin-top: 5px;">
                                <i class="fas fa-lock"></i> Protected page
                            </p>
                        <?php endif; ?>
                    </div>
                    <div class="page-card-actions">
                        <a href="index.php?page=<?= urlencode($page) ?>" class="btn btn-primary btn-sm" style="flex: 1;">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <a href="../<?= htmlspecialchars($page) ?>" class="btn btn-secondary btn-sm" target="_blank">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn btn-secondary btn-sm" onclick="openDuplicateModal('<?= htmlspecialchars($page) ?>')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <?php if (!$isMainPage): ?>
                            <button class="btn btn-secondary btn-sm" onclick="deletePage('<?= htmlspecialchars($page) ?>')">
                                <i class="fas fa-trash"></i>
                            </button>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Create Page Modal -->
    <div class="modal" id="createModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3>Create New Page</h3>
                <button class="btn btn-icon" onclick="closeModal('createModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form method="POST" action="">
                <input type="hidden" name="action" value="create">
                <div class="modal-body">
                    <div class="form-group">
                        <label>Page Name</label>
                        <input type="text" name="page_name" placeholder="e.g., about-us" required>
                        <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                            Use lowercase with hyphens (e.g., contact-us, pricing)
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Select Template</label>
                        <div class="template-preview">
                            <div class="template-option selected" onclick="selectTemplate(this, 'blank')">
                                <i class="fas fa-file"></i>
                                <h4>Blank Page</h4>
                                <p style="font-size: 0.85em; color: var(--text-secondary); margin-top: 5px;">Start from scratch</p>
                            </div>
                            <div class="template-option" onclick="selectTemplate(this, 'full')">
                                <i class="fas fa-layer-group"></i>
                                <h4>Full Page</h4>
                                <p style="font-size: 0.85em; color: var(--text-secondary); margin-top: 5px;">Hero + sections</p>
                            </div>
                        </div>
                        <input type="hidden" name="template" id="templateInput" value="blank">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('createModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Page</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Duplicate Page Modal -->
    <div class="modal" id="duplicateModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3>Duplicate Page</h3>
                <button class="btn btn-icon" onclick="closeModal('duplicateModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form method="POST" action="">
                <input type="hidden" name="action" value="duplicate">
                <input type="hidden" name="source" id="duplicateSource">
                <div class="modal-body">
                    <div class="form-group">
                        <label>New Page Name</label>
                        <input type="text" name="new_name" placeholder="e.g., about-us-copy" required>
                        <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                            Use lowercase with hyphens
                        </small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('duplicateModal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Duplicate Page</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function openCreateModal() {
            document.getElementById('createModal').classList.add('active');
        }

        function openDuplicateModal(sourcePage) {
            document.getElementById('duplicateSource').value = sourcePage;
            document.getElementById('duplicateModal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function selectTemplate(element, template) {
            document.querySelectorAll('.template-option').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
            document.getElementById('templateInput').value = template;
        }

        function deletePage(filename) {
            if (confirm(`Are you sure you want to delete "${filename}"?\n\nThis action cannot be undone, but a backup will be created.`)) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="filename" value="${filename}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
    </script>
</body>
</html>
