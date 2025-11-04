<?php
/**
 * Neofox Media Visual Editor - Dashboard
 * Main landing page with overview and quick actions
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

// Get statistics
$db = getDB();
$pageCount = $db->querySingle("SELECT COUNT(*) FROM pages");
$mediaCount = $db->querySingle("SELECT COUNT(*) FROM media");
$mediaSize = $db->querySingle("SELECT SUM(file_size) FROM media") ?: 0;
$recentPages = $db->query("SELECT * FROM pages ORDER BY last_modified DESC LIMIT 5");
$recentMedia = $db->query("SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 6");

// Get activity log
$activityLog = [];
$logFile = __DIR__ . '/logs/activity.log';
if (file_exists($logFile)) {
    $lines = file($logFile);
    $activityLog = array_slice(array_reverse($lines), 0, 10);
}

$db->close();

// Get available pages for quick edit
$allPages = getAvailablePages();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Neofox Visual Editor</title>
    <link rel="stylesheet" href="assets/css/editor.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .dashboard-container {
            background: var(--bg-primary);
            min-height: 100vh;
            padding: 0;
        }

        .dashboard-topbar {
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dashboard-title h1 {
            font-size: 1.8em;
            color: var(--text-primary);
            margin-bottom: 5px;
        }

        .dashboard-title p {
            color: var(--text-secondary);
            font-size: 0.9em;
        }

        .dashboard-content {
            padding: 30px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .action-card {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            padding: 30px;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
            display: block;
        }

        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .action-card i {
            font-size: 2.5em;
            margin-bottom: 15px;
            opacity: 0.9;
        }

        .action-card h3 {
            font-size: 1.3em;
            margin-bottom: 8px;
        }

        .action-card p {
            opacity: 0.9;
            font-size: 0.9em;
        }

        .action-card.secondary {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            color: var(--text-primary);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
        }

        .stat-card .icon {
            font-size: 2em;
            color: var(--primary-color);
            margin-bottom: 15px;
        }

        .stat-card .value {
            font-size: 2.5em;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 5px;
        }

        .stat-card .label {
            color: var(--text-secondary);
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .dashboard-section {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .section-header h2 {
            font-size: 1.3em;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-header h2 i {
            color: var(--primary-color);
        }

        .recent-pages-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .page-item {
            background: var(--bg-tertiary);
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: var(--transition);
        }

        .page-item:hover {
            background: var(--bg-hover);
        }

        .page-info h4 {
            color: var(--text-primary);
            margin-bottom: 5px;
            font-size: 1em;
        }

        .page-info p {
            color: var(--text-secondary);
            font-size: 0.85em;
        }

        .page-actions {
            display: flex;
            gap: 10px;
        }

        .media-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
        }

        .media-thumbnail {
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-tertiary);
            cursor: pointer;
            transition: var(--transition);
        }

        .media-thumbnail:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow);
        }

        .media-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 400px;
            overflow-y: auto;
        }

        .activity-item {
            background: var(--bg-tertiary);
            padding: 12px 15px;
            border-radius: 6px;
            border-left: 3px solid var(--primary-color);
            font-size: 0.9em;
        }

        .activity-item .time {
            color: var(--text-secondary);
            font-size: 0.85em;
            margin-bottom: 5px;
        }

        .activity-item .action {
            color: var(--text-primary);
        }

        .welcome-banner {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            padding: 40px;
            border-radius: 12px;
            color: white;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .welcome-content h1 {
            font-size: 2em;
            margin-bottom: 10px;
        }

        .welcome-content p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .welcome-actions {
            display: flex;
            gap: 15px;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
        }

        .empty-state i {
            font-size: 3em;
            margin-bottom: 15px;
            opacity: 0.5;
        }
    </style>
</head>
<body class="editor-body">
    <div class="dashboard-container">
        <!-- Top Bar -->
        <div class="dashboard-topbar">
            <div class="dashboard-title">
                <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
                <p>Welcome back, <?= htmlspecialchars($_SESSION['editor_username']) ?>!</p>
            </div>
            <div class="topbar-right">
                <button class="btn btn-secondary" onclick="location.href='settings.php'">
                    <i class="fas fa-cog"></i> Settings
                </button>
                <button class="btn btn-icon" onclick="location.href='logout.php'" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="dashboard-content">

            <!-- Welcome Banner -->
            <div class="welcome-banner">
                <div class="welcome-content">
                    <h1>👋 Welcome to Your Visual Editor</h1>
                    <p>Manage your website with ease - no coding required!</p>
                </div>
                <div class="welcome-actions">
                    <a href="index.php" class="btn btn-primary" style="background: white; color: var(--primary-color);">
                        <i class="fas fa-edit"></i> Start Editing
                    </a>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <a href="index.php" class="action-card">
                    <i class="fas fa-edit"></i>
                    <h3>Edit Pages</h3>
                    <p>Edit any page with visual editor</p>
                </a>

                <a href="pages.php" class="action-card secondary">
                    <i class="fas fa-file-alt"></i>
                    <h3>Manage Pages</h3>
                    <p>Create, duplicate, or delete pages</p>
                </a>

                <a href="index.php?tab=media" class="action-card secondary">
                    <i class="fas fa-images"></i>
                    <h3>Media Library</h3>
                    <p>Upload and manage images & videos</p>
                </a>

                <a href="global-settings.php" class="action-card secondary">
                    <i class="fas fa-palette"></i>
                    <h3>Global Settings</h3>
                    <p>Brand colors, fonts, and logo</p>
                </a>
            </div>

            <!-- Statistics -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="icon"><i class="fas fa-file-alt"></i></div>
                    <div class="value"><?= $pageCount ?></div>
                    <div class="label">Pages</div>
                </div>

                <div class="stat-card">
                    <div class="icon"><i class="fas fa-images"></i></div>
                    <div class="value"><?= $mediaCount ?></div>
                    <div class="label">Media Files</div>
                </div>

                <div class="stat-card">
                    <div class="icon"><i class="fas fa-hdd"></i></div>
                    <div class="value"><?= formatFileSize($mediaSize) ?></div>
                    <div class="label">Storage Used</div>
                </div>

                <div class="stat-card">
                    <div class="icon"><i class="fas fa-history"></i></div>
                    <div class="value"><?= count(glob(BACKUP_PATH . '/*.html')) ?></div>
                    <div class="label">Backups</div>
                </div>
            </div>

            <!-- Two Column Layout -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">

                <!-- Recent Pages -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2><i class="fas fa-clock"></i> Recently Edited Pages</h2>
                        <a href="pages.php" class="btn btn-sm btn-secondary">View All</a>
                    </div>

                    <?php if ($pageCount > 0): ?>
                        <div class="recent-pages-list">
                            <?php
                            $count = 0;
                            while ($page = $recentPages->fetchArray(SQLITE3_ASSOC)):
                                if ($count >= 5) break;
                                $count++;
                            ?>
                                <div class="page-item">
                                    <div class="page-info">
                                        <h4><?= htmlspecialchars(ucfirst(str_replace(['.html', '-'], [' ', ' '], basename($page['filename'])))) ?></h4>
                                        <p><i class="fas fa-clock"></i> Modified: <?= date('M j, Y g:i A', strtotime($page['last_modified'])) ?></p>
                                    </div>
                                    <div class="page-actions">
                                        <a href="index.php?page=<?= urlencode($page['filename']) ?>" class="btn btn-sm btn-primary">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <a href="../<?= htmlspecialchars($page['filename']) ?>" class="btn btn-sm btn-secondary" target="_blank">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        </div>
                    <?php else: ?>
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <p>No pages edited yet</p>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Recent Activity -->
                <div class="dashboard-section">
                    <div class="section-header">
                        <h2><i class="fas fa-history"></i> Recent Activity</h2>
                    </div>

                    <?php if (!empty($activityLog)): ?>
                        <div class="activity-list">
                            <?php foreach ($activityLog as $log):
                                $entry = json_decode($log, true);
                                if ($entry):
                            ?>
                                <div class="activity-item">
                                    <div class="time"><?= date('M j, g:i A', strtotime($entry['timestamp'])) ?></div>
                                    <div class="action">
                                        <i class="fas fa-circle" style="font-size: 6px; margin-right: 8px;"></i>
                                        <?= htmlspecialchars(ucfirst($entry['action'])) ?>
                                    </div>
                                </div>
                            <?php
                                endif;
                            endforeach;
                            ?>
                        </div>
                    <?php else: ?>
                        <div class="empty-state">
                            <i class="fas fa-history"></i>
                            <p>No activity yet</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Recent Media -->
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-images"></i> Recent Media</h2>
                    <a href="index.php?tab=media" class="btn btn-sm btn-secondary">View All</a>
                </div>

                <?php if ($mediaCount > 0): ?>
                    <div class="media-grid">
                        <?php
                        $count = 0;
                        while ($media = $recentMedia->fetchArray(SQLITE3_ASSOC)):
                            if ($count >= 6) break;
                            $count++;
                            $thumbUrl = $media['thumbnail_path'] ?: $media['file_path'];
                        ?>
                            <div class="media-thumbnail" onclick="window.open('../<?= htmlspecialchars($media['file_path']) ?>', '_blank')">
                                <?php if ($media['file_type'] === 'image'): ?>
                                    <img src="../<?= htmlspecialchars($thumbUrl) ?>" alt="<?= htmlspecialchars($media['original_filename']) ?>" loading="lazy">
                                <?php else: ?>
                                    <video src="../<?= htmlspecialchars($media['file_path']) ?>" muted></video>
                                <?php endif; ?>
                            </div>
                        <?php endwhile; ?>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="fas fa-images"></i>
                        <p>No media uploaded yet</p>
                        <a href="index.php?tab=media" class="btn btn-primary" style="margin-top: 15px;">
                            <i class="fas fa-upload"></i> Upload Media
                        </a>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Help & Resources -->
            <div class="dashboard-section">
                <div class="section-header">
                    <h2><i class="fas fa-question-circle"></i> Help & Resources</h2>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div class="page-item">
                        <div class="page-info">
                            <h4><i class="fas fa-book"></i> Documentation</h4>
                            <p>Complete guide to using the editor</p>
                        </div>
                        <a href="../EDITOR_README.md" class="btn btn-sm btn-secondary" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Open
                        </a>
                    </div>

                    <div class="page-item">
                        <div class="page-info">
                            <h4><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h4>
                            <p>Ctrl+S to save, Ctrl+Z to undo</p>
                        </div>
                        <button class="btn btn-sm btn-secondary" onclick="alert('Ctrl+S = Save\\nCtrl+Z = Undo\\nCtrl+Y = Redo\\nEsc = Deselect\\nDelete = Delete element')">
                            <i class="fas fa-info-circle"></i> View
                        </button>
                    </div>

                    <div class="page-item">
                        <div class="page-info">
                            <h4><i class="fas fa-life-ring"></i> Need Help?</h4>
                            <p>Contact your administrator</p>
                        </div>
                        <a href="mailto:support@neofoxmedia.com" class="btn btn-sm btn-secondary">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
</html>
