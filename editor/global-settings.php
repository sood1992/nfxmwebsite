<?php
/**
 * Neofox Media Visual Editor - Global Settings
 * Set brand colors, fonts, logo, and site-wide styles
 */

session_start();
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

// Check authentication
if (!isset($_SESSION['editor_logged_in'])) {
    header('Location: login.php');
    exit;
}

$message = '';

// Handle save
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $settings = [
        'brand_primary_color' => $_POST['brand_primary_color'] ?? '#667eea',
        'brand_secondary_color' => $_POST['brand_secondary_color'] ?? '#764ba2',
        'brand_text_color' => $_POST['brand_text_color'] ?? '#000000',
        'brand_bg_color' => $_POST['brand_bg_color'] ?? '#ffffff',
        'brand_font_heading' => $_POST['brand_font_heading'] ?? 'Syne',
        'brand_font_body' => $_POST['brand_font_body'] ?? 'Inter Tight',
        'site_title' => $_POST['site_title'] ?? 'Neofox Media',
        'site_tagline' => $_POST['site_tagline'] ?? 'Full-Stack Creative & Growth Agency',
        'site_logo_url' => $_POST['site_logo_url'] ?? 'images/neofox-web-logo2.png'
    ];

    foreach ($settings as $key => $value) {
        setSetting($key, $value);
    }

    // Generate global CSS file
    generateGlobalCSS($settings);

    logActivity('global_settings_updated', $settings);
    $message = 'Global settings saved successfully!';
}

// Get current settings
$currentSettings = [
    'brand_primary_color' => getSetting('brand_primary_color', '#667eea'),
    'brand_secondary_color' => getSetting('brand_secondary_color', '#764ba2'),
    'brand_text_color' => getSetting('brand_text_color', '#000000'),
    'brand_bg_color' => getSetting('brand_bg_color', '#ffffff'),
    'brand_font_heading' => getSetting('brand_font_heading', 'Syne'),
    'brand_font_body' => getSetting('brand_font_body', 'Inter Tight'),
    'site_title' => getSetting('site_title', 'Neofox Media'),
    'site_tagline' => getSetting('site_tagline', 'Full-Stack Creative & Growth Agency'),
    'site_logo_url' => getSetting('site_logo_url', 'images/neofox-web-logo2.png')
];

// Helper function to generate global CSS
function generateGlobalCSS($settings) {
    $css = <<<CSS
/* Neofox Media - Global Brand Styles (Auto-generated) */
:root {
    --brand-primary: {$settings['brand_primary_color']};
    --brand-secondary: {$settings['brand_secondary_color']};
    --brand-text: {$settings['brand_text_color']};
    --brand-bg: {$settings['brand_bg_color']};
}

body {
    font-family: '{$settings['brand_font_body']}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--brand-text);
    background-color: var(--brand-bg);
}

h1, h2, h3, h4, h5, h6 {
    font-family: '{$settings['brand_font_heading']}', sans-serif;
}

.btn-primary {
    background: var(--brand-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--brand-secondary);
}

a {
    color: var(--brand-primary);
}

a:hover {
    color: var(--brand-secondary);
}

/* Apply brand colors to common elements */
.bg-primary {
    background: var(--brand-primary) !important;
}

.bg-secondary {
    background: var(--brand-secondary) !important;
}

.text-primary {
    color: var(--brand-primary) !important;
}

.text-secondary {
    color: var(--brand-secondary) !important;
}
CSS;

    file_put_contents(BASE_PATH . '/css/brand-global.css', $css);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Settings - Neofox Visual Editor</title>
    <link rel="stylesheet" href="assets/css/editor.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.css">
    <style>
        .global-settings {
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

        .settings-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
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
            margin-bottom: 25px;
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
            margin-bottom: 10px;
            color: var(--text-primary);
        }

        .form-group input[type="text"] {
            width: 100%;
            padding: 12px 15px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
        }

        .form-group select {
            width: 100%;
            padding: 12px 15px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
        }

        .color-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .color-preview {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            border: 2px solid var(--border-color);
        }

        .preview-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            position: sticky;
            top: 20px;
        }

        .preview-content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
        }

        .preview-logo {
            max-width: 200px;
            margin-bottom: 20px;
        }

        .preview-heading {
            font-size: 2em;
            margin-bottom: 10px;
        }

        .preview-text {
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .preview-button {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            color: white;
        }

        .font-preview {
            padding: 15px;
            background: var(--bg-tertiary);
            border-radius: 8px;
            margin-top: 10px;
            text-align: center;
        }

        .success-message {
            background: var(--success-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
    </style>
</head>
<body class="editor-body">
    <div class="global-settings">
        <div class="settings-header">
            <div>
                <h1><i class="fas fa-palette"></i> Global Settings</h1>
                <p style="color: var(--text-secondary); margin-top: 10px;">Set brand colors, fonts, and site-wide styles</p>
            </div>
            <div>
                <a href="dashboard.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="settings-content">
                <!-- Settings Form -->
                <div>
                    <!-- Brand Colors -->
                    <div class="settings-card">
                        <h2><i class="fas fa-palette"></i> Brand Colors</h2>

                        <div class="form-group">
                            <label>Primary Color</label>
                            <div class="color-input-group">
                                <div class="color-preview" style="background: <?= $currentSettings['brand_primary_color'] ?>"></div>
                                <input type="text" name="brand_primary_color" class="color-picker" value="<?= $currentSettings['brand_primary_color'] ?>">
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Used for buttons, links, and accents
                            </small>
                        </div>

                        <div class="form-group">
                            <label>Secondary Color</label>
                            <div class="color-input-group">
                                <div class="color-preview" style="background: <?= $currentSettings['brand_secondary_color'] ?>"></div>
                                <input type="text" name="brand_secondary_color" class="color-picker" value="<?= $currentSettings['brand_secondary_color'] ?>">
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Used for gradients and highlights
                            </small>
                        </div>

                        <div class="form-group">
                            <label>Text Color</label>
                            <div class="color-input-group">
                                <div class="color-preview" style="background: <?= $currentSettings['brand_text_color'] ?>"></div>
                                <input type="text" name="brand_text_color" class="color-picker" value="<?= $currentSettings['brand_text_color'] ?>">
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Default text color across the site
                            </small>
                        </div>

                        <div class="form-group">
                            <label>Background Color</label>
                            <div class="color-input-group">
                                <div class="color-preview" style="background: <?= $currentSettings['brand_bg_color'] ?>"></div>
                                <input type="text" name="brand_bg_color" class="color-picker" value="<?= $currentSettings['brand_bg_color'] ?>">
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Main background color
                            </small>
                        </div>
                    </div>

                    <!-- Typography -->
                    <div class="settings-card">
                        <h2><i class="fas fa-font"></i> Typography</h2>

                        <div class="form-group">
                            <label>Heading Font</label>
                            <select name="brand_font_heading" id="headingFont" onchange="updatePreview()">
                                <option value="Syne" <?= $currentSettings['brand_font_heading'] === 'Syne' ? 'selected' : '' ?>>Syne</option>
                                <option value="Inter Tight" <?= $currentSettings['brand_font_heading'] === 'Inter Tight' ? 'selected' : '' ?>>Inter Tight</option>
                                <option value="Bebas Neue" <?= $currentSettings['brand_font_heading'] === 'Bebas Neue' ? 'selected' : '' ?>>Bebas Neue</option>
                                <option value="Rowdies" <?= $currentSettings['brand_font_heading'] === 'Rowdies' ? 'selected' : '' ?>>Rowdies</option>
                                <option value="DM Mono" <?= $currentSettings['brand_font_heading'] === 'DM Mono' ? 'selected' : '' ?>>DM Mono</option>
                            </select>
                            <div class="font-preview" id="headingPreview" style="font-family: '<?= $currentSettings['brand_font_heading'] ?>'; font-size: 1.5em; font-weight: 700;">
                                The Quick Brown Fox Jumps
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Body Font</label>
                            <select name="brand_font_body" id="bodyFont" onchange="updatePreview()">
                                <option value="Inter Tight" <?= $currentSettings['brand_font_body'] === 'Inter Tight' ? 'selected' : '' ?>>Inter Tight</option>
                                <option value="Syne" <?= $currentSettings['brand_font_body'] === 'Syne' ? 'selected' : '' ?>>Syne</option>
                                <option value="DM Mono" <?= $currentSettings['brand_font_body'] === 'DM Mono' ? 'selected' : '' ?>>DM Mono</option>
                            </select>
                            <div class="font-preview" id="bodyPreview" style="font-family: '<?= $currentSettings['brand_font_body'] ?>';">
                                The quick brown fox jumps over the lazy dog. This is how your body text will look across the website.
                            </div>
                        </div>
                    </div>

                    <!-- Site Information -->
                    <div class="settings-card">
                        <h2><i class="fas fa-info-circle"></i> Site Information</h2>

                        <div class="form-group">
                            <label>Site Title</label>
                            <input type="text" name="site_title" value="<?= htmlspecialchars($currentSettings['site_title']) ?>" onchange="updatePreview()">
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Appears in browser tabs and search results
                            </small>
                        </div>

                        <div class="form-group">
                            <label>Site Tagline</label>
                            <input type="text" name="site_tagline" value="<?= htmlspecialchars($currentSettings['site_tagline']) ?>" onchange="updatePreview()">
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Short description of your business
                            </small>
                        </div>

                        <div class="form-group">
                            <label>Logo URL</label>
                            <input type="text" name="site_logo_url" id="logoUrl" value="<?= htmlspecialchars($currentSettings['site_logo_url']) ?>" onchange="updatePreview()">
                            <small style="color: var(--text-secondary); display: block; margin-top: 5px;">
                                Relative path to your logo (e.g., images/logo.png)
                            </small>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="padding: 15px; font-size: 16px;">
                        <i class="fas fa-save"></i> Save Global Settings
                    </button>
                </div>

                <!-- Live Preview -->
                <div>
                    <div class="preview-card">
                        <h2><i class="fas fa-eye"></i> Live Preview</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9em;">
                            See how your brand settings will look
                        </p>

                        <div class="preview-content" id="livePreview">
                            <img src="../<?= htmlspecialchars($currentSettings['site_logo_url']) ?>"
                                 alt="Logo"
                                 class="preview-logo"
                                 id="previewLogo"
                                 onerror="this.style.display='none'">

                            <h1 class="preview-heading" id="previewHeading"
                                style="font-family: '<?= $currentSettings['brand_font_heading'] ?>';
                                       color: <?= $currentSettings['brand_primary_color'] ?>;">
                                <?= htmlspecialchars($currentSettings['site_title']) ?>
                            </h1>

                            <p class="preview-text" id="previewTagline"
                               style="font-family: '<?= $currentSettings['brand_font_body'] ?>';
                                      color: <?= $currentSettings['brand_text_color'] ?>;">
                                <?= htmlspecialchars($currentSettings['site_tagline']) ?>
                            </p>

                            <button class="preview-button" id="previewButton"
                                    style="background: linear-gradient(135deg, <?= $currentSettings['brand_primary_color'] ?>, <?= $currentSettings['brand_secondary_color'] ?>);">
                                Get Started
                            </button>

                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <p style="font-family: '<?= $currentSettings['brand_font_body'] ?>';
                                          color: <?= $currentSettings['brand_text_color'] ?>;
                                          font-size: 0.9em;
                                          text-align: left;">
                                    This is example body text. Your content will be displayed in
                                    <a href="#" id="previewLink" style="color: <?= $currentSettings['brand_primary_color'] ?>;">
                                        this style with links
                                    </a>
                                    throughout the website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js"></script>
    <script>
        // Initialize color pickers
        $('.color-picker').spectrum({
            type: "color",
            showInput: true,
            showAlpha: false,
            preferredFormat: "hex",
            change: function(color) {
                updatePreview();
            }
        });

        // Update preview in real-time
        function updatePreview() {
            const primaryColor = $('input[name="brand_primary_color"]').val();
            const secondaryColor = $('input[name="brand_secondary_color"]').val();
            const textColor = $('input[name="brand_text_color"]').val();
            const bgColor = $('input[name="brand_bg_color"]').val();
            const headingFont = $('#headingFont').val();
            const bodyFont = $('#bodyFont').val();
            const siteTitle = $('input[name="site_title"]').val();
            const siteTagline = $('input[name="site_tagline"]').val();
            const logoUrl = $('#logoUrl').val();

            // Update preview
            $('#previewHeading').css({
                'font-family': headingFont,
                'color': primaryColor
            }).text(siteTitle);

            $('#previewTagline').css({
                'font-family': bodyFont,
                'color': textColor
            }).text(siteTagline);

            $('#previewButton').css({
                'background': `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
            });

            $('#previewLink').css('color', primaryColor);
            $('#previewLogo').attr('src', '../' + logoUrl);

            // Update font previews
            $('#headingPreview').css('font-family', headingFont);
            $('#bodyPreview').css('font-family', bodyFont);

            // Update content background
            $('#livePreview').css('background', bgColor);
            $('#livePreview p').css('color', textColor);
        }

        // Call once on load
        updatePreview();
    </script>
</body>
</html>
