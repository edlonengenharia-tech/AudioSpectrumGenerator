const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
    const outputDir = 'src-tauri/icons';

    // Criar diretório se não existir
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎨 Gerando ícones para o Audio Spectrum Generator...\n');

    // Criar SVG do ícone
    const svgIcon = `
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
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" fill="url(#bgGradient)" rx="64"/>
  
  <!-- Equalizer Bars -->
  <g filter="url(#glow)">
    <!-- Bar 1 -->
    <rect x="120" y="280" width="40" height="120" fill="url(#barGradient1)" rx="8"/>
    <!-- Bar 2 -->
    <rect x="180" y="200" width="40" height="200" fill="url(#barGradient2)" rx="8"/>
    <!-- Bar 3 -->
    <rect x="240" y="160" width="40" height="240" fill="url(#barGradient3)" rx="8"/>
    <!-- Bar 4 -->
    <rect x="300" y="220" width="40" height="180" fill="url(#barGradient1)" rx="8"/>
    <!-- Bar 5 -->
    <rect x="360" y="260" width="40" height="140" fill="url(#barGradient2)" rx="8"/>
  </g>
  
  <!-- Music Note -->
  <g transform="translate(256, 100)" filter="url(#glow)">
    <circle cx="0" cy="0" r="20" fill="#ffffff" opacity="0.9"/>
    <path d="M 0,-20 L 0,-60 L 30,-50 L 30,-10" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.9"/>
    <circle cx="30" cy="-10" r="15" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>
`;

    // Salvar SVG temporário
    const tempSvgPath = path.join(outputDir, 'temp-icon.svg');
    fs.writeFileSync(tempSvgPath, svgIcon);

    // Tamanhos necessários para PNG
    const pngSizes = [32, 128, 256, 512];
    
    for (const size of pngSizes) {
        const outputPath = path.join(outputDir, `${size}x${size}.png`);
        await sharp(tempSvgPath)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`✓ Criado: ${size}x${size}.png`);
    }

    // Criar 128x128@2x.png (256x256)
    await sharp(tempSvgPath)
        .resize(256, 256)
        .png()
        .toFile(path.join(outputDir, '128x128@2x.png'));
    console.log('✓ Criado: 128x128@2x.png');

    // Criar ICO com múltiplos tamanhos
    const icoSizes = [16, 24, 32, 48, 64, 256];
    const pngBuffers = [];

    for (const size of icoSizes) {
        const buffer = await sharp(tempSvgPath)
            .resize(size, size)
            .png()
            .toBuffer();
        pngBuffers.push({ size, buffer });
    }

    // Criar arquivo ICO manualmente
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0); // Reserved
    icoHeader.writeUInt16LE(1, 2); // Type: 1 = ICO
    icoHeader.writeUInt16LE(pngBuffers.length, 4); // Number of images

    let offset = 6 + (pngBuffers.length * 16); // Header + entries
    const entries = [];
    const imageData = [];

    for (const { size, buffer } of pngBuffers) {
        const entry = Buffer.alloc(16);
        entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 = 256)
        entry.writeUInt8(size === 256 ? 0 : size, 1); // Height
        entry.writeUInt8(0, 2); // Color palette
        entry.writeUInt8(0, 3); // Reserved
        entry.writeUInt16LE(1, 4); // Color planes
        entry.writeUInt16LE(32, 6); // Bits per pixel
        entry.writeUInt32LE(buffer.length, 8); // Size of image data
        entry.writeUInt32LE(offset, 12); // Offset to image data
        
        entries.push(entry);
        imageData.push(buffer);
        offset += buffer.length;
    }

    const icoFile = Buffer.concat([icoHeader, ...entries, ...imageData]);
    fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoFile);
    console.log('✓ Criado: icon.ico');

    // Criar ICNS para macOS (estrutura básica)
    const icnsBuffer = await sharp(tempSvgPath)
        .resize(512, 512)
        .png()
        .toBuffer();
    
    const icnsHeader = Buffer.from('icns', 'ascii');
    const icnsLength = Buffer.alloc(4);
    icnsLength.writeUInt32BE(8 + icnsBuffer.length + 8, 0);
    
    const iconType = Buffer.from('ic10', 'ascii'); // 512x512 PNG
    const iconLength = Buffer.alloc(4);
    iconLength.writeUInt32BE(8 + icnsBuffer.length, 0);
    
    const icnsFile = Buffer.concat([icnsHeader, icnsLength, iconType, iconLength, icnsBuffer]);
    fs.writeFileSync(path.join(outputDir, 'icon.icns'), icnsFile);
    console.log('✓ Criado: icon.icns');

    // Remover SVG temporário
    fs.unlinkSync(tempSvgPath);

    console.log('\n✅ Todos os ícones foram gerados com sucesso!');
    console.log(`📁 Localização: ${outputDir}`);
    console.log('\n🎨 Design: Gradiente roxo-azul com barras de equalizador coloridas e nota musical');
}

generateIcons().catch(err => {
    console.error('❌ Erro ao gerar ícones:', err);
    process.exit(1);
});
