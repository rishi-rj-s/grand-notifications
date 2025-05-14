import { defineConfig } from 'vite';

export default defineConfig({
     build: {
          lib: {
               entry: 'src/index.js',
               name: 'ToastLib',
               fileName: (format) => `index.${format}.js`,
               formats: ['es', 'umd'],
          },
          rollupOptions: {
               output: {
                    assetFileNames: (assetInfo) => {
                         if (assetInfo.name === 'style.css' || assetInfo.name === 'index.css') {
                              return 'styles.css';
                         }
                         return assetInfo.name || 'asset.[ext]';
                    }
               }
          }
     },
     server: {
          open: '/docs/index.html',
     }
});