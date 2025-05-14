const VALID_TYPES = ['success', 'error', 'info', 'warning', 'custom'];
const toastMessages = {
     success: "Operation completed successfully!",
     error: "Critical system error detected!",
     info: "New update available.",
     warning: "Warning: This action cannot be undone.",
     custom: "Custom notification with special styling."
};
const toastTitles = {
     success: "Success!",
     error: "Error!",
     info: "Information",
     warning: "Warning",
     custom: "Custom"
};
const icons = {
     success: '✓',
     error: '✕',
     info: 'ℹ',
     warning: '⚠',
     custom: '✨'
};
let currentPosition = 'top-right'; // Track current position

function ensureContainer() {
     let container = document.getElementById('grand-toast-container');
     if (!container) {
          container = document.createElement('div');
          container.id = 'grand-toast-container';
          document.body.appendChild(container);
     } else if (!container.parentNode && !document.querySelector('.grand-toast[data-is-dismissing="true"]')) {
          document.body.appendChild(container);
     }
     return container;
}

function updateToastPosition(position) {
     const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle'];
     if (!validPositions.includes(position)) {
          console.warn(`Invalid position: ${position}. Defaulting to 'top-right'.`);
          position = 'top-right';
     }
     currentPosition = position; // Update global position
     const container = ensureContainer();
     container.classList.remove(...validPositions);
     container.classList.add('grand-toast-container', position);
     // Reset inline transforms on existing toasts
     document.querySelectorAll('.grand-toast').forEach(toast => {
          toast.style.transform = 'none';
     });
}

function showToast(options = {}) {
     try {
          const validEntranceAnims = ['slide', 'bounce', 'fade'];
          const validExitAnims = ['melt', 'pixel', 'hologram'];
          const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle'];

          const type = (options.type && VALID_TYPES.includes(options.type)) ? options.type : 'success';
          const entranceAnim = (options.entranceAnim && validEntranceAnims.includes(options.entranceAnim)) ? options.entranceAnim : 'slide';
          const exitAnim = (options.exitAnim && validExitAnims.includes(options.exitAnim)) ? options.exitAnim : 'melt';
          const position = (options.position && validPositions.includes(options.position)) ? options.position : currentPosition;
          const duration = typeof options.duration === 'number' && options.duration > 0 ? options.duration : 3000;
          const closable = typeof options.closable === 'boolean' ? options.closable : true;
          const textColor = typeof options.color === 'string' ? options.color : '';
          const speed = typeof options.speed === 'number' && options.speed > 0 ? options.speed : 600;
          const showProgress = typeof options.showProgress === 'boolean' ? options.showProgress : true;

          const container = ensureContainer();
          container.classList.remove(...validPositions);
          container.classList.add('grand-toast-container', position);
          const toast = document.createElement('div');

          // Apply base styles and classes
          toast.className = `grand-toast ${type}`;
          toast.setAttribute('role', 'alert');
          toast.setAttribute('aria-live', 'assertive');
          toast.setAttribute('aria-atomic', 'true');
          toast.dataset.exitAnim = exitAnim; // Store exitAnim for dismissal

          // Set initial styles for entrance animation
          toast.style.opacity = '0';
          if (entranceAnim === 'slide') {
               toast.style.transform = 'translateX(120%) rotate(5deg)';
          } else if (entranceAnim === 'bounce') {
               toast.style.transform = 'translateY(100px) scale(0.8)';
          } else {
               toast.style.transform = 'scale(0.95)';
          }

          if (options.background) toast.style.background = options.background;
          if (textColor) toast.style.color = textColor;

          // Build toast content
          const icon = document.createElement('div');
          icon.className = 'grand-toast-icon';
          icon.innerHTML = options.icon || icons[type] || icons.custom;
          toast.appendChild(icon);

          const content = document.createElement('div');
          content.className = 'grand-toast-content';

          if (options.title) {
               const titleElement = document.createElement('h3');
               titleElement.className = 'grand-toast-title';
               titleElement.textContent = options.title;
               content.appendChild(titleElement);
          }

          const message = document.createElement('p');
          message.className = 'grand-toast-message';
          message.textContent = options.message || toastMessages[type] || toastMessages.custom;
          if (textColor) message.style.color = textColor;
          content.appendChild(message);

          toast.appendChild(content);

          if (closable) {
               const closeBtn = document.createElement('button');
               closeBtn.className = 'grand-toast-close';
               closeBtn.setAttribute('aria-label', 'Close notification');
               closeBtn.innerHTML = '×';
               closeBtn.addEventListener('click', () => dismissToast(toast, toast.dataset.exitAnim, 200));
               toast.appendChild(closeBtn);
          }

          let progress = null;
          if (showProgress) {
               progress = document.createElement('progress');
               progress.className = 'grand-toast-progress';
               progress.setAttribute('aria-hidden', 'true');
               progress.style.transform = 'scaleX(1)';
               toast.appendChild(progress);
          }

          // Append toast to DOM
          container.appendChild(toast);

          // Apply entrance animation in next frame
          requestAnimationFrame(() => {
               const animDuration = `${speed / 1000}s`;
               switch (entranceAnim) {
                    case 'bounce':
                         toast.style.animation = `grandEntranceBounce ${animDuration} cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
                         break;
                    case 'fade':
                         toast.style.animation = `grandEntranceFade ${animDuration} ease-out forwards`;
                         break;
                    default:
                         toast.style.animation = `grandEntranceSlide ${animDuration} cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;
               }
          });

          // Progress bar and pause-on-hover logic
          let startTime = Date.now();
          let totalPausedDuration = 0;
          let pauseStartTime = 0;
          let isPaused = false;
          let animationFrame;

          const updateProgress = (timestamp) => {
               if (isPaused) return;

               const elapsed = Date.now() - startTime - totalPausedDuration;
               const progressFraction = Math.max(0, 1 - (elapsed / duration));

               if (progress) {
                    progress.style.transform = `scaleX(${progressFraction})`;
               }

               if (elapsed >= duration) {
                    dismissToast(toast, toast.dataset.exitAnim, speed);
                    return;
               }

               animationFrame = requestAnimationFrame(updateProgress);
               toast.dataset.animationFrame = String(animationFrame);
          };

          animationFrame = requestAnimationFrame(updateProgress);
          toast.dataset.animationFrame = String(animationFrame);

          const pauseHandler = () => {
               isPaused = true;
               cancelAnimationFrame(animationFrame);
               pauseStartTime = Date.now();
          };

          const resumeHandler = () => {
               if (!isPaused) return;
               totalPausedDuration += Date.now() - pauseStartTime;
               isPaused = false;
               animationFrame = requestAnimationFrame(updateProgress);
          };

          toast.addEventListener('mouseenter', pauseHandler);
          toast.addEventListener('mouseleave', resumeHandler);

          // Store handlers for cleanup
          toast.dataset.handlers = JSON.stringify({ pauseHandler, resumeHandler });
     } catch (error) {
          console.error('Failed to show toast:', error);
     }
}

function dismissToast(toast, exitAnim = 'melt', speed = 1000) {
     if (toast.dataset.isDismissing) return;

     // Clean up animation frame and event listeners
     if (toast.dataset.animationFrame) {
          cancelAnimationFrame(Number(toast.dataset.animationFrame));
          delete toast.dataset.animationFrame;
     }
     if (toast.dataset.handlers) {
          const { pauseHandler, resumeHandler } = JSON.parse(toast.dataset.handlers);
          toast.removeEventListener('mouseenter', pauseHandler);
          toast.removeEventListener('mouseleave', resumeHandler);
          delete toast.dataset.handlers;
     }

     const progress = toast.querySelector('.grand-toast-progress');
     if (progress) {
          progress.style.transform = progress.style.transform; // Freeze current transform
     }

     // Apply exit animation in next frame
     requestAnimationFrame(() => {
          toast.style.animation = 'none'; // Clear entrance animation
          toast.dataset.isDismissing = 'true'; // Set after animation
          toast.classList.add('dismissing'); // Add dismissal class
          toast.style.pointerEvents = 'none'; // Prevent hover events
          const exitDuration = `${speed / 1000}s`;
          exitAnim = toast.dataset.exitAnim || exitAnim; // Use stored exitAnim

          switch (exitAnim) {
               case 'pixel':
                    toast.style.animation = `pixelDissolve ${exitDuration} ease-out forwards`;
                    break;
               case 'hologram':
                    toast.style.animation = `hologramFlicker ${exitDuration} linear forwards`;
                    break;
               default:
                    toast.style.animation = `meltAway ${exitDuration} cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards`;
          }
     });

     const removeToast = () => {
          if (toast && toast.parentNode) {
               toast.parentNode.removeChild(toast);
          }
     };

     toast.addEventListener('animationend', removeToast, { once: true });
     setTimeout(removeToast, speed + 100); // Fallback removal
}

// Initialize container on script load
ensureContainer();