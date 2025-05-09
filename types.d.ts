export interface ToastOptions {
     type?: 'success' | 'error' | 'info' | 'warning' | 'custom';
     entranceAnim?: 'slide' | 'bounce' | 'fade';
     exitAnim?: 'melt' | 'pixel' | 'hologram';
     duration?: number;
     icon?: string;
     closable?: boolean;
     message?: string;
     title?: string;
     background?: string;
     showProgress?: boolean;
}

export function showToast(options?: ToastOptions): void;