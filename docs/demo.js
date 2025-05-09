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

function ensureContainer() {
     let container = document.getElementById('grand-toast-container');
     if (!container) {
          container = document.createElement('div');
          container.id = 'grand-toast-container';
          document.body.appendChild(container);
     }
     return container;
}

function showToast(options = {}) {
     // Validate options
     const validTypes = ['success', 'error', 'info', 'warning', 'custom'];
     const validEntranceAnims = ['slide', 'bounce', 'fade'];
     const validExitAnims = ['melt', 'pixel', 'hologram'];

     const type = (options.type && validTypes.includes(options.type)) ? options.type : 'success';
     const entranceAnim = (options.entranceAnim && validEntranceAnims.includes(options.entranceAnim)) ? options.entranceAnim : 'slide';
     const exitAnim = (options.exitAnim && validExitAnims.includes(options.exitAnim)) ? options.exitAnim : 'melt';
     const duration = typeof options.duration === 'number' && options.duration > 0 ? options.duration : 3000;
     const closable = typeof options.closable === 'boolean' ? options.closable : true;
     const showProgress = typeof options.showProgress === 'boolean' ? options.showProgress : false;

     const container = ensureContainer();
     const toast = document.createElement('div');

     // Set toast class and accessibility attributes
     toast.className = `grand-toast ${type}`;
     toast.setAttribute('role', 'alert');
     toast.setAttribute('aria-live', 'assertive');
     toast.setAttribute('aria-atomic', 'true');

     // Apply entrance animation
     switch (entranceAnim) {
          case 'bounce':
               toast.style.animation = 'grandEntranceBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
               break;
          case 'fade':
               toast.style.animation = 'grandEntranceFade 0.5s ease-out forwards';
               break;
          default:
               toast.style.animation = 'grandEntranceSlide 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
     }

     // Apply custom background if provided
     if (options.background) {
          toast.style.background = options.background;
     }

     // Add icon
     const icon = document.createElement('div');
     icon.className = 'grand-toast-icon';
     icon.innerHTML = options.icon || icons[type] || icons.custom;
     toast.appendChild(icon);

     // Add content
     const content = document.createElement('div');
     content.className = 'grand-toast-content';

     // Add title if provided
     if (options.title) {
          const titleElement = document.createElement('h3');
          titleElement.className = 'grand-toast-title';
          titleElement.textContent = options.title;
          content.appendChild(titleElement);
     }

     // Add message
     const message = document.createElement('p');
     message.className = 'grand-toast-message';
     message.textContent = options.message || toastMessages[type] || toastMessages.custom;
     content.appendChild(message);

     toast.appendChild(content);

     // Add close button if closable
     if (closable) {
          const closeBtn = document.createElement('button');
          closeBtn.className = 'grand-toast-close';
          closeBtn.setAttribute('aria-label', 'Close notification');
          closeBtn.innerHTML = '×';
          closeBtn.onclick = () => dismissToast(toast, exitAnim);
          toast.appendChild(closeBtn);
     }

     // Add progress bar if enabled
     let progress = null;
     if (showProgress) {
          progress = document.createElement('div');
          progress.className = 'grand-toast-progress';
          progress.style.animation = `progress ${duration}ms linear forwards`;
          toast.appendChild(progress);
     }

     container.appendChild(toast);

     // Set timeout for dismissal
     const timeoutId = setTimeout(() => {
          dismissToast(toast, exitAnim);
     }, duration);

     // Pause on hover, but exclude the progress bar
     toast.addEventListener('mouseenter', () => {
          clearTimeout(timeoutId);
          toast.style.animationPlayState = 'paused';
          if (progress) {
               progress.style.animationPlayState = 'running'; // Ensure progress bar continues
          }
     });

     toast.addEventListener('mouseleave', () => {
          toast.style.animationPlayState = 'running';
          if (progress) {
               progress.style.animationPlayState = 'running';
          }
          const newTimeoutId = setTimeout(() => {
               dismissToast(toast, exitAnim);
          }, duration);
          toast.dataset.timeoutId = newTimeoutId.toString();
     });

     toast.dataset.timeoutId = timeoutId.toString();
}

function dismissToast(toast, exitAnim = 'melt') {
     if (toast.dataset.timeoutId) {
          clearTimeout(parseInt(toast.dataset.timeoutId));
     }
     toast.style.animation = 'none';
     toast.classList.remove('pixel-exit', 'hologram-exit');
     void toast.offsetHeight;
     switch (exitAnim) {
          case 'pixel':
               toast.classList.add('pixel-exit');
               toast.style.animation = 'pixelDissolve 1s linear forwards';
               break;
          case 'hologram':
               toast.classList.add('hologram-exit');
               toast.style.animation = 'hologramFlicker 0.8s ease-out forwards';
               break;
          default:
               toast.style.animation = 'meltAway 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards';
     }
     const removeToast = () => {
          if (toast && toast.parentNode) {
               toast.parentNode.removeChild(toast);
          }
     };
     toast.addEventListener('animationend', removeToast, { once: true });
     setTimeout(removeToast, 1200);
}

ensureContainer();