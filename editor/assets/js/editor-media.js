/**
 * Neofox Media Visual Editor - Media Management
 * File upload, media library, and asset management
 */

const EditorMedia = {
    mediaLibrary: [],
    currentCallback: null,
    currentFilter: null,

    // Initialize
    init() {
        this.setupUploadZone();
        this.loadMediaLibrary();
    },

    // Setup upload zone
    setupUploadZone() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        if (!uploadZone || !fileInput) return;

        // Click to browse
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#667eea';
            uploadZone.style.background = '#2d2d2d';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#404040';
            uploadZone.style.background = '';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#404040';
            uploadZone.style.background = '';

            const files = e.dataTransfer.files;
            this.uploadFiles(files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            this.uploadFiles(files);
        });
    },

    // Upload files
    async uploadFiles(files) {
        const progressContainer = document.getElementById('uploadProgress');
        progressContainer.innerHTML = '';

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);

            // Create progress item
            const progressItem = this.createProgressItem(files[i].name);
            progressContainer.appendChild(progressItem);
        }

        try {
            const response = await fetch('api.php?action=upload_multiple', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                let successCount = 0;
                data.results.forEach((result, index) => {
                    const progressItem = progressContainer.children[index];

                    if (result.success) {
                        successCount++;
                        this.updateProgressItem(progressItem, 100, 'success');
                        this.mediaLibrary.push(result);
                    } else {
                        this.updateProgressItem(progressItem, 0, 'error', result.error);
                    }
                });

                NFXEditor.showNotification(
                    `Uploaded ${successCount} of ${files.length} files`,
                    successCount === files.length ? 'success' : 'warning'
                );

                // Refresh media library
                this.loadMediaLibrary();

                // Clear after 3 seconds
                setTimeout(() => {
                    progressContainer.innerHTML = '';
                }, 3000);
            } else {
                NFXEditor.showNotification('Upload failed: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            NFXEditor.showNotification('Upload failed', 'error');
        }
    },

    // Create progress item
    createProgressItem(filename) {
        const item = document.createElement('div');
        item.className = 'progress-item';
        item.innerHTML = `
            <div class="progress-item-header">
                <span>${filename}</span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: 0%"></div>
            </div>
        `;
        return item;
    },

    // Update progress item
    updateProgressItem(item, percentage, status, errorMessage = null) {
        const percentageSpan = item.querySelector('.progress-percentage');
        const progressFill = item.querySelector('.progress-bar-fill');

        percentageSpan.textContent = percentage + '%';
        progressFill.style.width = percentage + '%';

        if (status === 'success') {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            percentageSpan.textContent = '✓ Complete';
            percentageSpan.style.color = '#10b981';
        } else if (status === 'error') {
            progressFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
            percentageSpan.textContent = '✗ ' + (errorMessage || 'Error');
            percentageSpan.style.color = '#ef4444';
        }
    },

    // Load media library
    async loadMediaLibrary(filter = null) {
        try {
            const url = filter ?
                `api.php?action=get_media_library&type=${filter}` :
                'api.php?action=get_media_library';

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                this.mediaLibrary = data.media;
                this.renderMediaLibrary();
            }
        } catch (error) {
            console.error('Error loading media library:', error);
        }
    },

    // Render media library
    renderMediaLibrary() {
        const container = document.getElementById('mediaLibrary');
        if (!container) return;

        if (this.mediaLibrary.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                    <i class="fas fa-images" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    <p>No media files yet.<br>Upload some to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        this.mediaLibrary.forEach(media => {
            const item = this.createMediaItem(media);
            container.appendChild(item);
        });
    },

    // Create media item
    createMediaItem(media) {
        const item = document.createElement('div');
        item.className = 'media-item';
        item.setAttribute('data-media-id', media.id);

        const thumbnailUrl = media.thumbnail_path || media.file_path;

        if (media.file_type === 'image') {
            item.innerHTML = `
                <img src="../${thumbnailUrl}" alt="${media.original_filename}" loading="lazy">
                <div class="media-item-overlay">
                    <div class="media-item-actions">
                        <button onclick="EditorMedia.insertMedia(${media.id})" title="Insert">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button onclick="EditorMedia.viewMedia(${media.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="EditorMedia.deleteMedia(${media.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        } else if (media.file_type === 'video') {
            item.innerHTML = `
                <video src="../${media.file_path}" muted></video>
                <div class="media-item-overlay">
                    <div class="media-item-actions">
                        <button onclick="EditorMedia.insertMedia(${media.id})" title="Insert">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button onclick="EditorMedia.deleteMedia(${media.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        return item;
    },

    // Insert media
    insertMedia(mediaId) {
        const media = this.mediaLibrary.find(m => m.id == mediaId);
        if (!media) return;

        if (this.currentCallback) {
            this.currentCallback(media);
            closeModal('mediaUploaderModal');
            return;
        }

        if (!NFXEditor.selectedElement) {
            NFXEditor.showNotification('Please select an element first', 'warning');
            return;
        }

        const element = NFXEditor.selectedElement;
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'img' && media.file_type === 'image') {
            element.setAttribute('src', media.file_path);
            NFXEditor.markDirty();
            NFXEditor.showNotification('Image inserted', 'success');
        } else if (tagName === 'video' && media.file_type === 'video') {
            element.setAttribute('src', media.file_path);
            NFXEditor.markDirty();
            NFXEditor.showNotification('Video inserted', 'success');
        } else {
            NFXEditor.showNotification('Selected element type does not match media type', 'warning');
        }
    },

    // View media
    viewMedia(mediaId) {
        const media = this.mediaLibrary.find(m => m.id == mediaId);
        if (!media) return;

        window.open('../' + media.file_path, '_blank');
    },

    // Delete media
    async deleteMedia(mediaId) {
        if (!confirm('Are you sure you want to delete this media file?')) {
            return;
        }

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'delete_media',
                    id: mediaId
                })
            });

            const data = await response.json();

            if (data.success) {
                NFXEditor.showNotification('Media deleted', 'success');
                this.loadMediaLibrary();
            } else {
                NFXEditor.showNotification('Error: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting media:', error);
            NFXEditor.showNotification('Error deleting media', 'error');
        }
    },

    // Copy media URL
    copyMediaUrl(mediaId) {
        const media = this.mediaLibrary.find(m => m.id == mediaId);
        if (!media) return;

        const url = window.location.origin + '/' + media.file_path;

        navigator.clipboard.writeText(url).then(() => {
            NFXEditor.showNotification('URL copied to clipboard', 'success');
        });
    }
};

// Global functions
function openMediaUploader(type = null, callback = null) {
    EditorMedia.currentFilter = type;
    EditorMedia.currentCallback = callback;

    if (type) {
        EditorMedia.loadMediaLibrary(type);
    }

    document.getElementById('mediaUploaderModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    EditorMedia.currentCallback = null;
}

function openGradientEditor() {
    document.getElementById('gradientEditorModal').classList.add('active');
}

function openShadowEditor() {
    NFXEditor.showNotification('Shadow editor coming soon!', 'info');
}

function selectBackgroundImage() {
    openMediaUploader('image', (media) => {
        if (NFXEditor.selectedElement) {
            NFXEditor.selectedElement.style.backgroundImage = `url(${media.file_path})`;
            NFXEditor.selectedElement.style.backgroundSize = 'cover';
            NFXEditor.selectedElement.style.backgroundPosition = 'center';
            NFXEditor.markDirty();
        }
    });
}

function addColorStop() {
    const colorStops = document.getElementById('colorStops');
    const stop = document.createElement('div');
    stop.className = 'color-stop';
    stop.innerHTML = `
        <input type="text" class="control-input color-picker" value="#667eea">
        <input type="range" min="0" max="100" value="50" class="control-slider">
        <button class="btn btn-icon btn-sm" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    colorStops.appendChild(stop);
}

function applyGradient() {
    if (!NFXEditor.selectedElement) return;

    const type = document.getElementById('gradientType').value;
    const angle = document.getElementById('gradientAngle').value;

    // Get all color stops
    const stops = [];
    document.querySelectorAll('#colorStops .color-stop').forEach(stop => {
        const color = stop.querySelector('input[type="text"]').value;
        const position = stop.querySelector('input[type="range"]').value;
        stops.push(`${color} ${position}%`);
    });

    let gradient;
    if (type === 'linear') {
        gradient = `linear-gradient(${angle}deg, ${stops.join(', ')})`;
    } else {
        gradient = `radial-gradient(circle, ${stops.join(', ')})`;
    }

    NFXEditor.selectedElement.style.backgroundImage = gradient;
    NFXEditor.markDirty();
    closeModal('gradientEditorModal');
    NFXEditor.showNotification('Gradient applied', 'success');
}

// Initialize media system
document.addEventListener('DOMContentLoaded', () => {
    EditorMedia.init();
});
