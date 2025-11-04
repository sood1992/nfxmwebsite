/**
 * Neofox Media Visual Editor - Core Engine
 * Main editor functionality and state management
 */

const NFXEditor = {
    // State
    currentPage: null,
    selectedElement: null,
    iframe: null,
    iframeDoc: null,
    isDirty: false,
    autoSaveInterval: null,

    // Initialize
    init() {
        console.log('🚀 Neofox Visual Editor Initializing...');

        this.iframe = document.getElementById('previewFrame');
        this.currentPage = document.getElementById('pageSelect').value;

        // Wait for iframe to load
        this.iframe.addEventListener('load', () => {
            this.onIframeLoad();
        });

        // Setup UI
        this.setupUI();
        this.setupTabSwitching();
        this.setupDeviceSelector();
        this.setupColorPickers();
        this.setupAutoSave();

        console.log('✅ Editor Ready!');
    },

    // Iframe loaded
    onIframeLoad() {
        try {
            this.iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;

            // Make all elements selectable
            this.makeElementsSelectable();

            // Make elements editable
            this.makeElementsEditable();

            // Add visual indicators
            this.addEditorStyles();

            this.showNotification('Page loaded successfully', 'success');
        } catch (error) {
            console.error('Error accessing iframe:', error);
            this.showNotification('Error loading page', 'error');
        }
    },

    // Make elements selectable
    makeElementsSelectable() {
        if (!this.iframeDoc) return;

        const selectableElements = this.iframeDoc.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, a, button, img, video, section, div[class], article, header, footer'
        );

        selectableElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.setAttribute('data-nfx-editable', 'true');

            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element);
            });

            element.addEventListener('mouseenter', (e) => {
                if (element !== this.selectedElement) {
                    element.style.outline = '2px dashed #667eea';
                    element.style.outlineOffset = '2px';
                }
            });

            element.addEventListener('mouseleave', (e) => {
                if (element !== this.selectedElement) {
                    element.style.outline = '';
                    element.style.outlineOffset = '';
                }
            });
        });
    },

    // Make elements editable
    makeElementsEditable() {
        if (!this.iframeDoc) return;

        const textElements = this.iframeDoc.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, a, button, span[class], div[class]'
        );

        textElements.forEach(element => {
            element.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!element.getAttribute('contenteditable')) {
                    element.setAttribute('contenteditable', 'true');
                    element.focus();
                    element.style.outline = '2px solid #10b981';

                    const saveEdit = () => {
                        element.removeAttribute('contenteditable');
                        element.style.outline = '2px solid #667eea';
                        this.markDirty();
                    };

                    element.addEventListener('blur', saveEdit, { once: true });
                    element.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            saveEdit();
                        }
                    });
                }
            });
        });
    },

    // Add editor styles to iframe
    addEditorStyles() {
        if (!this.iframeDoc) return;

        const style = this.iframeDoc.createElement('style');
        style.textContent = `
            *[data-nfx-selected="true"] {
                outline: 3px solid #667eea !important;
                outline-offset: 2px !important;
                position: relative;
            }
            *[data-nfx-selected="true"]::after {
                content: attr(data-nfx-label);
                position: absolute;
                top: -25px;
                left: 0;
                background: #667eea;
                color: white;
                padding: 4px 10px;
                font-size: 11px;
                font-weight: 600;
                border-radius: 4px;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            }
            *[contenteditable="true"] {
                outline: 2px solid #10b981 !important;
            }
        `;
        this.iframeDoc.head.appendChild(style);
    },

    // Select element
    selectElement(element) {
        // Deselect previous
        if (this.selectedElement) {
            this.selectedElement.removeAttribute('data-nfx-selected');
            this.selectedElement.style.outline = '';
        }

        // Select new
        this.selectedElement = element;
        element.setAttribute('data-nfx-selected', 'true');

        // Set label
        const tagName = element.tagName.toLowerCase();
        const className = element.className ? '.' + element.className.split(' ')[0] : '';
        element.setAttribute('data-nfx-label', tagName + className);

        // Update right panel
        this.updatePropertiesPanel();

        console.log('Selected:', element);
    },

    // Update properties panel
    updatePropertiesPanel() {
        if (!this.selectedElement) return;

        const element = this.selectedElement;
        const tagName = element.tagName.toLowerCase();

        // Update title
        document.getElementById('selectedElementTitle').textContent =
            tagName.toUpperCase() + (element.className ? ' .' + element.className.split(' ')[0] : '');

        // Get computed styles
        const styles = window.getComputedStyle(element);

        // Update content controls
        this.updateContentControls(element);

        // Update style controls
        this.updateStyleControls(element, styles);

        // Update advanced controls
        this.updateAdvancedControls(element);

        // Show right sidebar
        document.getElementById('rightSidebar').style.display = 'flex';
    },

    // Update content controls
    updateContentControls(element) {
        const contentControls = document.getElementById('contentControls');
        let html = '';

        const tagName = element.tagName.toLowerCase();

        // Text content
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'span'].includes(tagName)) {
            html += `
                <div class="control-group">
                    <label>Text Content</label>
                    <textarea class="control-input" id="elementText" rows="4">${element.textContent}</textarea>
                </div>
            `;

            if (tagName === 'a' || tagName === 'button') {
                html += `
                    <div class="control-group">
                        <label>Link URL</label>
                        <input type="text" class="control-input" id="elementHref" value="${element.getAttribute('href') || ''}">
                    </div>
                `;
            }
        }

        // Image
        if (tagName === 'img') {
            html += `
                <div class="control-group">
                    <label>Image Source</label>
                    <input type="text" class="control-input" id="elementSrc" value="${element.getAttribute('src') || ''}">
                </div>
                <div class="control-group">
                    <label>Alt Text</label>
                    <input type="text" class="control-input" id="elementAlt" value="${element.getAttribute('alt') || ''}">
                </div>
                <div class="control-group">
                    <button class="btn btn-secondary btn-block" onclick="NFXEditor.selectImageFromLibrary()">
                        <i class="fas fa-images"></i> Choose from Library
                    </button>
                </div>
            `;
        }

        // Video
        if (tagName === 'video') {
            html += `
                <div class="control-group">
                    <label>Video Source</label>
                    <input type="text" class="control-input" id="elementSrc" value="${element.getAttribute('src') || ''}">
                </div>
                <div class="control-group">
                    <label>Controls</label>
                    <input type="checkbox" id="videoControls" ${element.hasAttribute('controls') ? 'checked' : ''}>
                </div>
                <div class="control-group">
                    <button class="btn btn-secondary btn-block" onclick="NFXEditor.selectVideoFromLibrary()">
                        <i class="fas fa-video"></i> Choose from Library
                    </button>
                </div>
            `;
        }

        contentControls.innerHTML = html;

        // Add event listeners
        this.attachContentControlListeners();
    },

    // Attach content control listeners
    attachContentControlListeners() {
        const elementText = document.getElementById('elementText');
        if (elementText) {
            elementText.addEventListener('input', (e) => {
                this.selectedElement.textContent = e.target.value;
                this.markDirty();
            });
        }

        const elementHref = document.getElementById('elementHref');
        if (elementHref) {
            elementHref.addEventListener('input', (e) => {
                this.selectedElement.setAttribute('href', e.target.value);
                this.markDirty();
            });
        }

        const elementSrc = document.getElementById('elementSrc');
        if (elementSrc) {
            elementSrc.addEventListener('input', (e) => {
                this.selectedElement.setAttribute('src', e.target.value);
                this.markDirty();
            });
        }

        const elementAlt = document.getElementById('elementAlt');
        if (elementAlt) {
            elementAlt.addEventListener('input', (e) => {
                this.selectedElement.setAttribute('alt', e.target.value);
                this.markDirty();
            });
        }
    },

    // Update style controls
    updateStyleControls(element, styles) {
        // Typography
        const fontFamily = document.querySelector('[data-style="fontFamily"]');
        if (fontFamily) {
            fontFamily.value = styles.fontFamily.split(',')[0].replace(/["']/g, '');
            fontFamily.addEventListener('change', (e) => {
                element.style.fontFamily = e.target.value;
                this.markDirty();
            });
        }

        const fontSize = document.querySelector('[data-style="fontSize"]');
        if (fontSize) {
            fontSize.value = parseInt(styles.fontSize);
            fontSize.addEventListener('input', (e) => {
                const unit = document.querySelector('[data-style="fontSizeUnit"]').value;
                element.style.fontSize = e.target.value + unit;
                this.markDirty();
            });
        }

        const fontWeight = document.querySelector('[data-style="fontWeight"]');
        if (fontWeight) {
            fontWeight.value = styles.fontWeight;
            fontWeight.addEventListener('change', (e) => {
                element.style.fontWeight = e.target.value;
                this.markDirty();
            });
        }

        // Colors
        const color = document.querySelector('[data-style="color"]');
        if (color) {
            color.value = this.rgbToHex(styles.color);
        }

        const backgroundColor = document.querySelector('[data-style="backgroundColor"]');
        if (backgroundColor) {
            backgroundColor.value = this.rgbToHex(styles.backgroundColor);
        }

        // Spacing
        this.attachSpacingControls(element, styles);

        // Border
        this.attachBorderControls(element, styles);

        // Text align
        document.querySelectorAll('[data-style="textAlign"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.currentTarget.getAttribute('data-value');
                element.style.textAlign = value;
                document.querySelectorAll('[data-style="textAlign"]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.markDirty();
            });
        });
    },

    // Attach spacing controls
    attachSpacingControls(element, styles) {
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft',
         'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach(prop => {
            const input = document.querySelector(`[data-style="${prop}"]`);
            if (input) {
                input.value = parseInt(styles[prop]) || 0;
                input.addEventListener('input', (e) => {
                    element.style[prop] = e.target.value + 'px';
                    this.markDirty();
                });
            }
        });
    },

    // Attach border controls
    attachBorderControls(element, styles) {
        const borderWidth = document.querySelector('[data-style="borderWidth"]');
        if (borderWidth) {
            borderWidth.value = parseInt(styles.borderWidth) || 0;
            borderWidth.addEventListener('input', (e) => {
                element.style.borderWidth = e.target.value + 'px';
                this.markDirty();
            });
        }

        const borderStyle = document.querySelector('[data-style="borderStyle"]');
        if (borderStyle) {
            borderStyle.value = styles.borderStyle;
            borderStyle.addEventListener('change', (e) => {
                element.style.borderStyle = e.target.value;
                this.markDirty();
            });
        }

        const borderRadius = document.querySelector('[data-style="borderRadius"]');
        if (borderRadius) {
            borderRadius.value = parseInt(styles.borderRadius) || 0;
            borderRadius.addEventListener('input', (e) => {
                element.style.borderRadius = e.target.value + 'px';
                this.markDirty();
            });
        }
    },

    // Update advanced controls
    updateAdvancedControls(element) {
        // Element ID
        const elementId = document.getElementById('elementId');
        if (elementId) {
            elementId.value = element.id || '';
            elementId.addEventListener('input', (e) => {
                element.id = e.target.value;
                this.markDirty();
            });
        }

        // Element Classes
        const elementClasses = document.getElementById('elementClasses');
        if (elementClasses) {
            elementClasses.value = element.className || '';
            elementClasses.addEventListener('input', (e) => {
                element.className = e.target.value;
                this.markDirty();
            });
        }

        // Custom CSS
        const customCSS = document.getElementById('customCSS');
        if (customCSS) {
            customCSS.value = element.getAttribute('style') || '';
            customCSS.addEventListener('input', (e) => {
                element.setAttribute('style', e.target.value);
                this.markDirty();
            });
        }

        // Sliders
        this.setupEffectSliders();
    },

    // Setup effect sliders
    setupEffectSliders() {
        const sliders = [
            { id: 'opacitySlider', style: 'opacity', min: 0, max: 100, suffix: '%', divisor: 100 },
            { id: 'blurSlider', style: 'filter', prefix: 'blur(', suffix: 'px)', min: 0, max: 20 },
            { id: 'brightnessSlider', style: 'filter', prefix: 'brightness(', suffix: '%)', min: 0, max: 200 },
            { id: 'contrastSlider', style: 'filter', prefix: 'contrast(', suffix: '%)', min: 0, max: 200 },
            { id: 'saturationSlider', style: 'filter', prefix: 'saturate(', suffix: '%)', min: 0, max: 200 },
            { id: 'hueSlider', style: 'filter', prefix: 'hue-rotate(', suffix: 'deg)', min: 0, max: 360 },
            { id: 'rotateSlider', style: 'transform', prefix: 'rotate(', suffix: 'deg)', min: -180, max: 180 },
            { id: 'scaleSlider', style: 'transform', prefix: 'scale(', suffix: ')', min: 0, max: 200, divisor: 100 }
        ];

        sliders.forEach(config => {
            const slider = document.getElementById(config.id);
            if (slider && this.selectedElement) {
                slider.addEventListener('input', (e) => {
                    const value = config.divisor ? e.target.value / config.divisor : e.target.value;
                    const displayValue = e.target.value + (config.suffix || '');

                    slider.nextElementSibling.textContent = displayValue;

                    if (config.style === 'filter') {
                        this.selectedElement.style.filter = config.prefix + value + config.suffix;
                    } else if (config.style === 'transform') {
                        this.selectedElement.style.transform = config.prefix + value + config.suffix;
                    } else {
                        this.selectedElement.style[config.style] = value;
                    }

                    this.markDirty();
                });
            }
        });
    },

    // Setup UI
    setupUI() {
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.savePage();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open('../' + this.currentPage, '_blank');
        });

        // Page selector
        document.getElementById('pageSelect').addEventListener('change', (e) => {
            this.loadPage(e.target.value);
        });

        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => {
            EditorHistory.undo();
        });

        document.getElementById('redoBtn').addEventListener('click', () => {
            EditorHistory.redo();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.savePage();
                } else if (e.key === 'z') {
                    e.preventDefault();
                    EditorHistory.undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    EditorHistory.redo();
                }
            }
        });
    },

    // Setup tab switching
    setupTabSwitching() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                const parent = e.currentTarget.closest('.editor-sidebar');

                // Update buttons
                parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // Update content
                parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                parent.querySelector(`[data-content="${tab}"]`).classList.add('active');
            });
        });
    },

    // Setup device selector
    setupDeviceSelector() {
        document.querySelectorAll('[data-device]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.currentTarget.getAttribute('data-device');

                // Update buttons
                document.querySelectorAll('[data-device]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // Update iframe
                this.iframe.setAttribute('data-device', device);
            });
        });
    },

    // Setup color pickers
    setupColorPickers() {
        setTimeout(() => {
            $('.color-picker').spectrum({
                type: "color",
                showInput: true,
                showAlpha: true,
                preferredFormat: "hex",
                change: (color) => {
                    if (this.selectedElement) {
                        const input = event.target;
                        const style = input.getAttribute('data-style');
                        this.selectedElement.style[style] = color.toHexString();
                        this.markDirty();
                    }
                }
            });
        }, 500);
    },

    // Setup auto save
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty) {
                console.log('💾 Auto-saving...');
                this.savePage(true);
            }
        }, 60000); // Every 60 seconds
    },

    // Load page
    loadPage(page) {
        this.showLoading('Loading page...');
        this.currentPage = page;
        this.iframe.src = '../' + page;
        setTimeout(() => this.hideLoading(), 1000);
    },

    // Save page
    savePage(auto = false) {
        if (!this.iframeDoc) {
            this.showNotification('No page loaded', 'error');
            return;
        }

        this.showLoading('Saving page...');

        const html = '<!DOCTYPE html>\n' + this.iframeDoc.documentElement.outerHTML;

        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'save_page',
                page: this.currentPage,
                content: html
            })
        })
        .then(response => response.json())
        .then(data => {
            this.hideLoading();
            if (data.success) {
                this.isDirty = false;
                this.showNotification(auto ? 'Auto-saved' : 'Page saved successfully!', 'success');
            } else {
                this.showNotification('Error: ' + data.error, 'error');
            }
        })
        .catch(error => {
            this.hideLoading();
            this.showNotification('Error saving page', 'error');
            console.error(error);
        });
    },

    // Mark as dirty
    markDirty() {
        this.isDirty = true;
        document.title = '● ' + document.title.replace('● ', '');
    },

    // RGB to Hex
    rgbToHex(rgb) {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#ffffff';
        return "#" + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3]))
            .toString(16).slice(1);
    },

    // Show loading
    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        overlay.querySelector('p').textContent = message;
        overlay.classList.add('active');
    },

    // Hide loading
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    },

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icon = type === 'success' ? 'check-circle' :
                     type === 'error' ? 'exclamation-circle' :
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';

        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Select image from library
    selectImageFromLibrary() {
        openMediaUploader('image', (media) => {
            if (this.selectedElement && this.selectedElement.tagName === 'IMG') {
                this.selectedElement.setAttribute('src', media.url);
                document.getElementById('elementSrc').value = media.url;
                this.markDirty();
            }
        });
    },

    // Select video from library
    selectVideoFromLibrary() {
        openMediaUploader('video', (media) => {
            if (this.selectedElement && this.selectedElement.tagName === 'VIDEO') {
                this.selectedElement.setAttribute('src', media.url);
                document.getElementById('elementSrc').value = media.url;
                this.markDirty();
            }
        });
    }
};

// Global functions
function loadPage(page) {
    NFXEditor.loadPage(page);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    NFXEditor.init();
});

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (NFXEditor.isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});
