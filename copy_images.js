import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'C:\\Users\\91935\\.gemini\\antigravity-ide\\brain\\8be408a3-4512-47a4-80e8-3cb8c68688b0';
const destDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  { src: 'media__1782815886554.jpg', dest: 'edura-logo-new.png' },
  { src: 'media__1782815886554.jpg', dest: 'logo-alt.jpg' },
  { src: 'media__1782815898246.png', dest: 'hero-1.png' },
  { src: 'media__1782815908083.png', dest: 'hero-2.png' },
  { src: 'media__1782815915641.png', dest: 'hero-3.png' },
  { src: 'media__1782815908083.png', dest: 'disine-1.png' }
];

files.forEach(file => {
  const srcPath = path.join(sourceDir, file.src);
  const destPath = path.join(destDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} to ${file.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});
