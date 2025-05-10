import './styles.css';

/** @type {{ [key: string]: string }} */
const toastMessages = {
     success: "Operation completed successfully!",
     error: "Critical system error detected!",
     info: "New update available.",
     warning: "Warning: This action cannot be undone.",
     custom: "Custom notification with special styling."
};

/** @type {{ [key: string]: string }} */
const toastTitles = {
     success: "Success!",
     error: "Error!",
     info: "Information",
     warning: "Warning",
     custom: "Custom"
};

/** @type {{ [key: string]: string }} */
const icons = {
     success: '✓',
     error: '✕',
     info: 'ℹ',
     warning: '⚠',
     custom: '✨'
};

/**
 * Ensures the toast container exists in the DOM
 * @returns {HTMLElement} The toast container element
 */
function ensureContainer() {
     let container = document.getElementById('grand-toast-container');
     if (!container) {
          container = document.createElement('div');
          container.id = 'grand-toast-container';
          document.body.appendChild(container);
     }
     return container;
}

/**
 * Display a toast notification with customizable options
 * @param {import('../types').ToastOptions} [options] - Toast options to customize appearance and behavior
 */
function showToast(options = {}) {
     const validTypes = ['success', 'error', 'info', 'warning', 'custom'];
     const validEntranceAnims = ['slide', 'bounce', 'fade'];
     const validExitAnims = ['melt', 'pixel', 'hologram'];
     const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle'];

     /** @type {'success' | 'error' | 'info' | 'warning' | 'custom'} */
     const type = (options.type && validTypes.includes(options.type)) ? options.type : 'success';
     /** @type {'slide' | 'bounce' | 'fade'} */
     const entranceAnim = (options.entranceAnim && validEntranceAnims.includes(options.entranceAnim)) ? options.entranceAnim : 'slide';
     /** @type {'melt' | 'pixel' | 'hologram'} */
     const exitAnim = (options.exitAnim && validExitAnims.includes(options.exitAnim)) ? options.exitAnim : 'melt';
     /** @type {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'middle'} */
     const position = (options.position && validPositions.includes(options.position)) ? options.position : 'top-right';
     /** @type {number} */
     const duration = typeof options.duration === 'number' && options.duration > 0 ? options.duration : 3000;
     /** @type {boolean} */
     const closable = typeof options.closable === 'boolean' ? options.closable : true;
     /** @type {string} */
     const textColor = typeof options.color === 'string' ? options.color : '';
     /** @type {number} */
     const speed = typeof options.speed === 'number' && options.speed > 0 ? options.speed : 600;
     /** @type {boolean} */
     const showProgress = typeof options.showProgress === 'boolean' ? options.showProgress : true;

     const container = ensureContainer();
     container.className = 'grand-toast-container';
     container.classList.add(position);
     const toast = document.createElement('div');

     toast.className = `grand-toast ${type}`;
     toast.setAttribute('role', 'alert');
     toast.setAttribute('aria-live', 'assertive');
     toast.setAttribute('aria-atomic', 'true');

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

     if (options.background) toast.style.background = options.background;
     if (textColor) toast.style.color = textColor;

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
          closeBtn.onclick = () => dismissToast(toast, exitAnim, speed);
          toast.appendChild(closeBtn);
     }

     /** @type {HTMLDivElement | null} */
     let progress = null;
     if (showProgress) {
          progress = document.createElement('div');
          progress.className = 'grand-toast-progress';
          progress.setAttribute('aria-hidden', 'true');
          progress.style.transform = 'scaleX(1)';
          toast.appendChild(progress);
     }

     container.appendChild(toast);

     let startTime = Date.now();
     let totalPausedDuration = 0;
     let pauseStartTime = 0;
     let isPaused = false;
     /** @type {number} */
     let animationFrame;

     /**
      * Updates the progress bar
      * @param {number} timestamp - The current timestamp
      */
     const updateProgress = (timestamp) => {
          if (isPaused) return;

          const elapsed = Date.now() - startTime - totalPausedDuration;
          const progressFraction = Math.max(0, 1 - (elapsed / duration));

          if (progress) {
               progress.style.transform = `scaleX(${progressFraction})`;
          }

          if (elapsed >= duration) {
               dismissToast(toast, exitAnim, speed);
               return;
          }

          animationFrame = requestAnimationFrame(updateProgress);
     };

     animationFrame = requestAnimationFrame(updateProgress);
     toast.dataset.animationFrame = String(animationFrame);

     toast.addEventListener('mouseenter', () => {
          isPaused = true;
          cancelAnimationFrame(animationFrame);
          pauseStartTime = Date.now();
     });

     toast.addEventListener('mouseleave', () => {
          if (!isPaused) return;
          totalPausedDuration += Date.now() - pauseStartTime;
          isPaused = false;
          animationFrame = requestAnimationFrame(updateProgress);
     });
}

/**
 * Dismisses a toast with animation
 * @param {HTMLElement} toast - The toast element to dismiss
 * @param {'melt' | 'pixel' | 'hologram'} [exitAnim] - Animation used when toast disappears
 * @param {number} [speed] - Animation speed in milliseconds
 */
function dismissToast(toast, exitAnim = 'melt', speed = 600) {
     if (toast.dataset.isDismissing) return;
     toast.dataset.isDismissing = 'true';

     if (toast.dataset.animationFrame) {
          cancelAnimationFrame(Number(toast.dataset.animationFrame));
     }

     /** @type {HTMLElement | null} */
     const progress = toast.querySelector('.grand-toast-progress');
     if (progress) {
          progress.style.animationPlayState = 'running';
          progress.style.animation = `progress 200ms linear forwards`;
     }

     toast.style.animation = 'none';
     toast.style.transform = 'none';
     toast.style.opacity = '1';
     void toast.offsetHeight;

     setTimeout(() => {
          const exitDuration = `${speed / 1000}s`;

          switch (exitAnim) {
               case 'pixel':
                    toast.classList.add('pixel-exit');
                    toast.style.setProperty('--exit-duration', exitDuration);
                    toast.style.animation = `pixelDissolve ${exitDuration} linear forwards`;
                    break;
               case 'hologram':
                    toast.classList.add('hologram-exit');
                    toast.style.animation = `hologramFlicker ${exitDuration} ease-out forwards`;
                    break;
               default:
                    toast.style.animation = `meltAway ${exitDuration} cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards`;
          }
     }, 50);

     const removeToast = () => {
          if (toast && toast.parentNode) {
               toast.parentNode.removeChild(toast);
          }
     };

     toast.addEventListener('animationend', removeToast, { once: true });
     setTimeout(removeToast, speed + 100);
}

// Initialize container on script load
ensureContainer();

export { showToast };