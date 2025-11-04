<?php
/**
 * Neofox Media Visual Editor Panel
 * Advanced Visual Page Builder - Similar to Elementor
 * Version: 1.0.0
 */

session_start();

// Configuration
define('EDITOR_VERSION', '1.0.0');
define('BASE_PATH', dirname(__DIR__));
define('UPLOAD_PATH', BASE_PATH . '/images/');
define('BACKUP_PATH', BASE_PATH . '/editor/backups/');

// Simple authentication (change credentials in config.php)
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

// Check if user is logged in
if (!isset($_SESSION['editor_logged_in'])) {
    header('Location: login.php');
    exit;
}

// Redirect to dashboard if no page specified (first time users)
if (!isset($_GET['page']) && !isset($_GET['tab'])) {
    // Check if it's first time - show dashboard
    $firstTime = getSetting('first_time_user', 'true');
    if ($firstTime === 'true') {
        setSetting('first_time_user', 'false');
    }
    header('Location: dashboard.php');
    exit;
}

// Get available pages
$pages = getAvailablePages();
$current_page = isset($_GET['page']) ? $_GET['page'] : 'index.html';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neofox Visual Editor - Advanced Page Builder</title>
    <link rel="stylesheet" href="assets/css/editor.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.css">
    <link rel="icon" href="../images/favicon.png" type="image/png">
</head>
<body class="editor-body">

    <!-- Top Navigation Bar -->
    <div class="editor-topbar">
        <div class="topbar-left">
            <img src="../images/neofox-web-logo2.png" alt="Neofox Media" class="editor-logo">
            <span class="editor-title">Visual Editor</span>
            <div class="page-selector">
                <select id="pageSelect" onchange="loadPage(this.value)">
                    <?php foreach ($pages as $page): ?>
                        <option value="<?= htmlspecialchars($page) ?>" <?= $page === $current_page ? 'selected' : '' ?>>
                            <?= htmlspecialchars(ucfirst(str_replace(['.html', '-'], [' ', ' '], basename($page)))) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="topbar-center">
            <button class="btn btn-icon" id="undoBtn" title="Undo (Ctrl+Z)">
                <i class="fas fa-undo"></i>
            </button>
            <button class="btn btn-icon" id="redoBtn" title="Redo (Ctrl+Y)">
                <i class="fas fa-redo"></i>
            </button>

            <div class="device-selector">
                <button class="btn btn-icon active" data-device="desktop" title="Desktop View">
                    <i class="fas fa-desktop"></i>
                </button>
                <button class="btn btn-icon" data-device="tablet" title="Tablet View">
                    <i class="fas fa-tablet-alt"></i>
                </button>
                <button class="btn btn-icon" data-device="mobile" title="Mobile View">
                    <i class="fas fa-mobile-alt"></i>
                </button>
            </div>
        </div>

        <div class="topbar-right">
            <button class="btn btn-secondary" id="previewBtn">
                <i class="fas fa-eye"></i> Preview
            </button>
            <button class="btn btn-primary" id="saveBtn">
                <i class="fas fa-save"></i> Save Changes
            </button>
            <button class="btn btn-icon" onclick="location.href='settings.php'" title="Settings">
                <i class="fas fa-cog"></i>
            </button>
            <button class="btn btn-icon" onclick="location.href='logout.php'" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </div>

    <!-- Main Editor Layout -->
    <div class="editor-container">

        <!-- Left Sidebar - Elements & Blocks -->
        <div class="editor-sidebar left-sidebar" id="leftSidebar">
            <div class="sidebar-tabs">
                <button class="tab-btn active" data-tab="elements">
                    <i class="fas fa-plus-circle"></i> Elements
                </button>
                <button class="tab-btn" data-tab="blocks">
                    <i class="fas fa-th-large"></i> Blocks
                </button>
                <button class="tab-btn" data-tab="media">
                    <i class="fas fa-image"></i> Media
                </button>
            </div>

            <!-- Elements Tab -->
            <div class="tab-content active" data-content="elements">
                <div class="search-box">
                    <input type="text" placeholder="Search elements..." id="elementSearch">
                </div>

                <div class="element-categories">
                    <div class="category">
                        <h4>Basic Elements</h4>
                        <div class="elements-grid">
                            <div class="element-item" draggable="true" data-element="heading">
                                <i class="fas fa-heading"></i>
                                <span>Heading</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="text">
                                <i class="fas fa-paragraph"></i>
                                <span>Text</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="image">
                                <i class="fas fa-image"></i>
                                <span>Image</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="video">
                                <i class="fas fa-video"></i>
                                <span>Video</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="button">
                                <i class="fas fa-hand-pointer"></i>
                                <span>Button</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="divider">
                                <i class="fas fa-minus"></i>
                                <span>Divider</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="spacer">
                                <i class="fas fa-arrows-alt-v"></i>
                                <span>Spacer</span>
                            </div>
                        </div>
                    </div>

                    <div class="category">
                        <h4>Layout Elements</h4>
                        <div class="elements-grid">
                            <div class="element-item" draggable="true" data-element="section">
                                <i class="fas fa-object-group"></i>
                                <span>Section</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="container">
                                <i class="fas fa-square"></i>
                                <span>Container</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="columns">
                                <i class="fas fa-columns"></i>
                                <span>Columns</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="grid">
                                <i class="fas fa-th"></i>
                                <span>Grid</span>
                            </div>
                        </div>
                    </div>

                    <div class="category">
                        <h4>Interactive Elements</h4>
                        <div class="elements-grid">
                            <div class="element-item" draggable="true" data-element="tabs">
                                <i class="fas fa-folder"></i>
                                <span>Tabs</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="accordion">
                                <i class="fas fa-bars"></i>
                                <span>Accordion</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="slider">
                                <i class="fas fa-sliders-h"></i>
                                <span>Slider</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="gallery">
                                <i class="fas fa-images"></i>
                                <span>Gallery</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="carousel">
                                <i class="fas fa-film"></i>
                                <span>Carousel</span>
                            </div>
                        </div>
                    </div>

                    <div class="category">
                        <h4>Advanced Elements</h4>
                        <div class="elements-grid">
                            <div class="element-item" draggable="true" data-element="form">
                                <i class="fas fa-wpforms"></i>
                                <span>Form</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="icon">
                                <i class="fas fa-icons"></i>
                                <span>Icon</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="social">
                                <i class="fas fa-share-alt"></i>
                                <span>Social Icons</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="embed">
                                <i class="fas fa-code"></i>
                                <span>Embed Code</span>
                            </div>
                            <div class="element-item" draggable="true" data-element="countdown">
                                <i class="fas fa-clock"></i>
                                <span>Countdown</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Blocks Tab -->
            <div class="tab-content" data-content="blocks">
                <div class="search-box">
                    <input type="text" placeholder="Search blocks..." id="blockSearch">
                </div>
                <div class="blocks-list">
                    <div class="block-item" data-block="hero">
                        <img src="assets/img/blocks/hero.svg" alt="Hero Section">
                        <span>Hero Section</span>
                    </div>
                    <div class="block-item" data-block="about">
                        <img src="assets/img/blocks/about.svg" alt="About Section">
                        <span>About Section</span>
                    </div>
                    <div class="block-item" data-block="services">
                        <img src="assets/img/blocks/services.svg" alt="Services">
                        <span>Services Grid</span>
                    </div>
                    <div class="block-item" data-block="portfolio">
                        <img src="assets/img/blocks/portfolio.svg" alt="Portfolio">
                        <span>Portfolio Grid</span>
                    </div>
                    <div class="block-item" data-block="testimonials">
                        <img src="assets/img/blocks/testimonials.svg" alt="Testimonials">
                        <span>Testimonials</span>
                    </div>
                    <div class="block-item" data-block="cta">
                        <img src="assets/img/blocks/cta.svg" alt="Call to Action">
                        <span>Call to Action</span>
                    </div>
                    <div class="block-item" data-block="footer">
                        <img src="assets/img/blocks/footer.svg" alt="Footer">
                        <span>Footer</span>
                    </div>
                </div>
            </div>

            <!-- Media Tab -->
            <div class="tab-content" data-content="media">
                <div class="media-upload-area">
                    <button class="btn btn-primary btn-block" onclick="openMediaUploader()">
                        <i class="fas fa-cloud-upload-alt"></i> Upload Media
                    </button>
                </div>
                <div class="media-library" id="mediaLibrary">
                    <!-- Media items will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Center Canvas - Preview Area -->
        <div class="editor-canvas" id="editorCanvas">
            <div class="canvas-ruler top"></div>
            <div class="canvas-ruler left"></div>

            <iframe
                id="previewFrame"
                src="../<?= htmlspecialchars($current_page) ?>"
                frameborder="0"
                class="preview-iframe"
            ></iframe>

            <div class="canvas-overlay" id="canvasOverlay"></div>
        </div>

        <!-- Right Sidebar - Properties & Styles -->
        <div class="editor-sidebar right-sidebar" id="rightSidebar">
            <div class="sidebar-header">
                <h3 id="selectedElementTitle">No Element Selected</h3>
                <button class="btn btn-icon btn-sm" id="closePanelBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="sidebar-tabs">
                <button class="tab-btn active" data-tab="content">
                    <i class="fas fa-align-left"></i> Content
                </button>
                <button class="tab-btn" data-tab="style">
                    <i class="fas fa-paint-brush"></i> Style
                </button>
                <button class="tab-btn" data-tab="advanced">
                    <i class="fas fa-cog"></i> Advanced
                </button>
            </div>

            <!-- Content Tab -->
            <div class="tab-content active" data-content="content">
                <div id="contentControls" class="controls-panel">
                    <p class="no-selection-message">
                        <i class="fas fa-hand-pointer"></i>
                        Click on any element in the canvas to edit
                    </p>
                </div>
            </div>

            <!-- Style Tab -->
            <div class="tab-content" data-content="style">
                <div id="styleControls" class="controls-panel">

                    <!-- Typography Section -->
                    <div class="control-section">
                        <h4 class="section-title">Typography</h4>
                        <div class="control-group">
                            <label>Font Family</label>
                            <select class="control-input" data-style="fontFamily">
                                <option value="">Default</option>
                                <option value="Syne">Syne</option>
                                <option value="Inter Tight">Inter Tight</option>
                                <option value="DM Mono">DM Mono</option>
                                <option value="Bebas Neue">Bebas Neue</option>
                                <option value="Rowdies">Rowdies</option>
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="'Times New Roman', serif">Times New Roman</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Font Size</label>
                            <div class="input-with-unit">
                                <input type="number" class="control-input" data-style="fontSize" placeholder="16">
                                <select class="unit-select" data-style="fontSizeUnit">
                                    <option value="px">px</option>
                                    <option value="rem">rem</option>
                                    <option value="em">em</option>
                                    <option value="%">%</option>
                                </select>
                            </div>
                        </div>

                        <div class="control-group">
                            <label>Font Weight</label>
                            <select class="control-input" data-style="fontWeight">
                                <option value="">Default</option>
                                <option value="300">Light (300)</option>
                                <option value="400">Normal (400)</option>
                                <option value="500">Medium (500)</option>
                                <option value="600">Semi-Bold (600)</option>
                                <option value="700">Bold (700)</option>
                                <option value="800">Extra-Bold (800)</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Text Color</label>
                            <input type="text" class="control-input color-picker" data-style="color" placeholder="#000000">
                        </div>

                        <div class="control-group">
                            <label>Text Align</label>
                            <div class="button-group">
                                <button class="btn-group-item" data-style="textAlign" data-value="left">
                                    <i class="fas fa-align-left"></i>
                                </button>
                                <button class="btn-group-item" data-style="textAlign" data-value="center">
                                    <i class="fas fa-align-center"></i>
                                </button>
                                <button class="btn-group-item" data-style="textAlign" data-value="right">
                                    <i class="fas fa-align-right"></i>
                                </button>
                                <button class="btn-group-item" data-style="textAlign" data-value="justify">
                                    <i class="fas fa-align-justify"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Background Section -->
                    <div class="control-section">
                        <h4 class="section-title">Background</h4>
                        <div class="control-group">
                            <label>Background Type</label>
                            <select class="control-input" id="backgroundType">
                                <option value="color">Color</option>
                                <option value="gradient">Gradient</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        </div>

                        <div class="control-group" id="bgColorGroup">
                            <label>Background Color</label>
                            <input type="text" class="control-input color-picker" data-style="backgroundColor" placeholder="#ffffff">
                        </div>

                        <div class="control-group hidden" id="bgGradientGroup">
                            <label>Gradient</label>
                            <button class="btn btn-secondary btn-block" onclick="openGradientEditor()">
                                <i class="fas fa-fill-drip"></i> Edit Gradient
                            </button>
                        </div>

                        <div class="control-group hidden" id="bgImageGroup">
                            <label>Background Image</label>
                            <button class="btn btn-secondary btn-block" onclick="selectBackgroundImage()">
                                <i class="fas fa-image"></i> Select Image
                            </button>
                        </div>
                    </div>

                    <!-- Spacing Section -->
                    <div class="control-section">
                        <h4 class="section-title">Spacing</h4>
                        <div class="spacing-control">
                            <div class="spacing-visual">
                                <div class="spacing-label">Margin</div>
                                <div class="spacing-inputs margin-inputs">
                                    <input type="number" placeholder="0" data-style="marginTop" title="Top">
                                    <input type="number" placeholder="0" data-style="marginRight" title="Right">
                                    <input type="number" placeholder="0" data-style="marginBottom" title="Bottom">
                                    <input type="number" placeholder="0" data-style="marginLeft" title="Left">
                                </div>
                                <div class="spacing-label">Padding</div>
                                <div class="spacing-inputs padding-inputs">
                                    <input type="number" placeholder="0" data-style="paddingTop" title="Top">
                                    <input type="number" placeholder="0" data-style="paddingRight" title="Right">
                                    <input type="number" placeholder="0" data-style="paddingBottom" title="Bottom">
                                    <input type="number" placeholder="0" data-style="paddingLeft" title="Left">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Border Section -->
                    <div class="control-section">
                        <h4 class="section-title">Border</h4>
                        <div class="control-group">
                            <label>Border Width</label>
                            <input type="number" class="control-input" data-style="borderWidth" placeholder="0">
                        </div>
                        <div class="control-group">
                            <label>Border Style</label>
                            <select class="control-input" data-style="borderStyle">
                                <option value="none">None</option>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                                <option value="double">Double</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Border Color</label>
                            <input type="text" class="control-input color-picker" data-style="borderColor" placeholder="#000000">
                        </div>
                        <div class="control-group">
                            <label>Border Radius</label>
                            <input type="number" class="control-input" data-style="borderRadius" placeholder="0">
                        </div>
                    </div>

                    <!-- Shadow Section -->
                    <div class="control-section">
                        <h4 class="section-title">Shadow</h4>
                        <div class="control-group">
                            <button class="btn btn-secondary btn-block" onclick="openShadowEditor()">
                                <i class="fas fa-magic"></i> Edit Shadow
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Advanced Tab -->
            <div class="tab-content" data-content="advanced">
                <div id="advancedControls" class="controls-panel">

                    <!-- Animations Section -->
                    <div class="control-section">
                        <h4 class="section-title">
                            <i class="fas fa-magic"></i> Animations
                        </h4>
                        <div class="control-group">
                            <label>Entrance Animation</label>
                            <select class="control-input" id="entranceAnimation">
                                <option value="">None</option>
                                <option value="fadeIn">Fade In</option>
                                <option value="fadeInUp">Fade In Up</option>
                                <option value="fadeInDown">Fade In Down</option>
                                <option value="fadeInLeft">Fade In Left</option>
                                <option value="fadeInRight">Fade In Right</option>
                                <option value="zoomIn">Zoom In</option>
                                <option value="zoomOut">Zoom Out</option>
                                <option value="slideInUp">Slide In Up</option>
                                <option value="slideInDown">Slide In Down</option>
                                <option value="slideInLeft">Slide In Left</option>
                                <option value="slideInRight">Slide In Right</option>
                                <option value="bounceIn">Bounce In</option>
                                <option value="rotateIn">Rotate In</option>
                                <option value="flipInX">Flip In X</option>
                                <option value="flipInY">Flip In Y</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Animation Duration (ms)</label>
                            <input type="number" class="control-input" id="animationDuration" placeholder="600" value="600">
                        </div>

                        <div class="control-group">
                            <label>Animation Delay (ms)</label>
                            <input type="number" class="control-input" id="animationDelay" placeholder="0" value="0">
                        </div>

                        <div class="control-group">
                            <label>Hover Animation</label>
                            <select class="control-input" id="hoverAnimation">
                                <option value="">None</option>
                                <option value="pulse">Pulse</option>
                                <option value="bounce">Bounce</option>
                                <option value="shake">Shake</option>
                                <option value="swing">Swing</option>
                                <option value="wobble">Wobble</option>
                                <option value="grow">Grow</option>
                                <option value="shrink">Shrink</option>
                                <option value="float">Float</option>
                                <option value="sink">Sink</option>
                                <option value="glow">Glow</option>
                            </select>
                        </div>
                    </div>

                    <!-- Effects Section -->
                    <div class="control-section">
                        <h4 class="section-title">
                            <i class="fas fa-wand-magic"></i> Effects
                        </h4>
                        <div class="control-group">
                            <label>Opacity</label>
                            <input type="range" min="0" max="100" value="100" class="control-slider" id="opacitySlider">
                            <span class="slider-value">100%</span>
                        </div>

                        <div class="control-group">
                            <label>Blur (px)</label>
                            <input type="range" min="0" max="20" value="0" class="control-slider" id="blurSlider">
                            <span class="slider-value">0px</span>
                        </div>

                        <div class="control-group">
                            <label>Brightness</label>
                            <input type="range" min="0" max="200" value="100" class="control-slider" id="brightnessSlider">
                            <span class="slider-value">100%</span>
                        </div>

                        <div class="control-group">
                            <label>Contrast</label>
                            <input type="range" min="0" max="200" value="100" class="control-slider" id="contrastSlider">
                            <span class="slider-value">100%</span>
                        </div>

                        <div class="control-group">
                            <label>Saturation</label>
                            <input type="range" min="0" max="200" value="100" class="control-slider" id="saturationSlider">
                            <span class="slider-value">100%</span>
                        </div>

                        <div class="control-group">
                            <label>Hue Rotate</label>
                            <input type="range" min="0" max="360" value="0" class="control-slider" id="hueSlider">
                            <span class="slider-value">0°</span>
                        </div>
                    </div>

                    <!-- Transform Section -->
                    <div class="control-section">
                        <h4 class="section-title">Transform</h4>
                        <div class="control-group">
                            <label>Rotate (deg)</label>
                            <input type="range" min="-180" max="180" value="0" class="control-slider" id="rotateSlider">
                            <span class="slider-value">0°</span>
                        </div>

                        <div class="control-group">
                            <label>Scale</label>
                            <input type="range" min="0" max="200" value="100" class="control-slider" id="scaleSlider">
                            <span class="slider-value">100%</span>
                        </div>
                    </div>

                    <!-- Custom CSS Section -->
                    <div class="control-section">
                        <h4 class="section-title">Custom CSS</h4>
                        <div class="control-group">
                            <textarea class="control-textarea" id="customCSS" rows="6" placeholder="/* Add custom CSS here */"></textarea>
                        </div>
                    </div>

                    <!-- Custom Attributes Section -->
                    <div class="control-section">
                        <h4 class="section-title">Custom Attributes</h4>
                        <div class="control-group">
                            <label>Element ID</label>
                            <input type="text" class="control-input" id="elementId" placeholder="unique-id">
                        </div>
                        <div class="control-group">
                            <label>CSS Classes</label>
                            <input type="text" class="control-input" id="elementClasses" placeholder="class1 class2">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->

    <!-- Media Uploader Modal -->
    <div class="modal" id="mediaUploaderModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-header">
                <h3>Upload Media</h3>
                <button class="btn btn-icon" onclick="closeModal('mediaUploaderModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="upload-zone" id="uploadZone">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h3>Drag & Drop Files Here</h3>
                    <p>or click to browse</p>
                    <input type="file" id="fileInput" multiple accept="image/*,video/*" style="display: none;">
                </div>
                <div class="upload-progress" id="uploadProgress"></div>
            </div>
        </div>
    </div>

    <!-- Gradient Editor Modal -->
    <div class="modal" id="gradientEditorModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3>Gradient Editor</h3>
                <button class="btn btn-icon" onclick="closeModal('gradientEditorModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="gradient-preview" id="gradientPreview"></div>
                <div class="gradient-controls">
                    <div class="control-group">
                        <label>Gradient Type</label>
                        <select class="control-input" id="gradientType">
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Angle (deg)</label>
                        <input type="range" min="0" max="360" value="90" class="control-slider" id="gradientAngle">
                        <span class="slider-value">90°</span>
                    </div>
                    <div class="color-stops" id="colorStops">
                        <!-- Color stops will be added here -->
                    </div>
                    <button class="btn btn-secondary" onclick="addColorStop()">
                        <i class="fas fa-plus"></i> Add Color Stop
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('gradientEditorModal')">Cancel</button>
                <button class="btn btn-primary" onclick="applyGradient()">Apply Gradient</button>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div class="notification-container" id="notificationContainer"></div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
        <p>Processing...</p>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/spectrum-colorpicker2/dist/spectrum.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    <script src="assets/js/editor-core.js"></script>
    <script src="assets/js/editor-elements.js"></script>
    <script src="assets/js/editor-animations.js"></script>
    <script src="assets/js/editor-media.js"></script>
    <script src="assets/js/editor-history.js"></script>

</body>
</html>
