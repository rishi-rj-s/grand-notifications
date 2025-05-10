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

function updateToastPosition(position) {
     const container = ensureContainer();
     const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle'];
     container.className = 'grand-toast-container';
     if (validPositions.includes(position)) {
          container.classList.add(position);
     } else {
          container.classList.add('top-right');
     }
}

function showToast(options = {}) {
     const validTypes = ['success', 'error', 'info', 'warning', 'custom'];
     const validEntranceAnims = ['slide', 'bounce', 'fade'];
     const validExitAnims = ['melt', 'pixel', 'hologram'];
     const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'middle'];

     const type = (options.type && validTypes.includes(options.type)) ? options.type : 'success';
     const entranceAnim = (options.entranceAnim && validEntranceAnims.includes(options.entranceAnim)) ? options.entranceAnim : 'slide';
     const exitAnim = (options.exitAnim && validExitAnims.includes(options.exitAnim)) ? options.exitAnim : 'melt';
     const position = (options.position && validPositions.includes(options.position)) ? options.position : document.getElementById('toast-position')?.value || 'top-right';
     const duration = typeof options.duration === 'number' && options.duration > 0 ? options.duration : 3000;
     const closable = typeof options.closable === 'boolean' ? options.closable : true;
     const textColor = typeof options.color === 'string' ? options.color : '';
     const speed = typeof options.speed === 'number' && options.speed > 0 ? options.speed : 600;
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
     let animationFrame;

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
     toast.dataset.animationFrame = animationFrame;

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

function dismissToast(toast, exitAnim = 'melt', speed = 600) {
     if (toast.dataset.isDismissing) return;
     toast.dataset.isDismissing = 'true';

     cancelAnimationFrame(toast.dataset.animationFrame);

     // Complete progress animation or fade out
     const progress = toast.querySelector('.grand-toast-progress');
     if (progress) {
          progress.style.animationPlayState = 'running'; // Ensure animation completes
          progress.style.animation = `progress 200ms linear forwards`; // Shorten to sync with exit
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
               case 'melt':
               default:
                    console.log('Applying meltAway animation');
                    toast.style.animation = `meltAway ${exitDuration} cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards`;
          }
     }, 50); // Increased to 50ms for reliable reflow

     const removeToast = () => {
          if (toast && toast.parentNode) {
               toast.parentNode.removeChild(toast);
          }
     };

     toast.addEventListener('animationend', removeToast, { once: true });
     // Fallback timeout to ensure removal if animationend fails
     setTimeout(removeToast, speed + 100);
}


ensureContainer();