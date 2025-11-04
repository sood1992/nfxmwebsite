/**
 * Neofox Media Visual Editor - History System
 * Undo/Redo functionality with state management
 */

const EditorHistory = {
    history: [],
    currentIndex: -1,
    maxHistory: 50,
    isRestoring: false,

    // Initialize
    init() {
        this.captureState('Initial state');
    },

    // Capture current state
    captureState(description = 'Change') {
        if (this.isRestoring) return;

        if (!NFXEditor.iframeDoc) return;

        const state = {
            html: NFXEditor.iframeDoc.documentElement.outerHTML,
            timestamp: Date.now(),
            description: description
        };

        // Remove states after current index
        this.history = this.history.slice(0, this.currentIndex + 1);

        // Add new state
        this.history.push(state);
        this.currentIndex++;

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }

        this.updateButtons();
        console.log('📝 State captured:', description);
    },

    // Undo
    undo() {
        if (this.currentIndex <= 0) {
            NFXEditor.showNotification('Nothing to undo', 'info');
            return;
        }

        this.currentIndex--;
        this.restoreState(this.history[this.currentIndex]);
        NFXEditor.showNotification('Undo: ' + this.history[this.currentIndex].description, 'success');
    },

    // Redo
    redo() {
        if (this.currentIndex >= this.history.length - 1) {
            NFXEditor.showNotification('Nothing to redo', 'info');
            return;
        }

        this.currentIndex++;
        this.restoreState(this.history[this.currentIndex]);
        NFXEditor.showNotification('Redo: ' + this.history[this.currentIndex].description, 'success');
    },

    // Restore state
    restoreState(state) {
        if (!NFXEditor.iframeDoc) return;

        this.isRestoring = true;

        // Save scroll position
        const scrollX = NFXEditor.iframeDoc.defaultView.scrollX;
        const scrollY = NFXEditor.iframeDoc.defaultView.scrollY;

        // Restore HTML
        NFXEditor.iframeDoc.documentElement.innerHTML = state.html.replace(/^<!DOCTYPE html>/, '').replace(/<html[^>]*>|<\/html>/gi, '');

        // Restore scroll position
        setTimeout(() => {
            NFXEditor.iframeDoc.defaultView.scrollTo(scrollX, scrollY);
        }, 50);

        // Re-setup editor
        NFXEditor.makeElementsSelectable();
        NFXEditor.makeElementsEditable();
        NFXEditor.addEditorStyles();

        this.isRestoring = false;
        this.updateButtons();
        NFXEditor.markDirty();
    },

    // Update undo/redo buttons
    updateButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');

        if (undoBtn) {
            undoBtn.disabled = this.currentIndex <= 0;
            undoBtn.style.opacity = this.currentIndex <= 0 ? '0.5' : '1';
        }

        if (redoBtn) {
            redoBtn.disabled = this.currentIndex >= this.history.length - 1;
            redoBtn.style.opacity = this.currentIndex >= this.history.length - 1 ? '0.5' : '1';
        }
    },

    // Clear history
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.updateButtons();
    },

    // Get history info
    getInfo() {
        return {
            total: this.history.length,
            current: this.currentIndex,
            canUndo: this.currentIndex > 0,
            canRedo: this.currentIndex < this.history.length - 1
        };
    }
};

// Auto-capture state on significant changes
let captureTimeout;
function scheduleStateCapture(description) {
    clearTimeout(captureTimeout);
    captureTimeout = setTimeout(() => {
        EditorHistory.captureState(description);
    }, 1000); // Capture after 1 second of inactivity
}

// Initialize history
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        EditorHistory.init();
    }, 2000);
});
