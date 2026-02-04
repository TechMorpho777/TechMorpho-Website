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
          // Handle errors before they reach Vite's logger
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Set up error handler on the request to catch ECONNREFUSED early
            proxyReq.on('error', (err: any) => {
              if (err.code === 'ECONNREFUSED' && res && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Service temporarily unavailable. Backend is starting up. Please retry.' }));
              }
            });
          });
          
          proxy.on('error', (err, req, res) => {
            // Handle ECONNREFUSED silently - it's expected during startup
            if (err.code === 'ECONNREFUSED' && res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Service temporarily unavailable. Backend is starting up. Please retry.' }));
              // Don't log or propagate the error - it's handled gracefully
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

