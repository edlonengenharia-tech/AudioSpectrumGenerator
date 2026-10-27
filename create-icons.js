const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcons() {
    const iconsDir = path.join(__dirname, 'src-tauri', 'icons');
    
    // Criar diretório se não existir
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    console.log('🎨 Criando ícones para o Tauri...\n');

    // Verificar se existe uma imagem fonte
    let sourceImage = path.join(__dirname, 'public', 'icon-512.png');
    
    if (!fs.existsSync(sourceImage)) {
        console.log('⚠️  Imagem fonte não encontrada em public/icon-512.png');
        console.log('📝 Criando uma imagem placeholder...\n');
        
        // Criar uma imagem placeholder com gradiente roxo
        const svg = `
            <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="512" height="512" fill="url(#grad)"/>
                <text x="256" y="280" font-size="200" font-family="Arial" font-weight="bold" fill="white" text-anchor="middle">♪</text>
            </svg>
        `;
        
        await sharp(Buffer.from(svg))
            .png()
            .toFile(sourceImage);
        
        console.log('✓ Imagem placeholder criada\n');
    }

    // Criar ícones PNG em diferentes tamanhos
    const sizes = [32, 128, 256, 512];
    
    for (const size of sizes) {
        const outputPath = path.join(iconsDir, `${size}x${size}.png`);
        await sharp(sourceImage)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`✓ PNG ${size}x${size} criado`);
    }

    // Criar 128x128@2x.png (cópia do 256x256)
    await sharp(sourceImage)
        .resize(256, 256)
        .png()
        .toFile(path.join(iconsDir, '128x128@2x.png'));
    console.log('✓ PNG 128x128@2x (256x256) criado');

    // Criar ícone ICO (contém múltiplos tamanhos)
    const icoSizes = [16, 24, 32, 48, 64, 256];
    const pngBuffers = [];
    
    for (const size of icoSizes) {
        const buffer = await sharp(sourceImage)
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
        entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 means 256)
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
    await fs.promises.writeFile(path.join(iconsDir, 'icon.ico'), icoFile);
    console.log('✓ Ícone ICO criado (com múltiplos tamanhos)');

    // Criar ícone ICNS para macOS (placeholder simples)
    // Nota: ICNS real requer estrutura específica, mas um placeholder funciona para build
    const icnsBuffer = await sharp(sourceImage)
        .resize(512, 512)
        .png()
        .toBuffer();
    
    // Criar estrutura ICNS básica
    const icnsHeader = Buffer.from('icns', 'ascii');
    const icnsLength = Buffer.alloc(4);
    icnsLength.writeUInt32BE(8 + icnsBuffer.length + 8, 0);
    
    const iconType = Buffer.from('ic10', 'ascii'); // 512x512 PNG
    const iconLength = Buffer.alloc(4);
    iconLength.writeUInt32BE(8 + icnsBuffer.length, 0);
    
    const icnsFile = Buffer.concat([icnsHeader, icnsLength, iconType, iconLength, icnsBuffer]);
    await fs.promises.writeFile(path.join(iconsDir, 'icon.icns'), icnsFile);
    console.log('✓ Ícone ICNS criado (para macOS)');

    console.log('\n✅ Todos os ícones foram criados com sucesso!');
    console.log(`📁 Localização: ${iconsDir}`);
    console.log('\n🚀 Agora execute: build-direto.bat');
}

createIcons().catch(err => {
    console.error('❌ Erro ao criar ícones:', err);
    process.exit(1);
});
