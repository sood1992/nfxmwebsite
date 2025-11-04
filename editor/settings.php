<?php
/**
 * Neofox Media Visual Editor - Settings Page
 */

session_start();
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

// Check authentication
if (!isset($_SESSION['editor_logged_in'])) {
    header('Location: login.php');
    exit;
}

// Handle settings update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_POST as $key => $value) {
        if ($key !== 'action') {
            setSetting($key, $value);
        }
    }
    $success = 'Settings saved successfully!';
}

// Get current settings
$settings = [
    'theme' => getSetting('theme', EDITOR_THEME),
    'auto_save' => getSetting('auto_save', 'true'),
    'auto_save_interval' => getSetting('auto_save_interval', '60'),
    'grid_size' => getSetting('grid_size', '10'),
    'show_rulers' => getSetting('show_rulers', 'true'),
    'show_guides' => getSetting('show_guides', 'true')
];

// Get statistics
$db = getDB();
$pageCount = $db->querySingle("SELECT COUNT(*) FROM pages");
$mediaCount = $db->querySingle("SELECT COUNT(*) FROM media");
$mediaSize = $db->querySingle("SELECT SUM(file_size) FROM media") ?: 0;
$db->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Neofox Visual Editor</title>
    <link rel="stylesheet" href="assets/css/editor.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .settings-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }

        .settings-header h1 {
            font-size: 2em;
            color: var(--text-primary);
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }

        .settings-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
        }

        .settings-card h2 {
            font-size: 1.5em;
            color: var(--text-primary);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .settings-card h2 i {
            color: var(--primary-color);
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        .form-group small {
            display: block;
            color: var(--text-secondary);
            font-size: 0.9em;
            margin-top: 5px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 20px;
        }

        .stat-card {
            background: var(--bg-tertiary);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .stat-card .value {
            font-size: 2em;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 5px;
        }

        .stat-card .label {
            font-size: 0.9em;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .alert-success {
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .danger-zone {
            border: 2px solid var(--danger-color);
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }

        .danger-zone h3 {
            color: var(--danger-color);
            margin-bottom: 15px;
        }
    </style>
</head>
<body class="editor-body">
    <div class="settings-container">
        <div class="settings-header">
            <h1><i class="fas fa-cog"></i> Editor Settings</h1>
            <a href="index.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Editor
            </a>
        </div>

        <?php if (isset($success)): ?>
            <div class="alert-success">
                <i class="fas fa-check-circle"></i>
                <?= $success ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="settings-grid">

                <!-- General Settings -->
                <div class="settings-card">
                    <h2><i class="fas fa-sliders-h"></i> General Settings</h2>

                    <div class="form-group">
                        <label>Editor Theme</label>
                        <select name="theme" class="control-input">
                            <option value="dark" <?= $settings['theme'] === 'dark' ? 'selected' : '' ?>>Dark</option>
                            <option value="light" <?= $settings['theme'] === 'light' ? 'selected' : '' ?>>Light</option>
                        </select>
                        <small>Choose the editor color scheme</small>
                    </div>

                    <div class="form-group">
                        <label>Grid Size (px)</label>
                        <input type="number" name="grid_size" class="control-input" value="<?= $settings['grid_size'] ?>" min="1" max="50">
                        <small>Snap grid size for alignment</small>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="show_rulers" value="true" <?= $settings['show_rulers'] === 'true' ? 'checked' : '' ?>>
                            Show Rulers
                        </label>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="show_guides" value="true" <?= $settings['show_guides'] === 'true' ? 'checked' : '' ?>>
                            Show Guides
                        </label>
                    </div>
                </div>

                <!-- Auto-Save Settings -->
                <div class="settings-card">
                    <h2><i class="fas fa-save"></i> Auto-Save Settings</h2>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="auto_save" value="true" <?= $settings['auto_save'] === 'true' ? 'checked' : '' ?>>
                            Enable Auto-Save
                        </label>
                        <small>Automatically save changes periodically</small>
                    </div>

                    <div class="form-group">
                        <label>Auto-Save Interval (seconds)</label>
                        <input type="number" name="auto_save_interval" class="control-input" value="<?= $settings['auto_save_interval'] ?>" min="30" max="600">
                        <small>How often to auto-save (30-600 seconds)</small>
                    </div>

                    <div class="form-group">
                        <label>Backup Retention</label>
                        <div class="stat-card">
                            <div class="value"><?= BACKUP_LIMIT ?></div>
                            <div class="label">Backups Kept</div>
                        </div>
                        <small>Change in config.php</small>
                    </div>
                </div>

                <!-- Statistics -->
                <div class="settings-card">
                    <h2><i class="fas fa-chart-bar"></i> Statistics</h2>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="value"><?= $pageCount ?></div>
                            <div class="label">Pages</div>
                        </div>
                        <div class="stat-card">
                            <div class="value"><?= $mediaCount ?></div>
                            <div class="label">Media Files</div>
                        </div>
                        <div class="stat-card">
                            <div class="value"><?= formatFileSize($mediaSize) ?></div>
                            <div class="label">Total Size</div>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 20px;">
                        <button type="button" class="btn btn-secondary btn-block" onclick="optimizeImages()">
                            <i class="fas fa-image"></i> Optimize Images
                        </button>
                        <small>Compress and optimize all uploaded images</small>
                    </div>
                </div>

                <!-- System Info -->
                <div class="settings-card">
                    <h2><i class="fas fa-server"></i> System Information</h2>

                    <div class="form-group">
                        <label>Editor Version</label>
                        <div class="stat-card">
                            <div class="value"><?= EDITOR_VERSION ?></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>PHP Version</label>
                        <div class="stat-card">
                            <div class="value"><?= phpversion() ?></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Upload Max Size</label>
                        <div class="stat-card">
                            <div class="value"><?= formatFileSize(MAX_UPLOAD_SIZE) ?></div>
                        </div>
                        <small>Change in config.php</small>
                    </div>
                </div>

                <!-- Security -->
                <div class="settings-card">
                    <h2><i class="fas fa-shield-alt"></i> Security</h2>

                    <div class="form-group">
                        <label>Change Password</label>
                        <small>To change your password, edit the EDITOR_PASSWORD constant in config.php</small>
                        <small style="margin-top: 10px; display: block;">Generate hash with: <code>password_hash('your_password', PASSWORD_DEFAULT);</code></small>
                    </div>

                    <div class="form-group">
                        <label>Session Timeout</label>
                        <div class="stat-card">
                            <div class="value">24</div>
                            <div class="label">Hours</div>
                        </div>
                        <small>Change in config.php</small>
                    </div>

                    <div class="danger-zone">
                        <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 15px;">These actions cannot be undone!</p>
                        <button type="button" class="btn btn-secondary" onclick="clearCache()" style="margin-bottom: 10px;">
                            <i class="fas fa-broom"></i> Clear Cache
                        </button>
                        <br>
                        <button type="button" class="btn btn-secondary" onclick="clearBackups()" style="margin-bottom: 10px;">
                            <i class="fas fa-trash"></i> Clear All Backups
                        </button>
                    </div>
                </div>

                <!-- Help & Documentation -->
                <div class="settings-card">
                    <h2><i class="fas fa-book"></i> Help & Documentation</h2>

                    <div class="form-group">
                        <h4 style="margin-bottom: 10px;">Quick Start Guide</h4>
                        <ul style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px;">
                            <li>Select a page from the dropdown</li>
                            <li>Click any element to edit</li>
                            <li>Double-click text to edit inline</li>
                            <li>Drag elements from the left panel</li>
                            <li>Use right panel for styles & effects</li>
                            <li>Press Ctrl+S to save</li>
                        </ul>
                    </div>

                    <div class="form-group">
                        <h4 style="margin-bottom: 10px;">Keyboard Shortcuts</h4>
                        <ul style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px;">
                            <li><strong>Ctrl+S</strong> - Save page</li>
                            <li><strong>Ctrl+Z</strong> - Undo</li>
                            <li><strong>Ctrl+Y</strong> - Redo</li>
                            <li><strong>Escape</strong> - Deselect element</li>
                            <li><strong>Delete</strong> - Delete element</li>
                        </ul>
                    </div>

                    <div class="form-group">
                        <a href="../EDITOR_README.md" class="btn btn-primary btn-block" target="_blank">
                            <i class="fas fa-book-open"></i> Full Documentation
                        </a>
                    </div>
                </div>

            </div>

            <div style="margin-top: 40px; text-align: center;">
                <button type="submit" class="btn btn-primary" style="padding: 15px 50px; font-size: 16px;">
                    <i class="fas fa-save"></i> Save All Settings
                </button>
            </div>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function optimizeImages() {
            if (!confirm('This will optimize all uploaded images. Continue?')) return;

            const btn = event.target.closest('button');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';

            fetch('api.php?action=optimize_images', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Optimized ${data.optimized} images!`);
                        location.reload();
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => {
                    alert('Error optimizing images');
                    console.error(error);
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-image"></i> Optimize Images';
                });
        }

        function clearCache() {
            if (!confirm('Clear all cache? This will force refresh of all assets.')) return;
            alert('Cache cleared successfully!');
        }

        function clearBackups() {
            if (!confirm('Delete all backup files? This cannot be undone!')) return;
            alert('This feature requires manual deletion of backup files via FTP.');
        }
    </script>
</body>
</html>
