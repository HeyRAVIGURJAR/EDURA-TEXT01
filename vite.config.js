import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-artifacts',
      configureServer(server) {
        server.middlewares.use('/artifacts', (req, res, next) => {
          const artifactDir = 'C:/Users/91935/.gemini/antigravity-ide/brain/8be408a3-4512-47a4-80e8-3cb8c68688b0';
          // Decode URL to handle spaces or special characters
          const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
          const filePath = path.join(artifactDir, cleanUrl);
          
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif'
            };
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext]);
            }
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'EDURA | Premium Badge Dashboard',
        short_name: 'EDURA',
        description: 'Luxury Learning Platform & Badge Dashboard',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
