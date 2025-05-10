export interface ToastOptions {
     position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'middle';
     type?: 'success' | 'error' | 'info' | 'warning' | 'custom';
     entranceAnim?: 'slide' | 'bounce' | 'fade';
     exitAnim?: 'melt' | 'pixel' | 'hologram';
     duration?: number;
     icon?: string;
     closable?: boolean;
     message?: string;
     title?: string;
     background?: string;
     color?: string;
     speed?: number; 
     showProgress?: boolean;
}

export function showToast(options?: ToastOptions): void;