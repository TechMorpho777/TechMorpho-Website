import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 30000,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          // Suppress ECONNREFUSED errors in console
          const originalError = console.error;
          let errorSuppressed = false;
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.on('error', (err: any) => {
              if (err.code === 'ECONNREFUSED') {
                if (res && !res.headersSent) {
                  res.writeHead(503, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    success: false,
                    error: 'Backend server is not running. Please start the backend server on port 3000.' 
                  }));
                }
                errorSuppressed = true;
                return;
              }
            });
          });
          
          proxy.on('error', (err: any, req: any, res: any) => {
            if (err.code === 'ECONNREFUSED') {
              if (res && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  success: false,
                  error: 'Backend server is not running. Please start the backend server on port 3000.' 
                }));
              }
              // Suppress the error from being logged
              return;
            }
            // Only log non-ECONNREFUSED errors
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})

