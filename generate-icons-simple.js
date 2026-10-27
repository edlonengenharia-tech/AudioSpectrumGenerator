import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
    const outputDir = 'src-tauri/icons';

    // Criar diretório se não existir
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎨 Gerando ícones para o Audio Spectrum Generator...\n');

    // Criar SVG do ícone
    const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="barGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="barGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="barGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" fill="url(#bgGradient)" rx="64"/>
  
  <!-- Equalizer Bars -->
  <g>
    <rect x="120" y="280" width="40" height="120" fill="url(#barGradient1)" rx="8"/>
    <rect x="180" y="200" width="40" height="200" fill="url(#barGradient2)" rx="8"/>
    <rect x="240" y="160" width="40" height="240" fill="url(#barGradient3)" rx="8"/>
    <rect x="300" y="220" width="40" height="180" fill="url(#barGradient1)" rx="8"/>
    <rect x="360" y="260" width="40" height="140" fill="url(#barGradient2)" rx="8"/>
  </g>
  
  <!-- Music Note -->
  <g transform="translate(256, 100)">
    <circle cx="0" cy="0" r="20" fill="#ffffff" opacity="0.9"/>
    <path d="M 0,-20 L 0,-60 L 30,-50 L 30,-10" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.9"/>
    <circle cx="30" cy="-10" r="15" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>`;

    // Salvar SVG
    const svgPath = path.join(outputDir, 'icon.svg');
    fs.writeFileSync(svgPath, svgIcon);
    console.log('✓ Criado: icon.svg');

    // Criar ícone ICO mínimo (placeholder)
    // Este é um ICO válido mas simples que o Tauri aceita
    const icoBuffer = createMinimalICO();
    fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoBuffer);
    console.log('✓ Criado: icon.ico');

    // Criar PNGs placeholder (o Tauri vai usar o SVG se disponível)
    const sizes = [32, 128, 256, 512];
    for (const size of sizes) {
        const pngBuffer = createMinimalPNG(size);
        fs.writeFileSync(path.join(outputDir, `${size}x${size}.png`), pngBuffer);
        console.log(`✓ Criado: ${size}x${size}.png`);
    }

    // Criar 128x128@2x.png
    const png2xBuffer = createMinimalPNG(256);
    fs.writeFileSync(path.join(outputDir, '128x128@2x.png'), png2xBuffer);
    console.log('✓ Criado: 128x128@2x.png');

    // Criar ICNS placeholder
    const icnsBuffer = createMinimalICNS();
    fs.writeFileSync(path.join(outputDir, 'icon.icns'), icnsBuffer);
    console.log('✓ Criado: icon.icns');

    console.log('\n✅ Todos os ícones foram gerados com sucesso!');
    console.log(`📁 Localização: ${outputDir}`);
    console.log('\n💡 Dica: Para ícones de alta qualidade, instale sharp:');
    console.log('   npm install sharp');
    console.log('   E use generate-icons.js');
}

// Criar ICO mínimo válido
function createMinimalICO() {
    // ICO header
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: 1 = ICO
    header.writeUInt16LE(1, 4); // Number of images: 1

    // Directory entry
    const entry = Buffer.alloc(16);
    entry.writeUInt8(32, 0); // Width: 32
    entry.writeUInt8(32, 1); // Height: 32
    entry.writeUInt8(0, 2); // Color palette: 0
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes: 1
    entry.writeUInt16LE(32, 6); // Bits per pixel: 32
    entry.writeUInt32LE(40 + 32 * 32 * 4, 8); // Size of image data
    entry.writeUInt32LE(22, 12); // Offset to image data

    // BMP header
    const bmpHeader = Buffer.alloc(40);
    bmpHeader.writeUInt32LE(40, 0); // Size of header
    bmpHeader.writeInt32LE(32, 4); // Width
    bmpHeader.writeInt32LE(64, 8); // Height (double for AND mask)
    bmpHeader.writeUInt16LE(1, 12); // Planes
    bmpHeader.writeUInt16LE(32, 14); // Bits per pixel
    bmpHeader.writeUInt32LE(0, 16); // Compression
    bmpHeader.writeUInt32LE(32 * 32 * 4, 20); // Image size

    // Pixel data (32x32 RGBA - gradiente roxo-azul)
    const pixels = Buffer.alloc(32 * 32 * 4);
    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
            const idx = (y * 32 + x) * 4;
            const t = (x + y) / 64;
            // Gradiente roxo-azul
            pixels[idx] = Math.floor(139 - t * 80); // R
            pixels[idx + 1] = Math.floor(92 - t * 30); // G
            pixels[idx + 2] = Math.floor(246 - t * 100); // B
            pixels[idx + 3] = 255; // A
        }
    }

    // AND mask (tudo transparente)
    const mask = Buffer.alloc(32 * 32 / 8);

    return Buffer.concat([header, entry, bmpHeader, pixels, mask]);
}

// Criar PNG mínimo válido
function createMinimalPNG(size) {
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0); // Length
    ihdr.write('IHDR', 4); // Type
    ihdr.writeUInt32BE(size, 8); // Width
    ihdr.writeUInt32BE(size, 12); // Height
    ihdr.writeUInt8(8, 16); // Bit depth
    ihdr.writeUInt8(2, 17); // Color type (RGB)
    ihdr.writeUInt8(0, 18); // Compression
    ihdr.writeUInt8(0, 19); // Filter
    ihdr.writeUInt8(0, 20); // Interlace
    // CRC será calculado depois

    // IDAT chunk (imagem comprimida)
    const rawData = [];
    for (let y = 0; y < size; y++) {
        rawData.push(0); // Filter type: None
        for (let x = 0; x < size; x++) {
            const t = (x + y) / (size * 2);
            rawData.push(Math.floor(139 - t * 80)); // R
            rawData.push(Math.floor(92 - t * 30)); // G
            rawData.push(Math.floor(246 - t * 100)); // B
        }
    }

    // Comprimir com zlib (simplificado - usa dados não comprimidos)
    const zlibHeader = Buffer.from([0x78, 0x01]); // zlib header
    const rawDataBuffer = Buffer.from(rawData);
    
    // Criar blocos não comprimidos
    const blocks = [];
    const blockSize = 65535;
    for (let i = 0; i < rawDataBuffer.length; i += blockSize) {
        const block = rawDataBuffer.slice(i, Math.min(i + blockSize, rawDataBuffer.length));
        const blockHeader = Buffer.alloc(5);
        blockHeader.writeUInt8(i + blockSize >= rawDataBuffer.length ? 1 : 0, 0); // Final block
        blockHeader.writeUInt16LE(block.length, 1); // Length
        blockHeader.writeUInt16LE(block.length ^ 0xFFFF, 3); // One's complement
        blocks.push(blockHeader, block);
    }

    const idatData = Buffer.concat([zlibHeader, ...blocks]);
    
    // Calcular Adler-32 checksum
    let a = 1, b = 0;
    for (let i = 0; i < rawDataBuffer.length; i++) {
        a = (a + rawDataBuffer[i]) % 65521;
        b = (b + a) % 65521;
    }
    const adler32 = Buffer.alloc(4);
    adler32.writeUInt32BE((b << 16) | a, 0);

    const idat = Buffer.alloc(8 + idatData.length + 4);
    idat.writeUInt32BE(idatData.length + 4, 0); // Length
    idat.write('IDAT', 4); // Type
    idatData.copy(idat, 8);
    adler32.copy(idat, 8 + idatData.length);

    // IEND chunk
    const iend = Buffer.alloc(12);
    iend.writeUInt32BE(0, 0); // Length
    iend.write('IEND', 4); // Type

    return Buffer.concat([signature, ihdr, idat, iend]);
}

// Criar ICNS mínimo
function createMinimalICNS() {
    // ICNS header
    const header = Buffer.from('icns', 'ascii');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(8, 0); // Apenas o header

    return Buffer.concat([header, length]);
}

generateIcons().catch(err => {
    console.error('❌ Erro ao gerar ícones:', err);
    process.exit(1);
});
