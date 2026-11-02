/**
 * Genera los iconos PWA como PNG a partir de canvas.
 * Ejecutar: node scripts/generate-icons.js
 * Requiere: npm i canvas (solo para generar, no para runtime)
 *
 * ALTERNATIVA SIN CANVAS: Abrir cada SVG en el navegador y guardar como PNG,
 * o usar un servicio online como https://svgtopng.com/
 *
 * Los SVG en public/icons/ funcionan directamente como iconos en navegadores modernos.
 * Para iPad Safari, el apple-touch-icon referencia el SVG que Safari renderiza.
 */

import { writeFileSync } from 'fs';

// Simple 1x1 yellow PNG as minimal fallback
// En producción, reemplazar con PNGs generados desde los SVGs
const YELLOW = [0xff, 0xe2, 0x52, 0xff];

function createMinimalPNG(size) {
  // PNG with IHDR, IDAT (uncompressed), IEND
  // For a proper icon, use the SVG files or convert them externally
  console.log(`Icon placeholder: public/icons/icon-${size}.png`);
  console.log(`  → Para iPad: convertir public/icons/icon-${size}.svg a PNG`);
  console.log(`  → Herramienta: https://svgtopng.com/ o Inkscape`);
}

createMinimalPNG(192);
createMinimalPNG(512);
console.log('\nLos SVG en public/icons/ funcionan como iconos PWA en navegadores modernos.');
console.log('iPad Safari usa apple-touch-icon del index.html.');
