/**
 * Neofox Media Visual Editor - Animation System
 * Advanced animation and effects controller
 */

const EditorAnimations = {
    // Animation library
    animations: {
        // Fade animations
        fadeIn: {
            name: 'Fade In',
            keyframes: {
                from: { opacity: 0 },
                to: { opacity: 1 }
            }
        },
        fadeInUp: {
            name: 'Fade In Up',
            keyframes: {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            }
        },
        fadeInDown: {
            name: 'Fade In Down',
            keyframes: {
                from: { opacity: 0, transform: 'translateY(-30px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            }
        },
        fadeInLeft: {
            name: 'Fade In Left',
            keyframes: {
                from: { opacity: 0, transform: 'translateX(-30px)' },
                to: { opacity: 1, transform: 'translateX(0)' }
            }
        },
        fadeInRight: {
            name: 'Fade In Right',
            keyframes: {
                from: { opacity: 0, transform: 'translateX(30px)' },
                to: { opacity: 1, transform: 'translateX(0)' }
            }
        },

        // Zoom animations
        zoomIn: {
            name: 'Zoom In',
            keyframes: {
                from: { opacity: 0, transform: 'scale(0.5)' },
                to: { opacity: 1, transform: 'scale(1)' }
            }
        },
        zoomOut: {
            name: 'Zoom Out',
            keyframes: {
                from: { opacity: 0, transform: 'scale(1.5)' },
                to: { opacity: 1, transform: 'scale(1)' }
            }
        },

        // Slide animations
        slideInUp: {
            name: 'Slide In Up',
            keyframes: {
                from: { transform: 'translateY(100%)' },
                to: { transform: 'translateY(0)' }
            }
        },
        slideInDown: {
            name: 'Slide In Down',
            keyframes: {
                from: { transform: 'translateY(-100%)' },
                to: { transform: 'translateY(0)' }
            }
        },
        slideInLeft: {
            name: 'Slide In Left',
            keyframes: {
                from: { transform: 'translateX(-100%)' },
                to: { transform: 'translateX(0)' }
            }
        },
        slideInRight: {
            name: 'Slide In Right',
            keyframes: {
                from: { transform: 'translateX(100%)' },
                to: { transform: 'translateX(0)' }
            }
        },

        // Special animations
        bounceIn: {
            name: 'Bounce In',
            keyframes: {
                '0%': { opacity: 0, transform: 'scale(0.3)' },
                '50%': { opacity: 1, transform: 'scale(1.05)' },
                '70%': { transform: 'scale(0.9)' },
                '100%': { transform: 'scale(1)' }
            }
        },
        rotateIn: {
            name: 'Rotate In',
            keyframes: {
                from: { opacity: 0, transform: 'rotate(-200deg)' },
                to: { opacity: 1, transform: 'rotate(0)' }
            }
        },
        flipInX: {
            name: 'Flip In X',
            keyframes: {
                from: { opacity: 0, transform: 'perspective(400px) rotateX(90deg)' },
                to: { opacity: 1, transform: 'perspective(400px) rotateX(0)' }
            }
        },
        flipInY: {
            name: 'Flip In Y',
            keyframes: {
                from: { opacity: 0, transform: 'perspective(400px) rotateY(90deg)' },
                to: { opacity: 1, transform: 'perspective(400px) rotateY(0)' }
            }
        }
    },

    // Hover animations
    hoverAnimations: {
        pulse: {
            name: 'Pulse',
            css: `
                @keyframes nfx-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `,
            class: 'nfx-hover-pulse',
            style: 'animation: nfx-pulse 0.5s ease-in-out;'
        },
        bounce: {
            name: 'Bounce',
            css: `
                @keyframes nfx-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `,
            class: 'nfx-hover-bounce',
            style: 'animation: nfx-bounce 0.5s ease-in-out;'
        },
        shake: {
            name: 'Shake',
            css: `
                @keyframes nfx-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `,
            class: 'nfx-hover-shake',
            style: 'animation: nfx-shake 0.5s ease-in-out;'
        },
        swing: {
            name: 'Swing',
            css: `
                @keyframes nfx-swing {
                    20% { transform: rotate(15deg); }
                    40% { transform: rotate(-10deg); }
                    60% { transform: rotate(5deg); }
                    80% { transform: rotate(-5deg); }
                    100% { transform: rotate(0deg); }
                }
            `,
            class: 'nfx-hover-swing',
            style: 'animation: nfx-swing 0.8s ease-in-out;'
        },
        wobble: {
            name: 'Wobble',
            css: `
                @keyframes nfx-wobble {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-10px) rotate(-5deg); }
                    30% { transform: translateX(8px) rotate(3deg); }
                    45% { transform: translateX(-6px) rotate(-3deg); }
                    60% { transform: translateX(4px) rotate(2deg); }
                    75% { transform: translateX(-2px) rotate(-1deg); }
                }
            `,
            class: 'nfx-hover-wobble',
            style: 'animation: nfx-wobble 0.8s ease-in-out;'
        },
        grow: {
            name: 'Grow',
            css: ``,
            class: 'nfx-hover-grow',
            style: 'transform: scale(1.1); transition: transform 0.3s ease;'
        },
        shrink: {
            name: 'Shrink',
            css: ``,
            class: 'nfx-hover-shrink',
            style: 'transform: scale(0.9); transition: transform 0.3s ease;'
        },
        float: {
            name: 'Float',
            css: ``,
            class: 'nfx-hover-float',
            style: 'transform: translateY(-5px); transition: transform 0.3s ease;'
        },
        sink: {
            name: 'Sink',
            css: ``,
            class: 'nfx-hover-sink',
            style: 'transform: translateY(5px); transition: transform 0.3s ease;'
        },
        glow: {
            name: 'Glow',
            css: ``,
            class: 'nfx-hover-glow',
            style: 'box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); transition: box-shadow 0.3s ease;'
        }
    },

    // Initialize
    init() {
        this.setupAnimationControls();
        this.injectAnimationStyles();
    },

    // Setup animation controls
    setupAnimationControls() {
        // Entrance animation
        const entranceAnimation = document.getElementById('entranceAnimation');
        if (entranceAnimation) {
            entranceAnimation.addEventListener('change', (e) => {
                this.applyEntranceAnimation(e.target.value);
            });
        }

        // Animation duration
        const animationDuration = document.getElementById('animationDuration');
        if (animationDuration) {
            animationDuration.addEventListener('input', (e) => {
                this.updateAnimationDuration(e.target.value);
            });
        }

        // Animation delay
        const animationDelay = document.getElementById('animationDelay');
        if (animationDelay) {
            animationDelay.addEventListener('input', (e) => {
                this.updateAnimationDelay(e.target.value);
            });
        }

        // Hover animation
        const hoverAnimation = document.getElementById('hoverAnimation');
        if (hoverAnimation) {
            hoverAnimation.addEventListener('change', (e) => {
                this.applyHoverAnimation(e.target.value);
            });
        }
    },

    // Apply entrance animation
    applyEntranceAnimation(animationName) {
        if (!NFXEditor.selectedElement || !animationName) return;

        const element = NFXEditor.selectedElement;
        const animation = this.animations[animationName];

        if (!animation) return;

        // Generate unique animation name
        const uniqueName = 'nfx-anim-' + Date.now();

        // Create keyframes
        const keyframesRule = this.generateKeyframes(uniqueName, animation.keyframes);

        // Inject into iframe
        this.injectKeyframes(keyframesRule);

        // Apply animation
        const duration = document.getElementById('animationDuration').value || 600;
        const delay = document.getElementById('animationDelay').value || 0;

        element.style.animation = `${uniqueName} ${duration}ms ease-out ${delay}ms both`;
        element.setAttribute('data-nfx-animation', animationName);
        element.setAttribute('data-nfx-animation-duration', duration);
        element.setAttribute('data-nfx-animation-delay', delay);

        NFXEditor.markDirty();
        NFXEditor.showNotification(`Applied ${animation.name} animation`, 'success');
    },

    // Update animation duration
    updateAnimationDuration(duration) {
        if (!NFXEditor.selectedElement) return;

        const element = NFXEditor.selectedElement;
        const animationName = element.getAttribute('data-nfx-animation');

        if (animationName) {
            const delay = element.getAttribute('data-nfx-animation-delay') || 0;
            const uniqueName = element.style.animation.split(' ')[0];
            element.style.animation = `${uniqueName} ${duration}ms ease-out ${delay}ms both`;
            element.setAttribute('data-nfx-animation-duration', duration);
            NFXEditor.markDirty();
        }
    },

    // Update animation delay
    updateAnimationDelay(delay) {
        if (!NFXEditor.selectedElement) return;

        const element = NFXEditor.selectedElement;
        const animationName = element.getAttribute('data-nfx-animation');

        if (animationName) {
            const duration = element.getAttribute('data-nfx-animation-duration') || 600;
            const uniqueName = element.style.animation.split(' ')[0];
            element.style.animation = `${uniqueName} ${duration}ms ease-out ${delay}ms both`;
            element.setAttribute('data-nfx-animation-delay', delay);
            NFXEditor.markDirty();
        }
    },

    // Apply hover animation
    applyHoverAnimation(animationName) {
        if (!NFXEditor.selectedElement || !animationName) {
            // Remove existing hover animation
            if (NFXEditor.selectedElement) {
                this.removeHoverAnimation(NFXEditor.selectedElement);
            }
            return;
        }

        const element = NFXEditor.selectedElement;
        const animation = this.hoverAnimations[animationName];

        if (!animation) return;

        // Remove existing hover animation
        this.removeHoverAnimation(element);

        // Add new hover animation
        const hoverClass = animation.class;
        element.setAttribute('data-nfx-hover', animationName);

        // Add event listeners
        element.addEventListener('mouseenter', function() {
            this.style.cssText += animation.style;
        });

        element.addEventListener('mouseleave', function() {
            // Reset styles
            const currentStyle = this.getAttribute('style') || '';
            const cleanStyle = currentStyle.replace(animation.style, '');
            this.setAttribute('style', cleanStyle);
        });

        NFXEditor.markDirty();
        NFXEditor.showNotification(`Applied ${animation.name} hover effect`, 'success');
    },

    // Remove hover animation
    removeHoverAnimation(element) {
        const existingHover = element.getAttribute('data-nfx-hover');
        if (existingHover) {
            element.removeAttribute('data-nfx-hover');
            // Clone and replace to remove event listeners
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            NFXEditor.selectedElement = newElement;
        }
    },

    // Generate keyframes CSS
    generateKeyframes(name, keyframes) {
        let css = `@keyframes ${name} {\n`;

        for (const [key, value] of Object.entries(keyframes)) {
            css += `  ${key} {\n`;
            for (const [prop, val] of Object.entries(value)) {
                css += `    ${this.camelToKebab(prop)}: ${val};\n`;
            }
            css += `  }\n`;
        }

        css += `}`;
        return css;
    },

    // Inject keyframes into iframe
    injectKeyframes(css) {
        const iframeDoc = NFXEditor.iframeDoc;
        if (!iframeDoc) return;

        let styleElement = iframeDoc.getElementById('nfx-animations');
        if (!styleElement) {
            styleElement = iframeDoc.createElement('style');
            styleElement.id = 'nfx-animations';
            iframeDoc.head.appendChild(styleElement);
        }

        styleElement.textContent += '\n' + css;
    },

    // Inject animation styles
    injectAnimationStyles() {
        // This will be called after iframe loads
        setTimeout(() => {
            const iframeDoc = NFXEditor.iframeDoc;
            if (!iframeDoc) return;

            let css = '/* Neofox Media Editor - Animation Styles */\n\n';

            // Add all hover animation keyframes
            for (const [name, animation] of Object.entries(this.hoverAnimations)) {
                if (animation.css) {
                    css += animation.css + '\n\n';
                }
            }

            // Add scroll reveal styles
            css += `
            .nfx-scroll-reveal {
                opacity: 0;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .nfx-scroll-reveal.revealed {
                opacity: 1;
                transform: translateY(0) !important;
            }
            `;

            this.injectKeyframes(css);
        }, 1000);
    },

    // Camel case to kebab case
    camelToKebab(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    },

    // Enable scroll animations
    enableScrollAnimations() {
        const iframeDoc = NFXEditor.iframeDoc;
        if (!iframeDoc) return;

        const elements = iframeDoc.querySelectorAll('[data-nfx-animation]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = entry.target.getAttribute('data-nfx-animation-style');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => {
            element.setAttribute('data-nfx-animation-style', element.style.animation);
            element.style.opacity = '0';
            observer.observe(element);
        });
    },

    // Preview animation
    previewAnimation(animationName) {
        if (!NFXEditor.selectedElement) {
            NFXEditor.showNotification('Please select an element first', 'warning');
            return;
        }

        const element = NFXEditor.selectedElement;
        const originalAnimation = element.style.animation;

        // Apply animation
        this.applyEntranceAnimation(animationName);

        // Reset after animation
        setTimeout(() => {
            element.style.animation = originalAnimation;
        }, 1000);
    }
};

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    EditorAnimations.init();
});
