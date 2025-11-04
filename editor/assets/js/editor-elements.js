/**
 * Neofox Media Visual Editor - Element System
 * Drag & drop, element creation, and manipulation
 */

const EditorElements = {
    draggedElement: null,
    dropZone: null,

    // Initialize
    init() {
        this.setupDraggableElements();
        this.setupDropZones();
    },

    // Setup draggable elements
    setupDraggableElements() {
        document.querySelectorAll('.element-item[draggable="true"]').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target.getAttribute('data-element');
                e.dataTransfer.effectAllowed = 'copy';
                e.target.style.opacity = '0.5';
            });

            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });
    },

    // Setup drop zones
    setupDropZones() {
        // This will be called after iframe loads
        setTimeout(() => {
            if (!NFXEditor.iframeDoc) return;

            const dropZones = NFXEditor.iframeDoc.querySelectorAll(
                'section, div[class], article, main, header, footer'
            );

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    zone.style.outline = '3px dashed #10b981';
                });

                zone.addEventListener('dragleave', (e) => {
                    zone.style.outline = '';
                });

                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.style.outline = '';

                    if (this.draggedElement) {
                        this.createElement(this.draggedElement, zone);
                        this.draggedElement = null;
                    }
                });
            });
        }, 1500);
    },

    // Create element
    createElement(elementType, parent) {
        if (!NFXEditor.iframeDoc) return;

        let element;

        switch (elementType) {
            case 'heading':
                element = NFXEditor.iframeDoc.createElement('h2');
                element.textContent = 'New Heading';
                element.style.cssText = 'font-size: 2em; font-weight: 700; margin: 20px 0;';
                break;

            case 'text':
                element = NFXEditor.iframeDoc.createElement('p');
                element.textContent = 'This is a new paragraph. Double-click to edit.';
                element.style.cssText = 'margin: 15px 0; line-height: 1.6;';
                break;

            case 'image':
                element = NFXEditor.iframeDoc.createElement('img');
                element.setAttribute('src', 'https://via.placeholder.com/800x400?text=Click+to+Change');
                element.setAttribute('alt', 'New Image');
                element.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 20px 0;';
                break;

            case 'video':
                element = NFXEditor.iframeDoc.createElement('video');
                element.setAttribute('controls', 'controls');
                element.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 20px 0;';
                break;

            case 'button':
                element = NFXEditor.iframeDoc.createElement('button');
                element.textContent = 'Click Me';
                element.style.cssText = 'padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; margin: 20px 0;';
                break;

            case 'divider':
                element = NFXEditor.iframeDoc.createElement('hr');
                element.style.cssText = 'border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;';
                break;

            case 'spacer':
                element = NFXEditor.iframeDoc.createElement('div');
                element.style.cssText = 'height: 50px;';
                element.setAttribute('data-nfx-spacer', 'true');
                break;

            case 'section':
                element = NFXEditor.iframeDoc.createElement('section');
                element.innerHTML = '<div style="padding: 60px 20px; text-align: center;"><h2>New Section</h2><p>Add your content here</p></div>';
                element.style.cssText = 'margin: 40px 0; background: #f9fafb;';
                break;

            case 'container':
                element = NFXEditor.iframeDoc.createElement('div');
                element.className = 'nfx-container';
                element.innerHTML = '<p>Container - Add content here</p>';
                element.style.cssText = 'max-width: 1200px; margin: 0 auto; padding: 20px; border: 2px dashed #e5e7eb;';
                break;

            case 'columns':
                element = NFXEditor.iframeDoc.createElement('div');
                element.className = 'nfx-columns';
                element.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin: 30px 0;">
                        <div style="padding: 30px; background: #f9fafb; border-radius: 8px;">
                            <h3>Column 1</h3>
                            <p>Add content here</p>
                        </div>
                        <div style="padding: 30px; background: #f9fafb; border-radius: 8px;">
                            <h3>Column 2</h3>
                            <p>Add content here</p>
                        </div>
                    </div>
                `;
                break;

            case 'grid':
                element = NFXEditor.iframeDoc.createElement('div');
                element.className = 'nfx-grid';
                element.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
                        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">Item 1</div>
                        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">Item 2</div>
                        <div style="padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">Item 3</div>
                    </div>
                `;
                break;

            case 'tabs':
                element = this.createTabsElement();
                break;

            case 'accordion':
                element = this.createAccordionElement();
                break;

            case 'slider':
                element = this.createSliderElement();
                break;

            case 'gallery':
                element = this.createGalleryElement();
                break;

            case 'carousel':
                element = this.createCarouselElement();
                break;

            case 'form':
                element = this.createFormElement();
                break;

            case 'icon':
                element = NFXEditor.iframeDoc.createElement('i');
                element.className = 'fas fa-star';
                element.style.cssText = 'font-size: 48px; color: #667eea; margin: 20px;';
                break;

            case 'social':
                element = this.createSocialIconsElement();
                break;

            case 'embed':
                element = NFXEditor.iframeDoc.createElement('div');
                element.className = 'nfx-embed';
                element.innerHTML = '<p style="padding: 40px; background: #f9fafb; text-align: center;">Embed Code Container<br><small>Select and add your embed code in the content panel</small></p>';
                break;

            case 'countdown':
                element = this.createCountdownElement();
                break;

            default:
                NFXEditor.showNotification('Element type not implemented yet', 'warning');
                return;
        }

        // Make element editable
        element.setAttribute('data-nfx-editable', 'true');
        element.style.cursor = 'pointer';

        // Add event listeners
        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            NFXEditor.selectElement(element);
        });

        element.addEventListener('mouseenter', (e) => {
            if (element !== NFXEditor.selectedElement) {
                element.style.outline = '2px dashed #667eea';
                element.style.outlineOffset = '2px';
            }
        });

        element.addEventListener('mouseleave', (e) => {
            if (element !== NFXEditor.selectedElement) {
                element.style.outline = '';
                element.style.outlineOffset = '';
            }
        });

        // Add to parent
        parent.appendChild(element);

        // Select the new element
        NFXEditor.selectElement(element);
        NFXEditor.markDirty();
        NFXEditor.showNotification(`${elementType} element added`, 'success');
    },

    // Create tabs element
    createTabsElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-tabs';
        element.innerHTML = `
            <div style="margin: 30px 0;">
                <div style="display: flex; gap: 5px; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px;">
                    <button style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px 6px 0 0; cursor: pointer; font-weight: 600;">Tab 1</button>
                    <button style="padding: 12px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">Tab 2</button>
                    <button style="padding: 12px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px 6px 0 0; cursor: pointer;">Tab 3</button>
                </div>
                <div style="padding: 20px; background: #f9fafb; border-radius: 0 8px 8px 8px;">
                    <h3>Tab Content</h3>
                    <p>This is the content for the active tab. You can add any content here.</p>
                </div>
            </div>
        `;
        return element;
    },

    // Create accordion element
    createAccordionElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-accordion';
        element.innerHTML = `
            <div style="margin: 30px 0;">
                <div style="margin-bottom: 10px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <button style="width: 100%; padding: 15px 20px; background: #f9fafb; border: none; text-align: left; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>Accordion Item 1</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div style="padding: 20px; background: white; display: none;">Content for accordion item 1</div>
                </div>
                <div style="margin-bottom: 10px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <button style="width: 100%; padding: 15px 20px; background: #f9fafb; border: none; text-align: left; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>Accordion Item 2</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div style="padding: 20px; background: white; display: none;">Content for accordion item 2</div>
                </div>
            </div>
        `;
        return element;
    },

    // Create slider element
    createSliderElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-slider';
        element.innerHTML = `
            <div style="margin: 30px 0; position: relative; background: #f9fafb; border-radius: 12px; overflow: hidden;">
                <div style="padding: 80px 40px; text-align: center;">
                    <h2 style="font-size: 2.5em; margin-bottom: 20px;">Slide 1</h2>
                    <p style="font-size: 1.2em; color: #6b7280;">Add your slider content here</p>
                </div>
                <button style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; background: white; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; border-radius: 50%; background: white; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        return element;
    },

    // Create gallery element
    createGalleryElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-gallery';
        element.innerHTML = `
            <div style="margin: 30px 0;">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    <div style="aspect-ratio: 1; background: #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <img src="https://via.placeholder.com/400" style="width: 100%; height: 100%; object-fit: cover;" alt="Gallery Image 1">
                    </div>
                    <div style="aspect-ratio: 1; background: #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <img src="https://via.placeholder.com/400" style="width: 100%; height: 100%; object-fit: cover;" alt="Gallery Image 2">
                    </div>
                    <div style="aspect-ratio: 1; background: #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <img src="https://via.placeholder.com/400" style="width: 100%; height: 100%; object-fit: cover;" alt="Gallery Image 3">
                    </div>
                    <div style="aspect-ratio: 1; background: #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <img src="https://via.placeholder.com/400" style="width: 100%; height: 100%; object-fit: cover;" alt="Gallery Image 4">
                    </div>
                </div>
            </div>
        `;
        return element;
    },

    // Create carousel element
    createCarouselElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-carousel';
        element.innerHTML = `
            <div style="margin: 30px 0; overflow: hidden; border-radius: 12px;">
                <div style="display: flex; transition: transform 0.3s ease;">
                    <div style="min-width: 100%; padding: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
                        <h2 style="font-size: 2.5em; margin-bottom: 20px;">Carousel Item 1</h2>
                        <p style="font-size: 1.2em;">Add your content here</p>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 8px; margin-top: 15px;">
                    <button style="width: 12px; height: 12px; border-radius: 50%; background: #667eea; border: none; cursor: pointer;"></button>
                    <button style="width: 12px; height: 12px; border-radius: 50%; background: #e5e7eb; border: none; cursor: pointer;"></button>
                    <button style="width: 12px; height: 12px; border-radius: 50%; background: #e5e7eb; border: none; cursor: pointer;"></button>
                </div>
            </div>
        `;
        return element;
    },

    // Create form element
    createFormElement() {
        const element = NFXEditor.iframeDoc.createElement('form');
        element.className = 'nfx-form';
        element.innerHTML = `
            <div style="margin: 30px 0; max-width: 600px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">Name</label>
                    <input type="text" placeholder="Enter your name" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">Email</label>
                    <input type="email" placeholder="Enter your email" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px;">Message</label>
                    <textarea rows="4" placeholder="Enter your message" style="width: 100%; padding: 12px 15px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                </div>
                <button type="submit" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">Submit</button>
            </div>
        `;
        return element;
    },

    // Create social icons element
    createSocialIconsElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-social-icons';
        element.innerHTML = `
            <div style="margin: 30px 0; display: flex; gap: 15px; justify-content: center;">
                <a href="#" style="width: 50px; height: 50px; border-radius: 50%; background: #1877f2; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none;">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" style="width: 50px; height: 50px; border-radius: 50%; background: #1da1f2; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none;">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="#" style="width: 50px; height: 50px; border-radius: 50%; background: #e4405f; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none;">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="#" style="width: 50px; height: 50px; border-radius: 50%; background: #0077b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none;">
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
        `;
        return element;
    },

    // Create countdown element
    createCountdownElement() {
        const element = NFXEditor.iframeDoc.createElement('div');
        element.className = 'nfx-countdown';
        element.innerHTML = `
            <div style="margin: 30px 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.2); padding: 20px 30px; border-radius: 8px; min-width: 100px;">
                        <div style="font-size: 3em; font-weight: 700; color: white;">10</div>
                        <div style="font-size: 0.9em; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Days</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 20px 30px; border-radius: 8px; min-width: 100px;">
                        <div style="font-size: 3em; font-weight: 700; color: white;">05</div>
                        <div style="font-size: 0.9em; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Hours</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 20px 30px; border-radius: 8px; min-width: 100px;">
                        <div style="font-size: 3em; font-weight: 700; color: white;">30</div>
                        <div style="font-size: 0.9em; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Minutes</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 20px 30px; border-radius: 8px; min-width: 100px;">
                        <div style="font-size: 3em; font-weight: 700; color: white;">45</div>
                        <div style="font-size: 0.9em; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Seconds</div>
                    </div>
                </div>
            </div>
        `;
        return element;
    },

    // Duplicate element
    duplicateElement() {
        if (!NFXEditor.selectedElement) {
            NFXEditor.showNotification('Please select an element first', 'warning');
            return;
        }

        const clone = NFXEditor.selectedElement.cloneNode(true);
        NFXEditor.selectedElement.parentNode.insertBefore(clone, NFXEditor.selectedElement.nextSibling);

        // Re-setup event listeners
        clone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            NFXEditor.selectElement(clone);
        });

        NFXEditor.markDirty();
        NFXEditor.showNotification('Element duplicated', 'success');
    },

    // Delete element
    deleteElement() {
        if (!NFXEditor.selectedElement) {
            NFXEditor.showNotification('Please select an element first', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete this element?')) {
            NFXEditor.selectedElement.remove();
            NFXEditor.selectedElement = null;
            NFXEditor.markDirty();
            NFXEditor.showNotification('Element deleted', 'success');
        }
    }
};

// Initialize elements system
document.addEventListener('DOMContentLoaded', () => {
    EditorElements.init();
});
