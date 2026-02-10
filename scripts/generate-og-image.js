/**
 * Generate OG Image PNG from SVG
 * Run: node scripts/generate-og-image.js
 * 
 * This script converts the og-image.svg to og-image.png
 * PNG format is required for social media platforms (Facebook, Twitter, LinkedIn, Telegram)
 * as most platforms don't support SVG for Open Graph images.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Simple HTML-based approach - use browser to convert
const svgContent = readFileSync(join(publicDir, 'og-image.svg'), 'utf-8');

const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;">
  <canvas id="canvas" width="1200" height="630"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([\`${svgContent.replace(/`/g, '\\`')}\`], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1200, 630);
      const dataUrl = canvas.toDataURL('image/png');
      document.title = dataUrl;
    };
    img.src = url;
  </script>
</body>
</html>`;

console.log(`
╔════════════════════════════════════════════════════════════╗
║           OG Image PNG Generation Guide                    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  To convert og-image.svg to og-image.png, use one of:     ║
║                                                            ║
║  Option 1: Online converter                                ║
║  → Go to https://svgtopng.com                              ║
║  → Upload public/og-image.svg                              ║
║  → Set size: 1200x630                                      ║
║  → Download and save as public/og-image.png                ║
║                                                            ║
║  Option 2: Using sharp (Node.js)                           ║
║  → npm install sharp                                       ║
║  → Then run this script again                              ║
║                                                            ║
║  Option 3: Using Inkscape CLI                              ║
║  → inkscape og-image.svg -o og-image.png -w 1200 -h 630   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

// Try using sharp if available
try {
    const { default: sharp } = await import('sharp');
    const svgBuffer = readFileSync(join(publicDir, 'og-image.svg'));

    await sharp(svgBuffer)
        .resize(1200, 630)
        .png({ quality: 95 })
        .toFile(join(publicDir, 'og-image.png'));

    console.log('✅ Successfully generated og-image.png!');
} catch (e) {
    console.log('ℹ️  sharp not installed. Install it with: npm install sharp --save-dev');
    console.log('   Then run: node scripts/generate-og-image.js');
}
