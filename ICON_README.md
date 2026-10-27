# 🎨 Ícone do Audio Spectrum Generator

## Preview

Abra o arquivo `icon-preview.html` no navegador para ver o ícone em diferentes tamanhos.

## Design

O ícone foi criado com um design moderno e profissional:

- **Fundo:** Gradiente roxo-azul (#8b5cf6 → #6366f1 → #3b82f6)
- **Elementos:** 5 barras de equalizador coloridas com efeito glow
- **Destaque:** Nota musical branca brilhante no topo
- **Estilo:** Minimalista, reconhecível em qualquer tamanho
- **Cores:** Roxo, índigo, azul, rosa

## Formatos Gerados

O script `generate-icons.js` cria automaticamente:

- ✅ **icon.ico** - Múltiplos tamanhos (16, 24, 32, 48, 64, 256)
- ✅ **32x32.png** - Ícone pequeno
- ✅ **128x128.png** - Ícone médio
- ✅ **256x256.png** - Ícone grande
- ✅ **512x512.png** - Ícone extra grande
- ✅ **128x128@2x.png** - Versão retina (256x256)
- ✅ **icon.icns** - Formato macOS

## Como Usar

### Gerar Ícones

```bash
node generate-icons.js
```

### Criar Executável com Ícone

```bash
build-final.bat
```

Este script:
1. Gera todos os ícones automaticamente
2. Compila o projeto com Tauri
3. Cria o executável portable com o ícone personalizado

## Personalizar o Ícone

Se quiser mudar o design:

1. Edite o arquivo `generate-icons.js`
2. Modifique o SVG na variável `svgIcon`
3. Execute: `node generate-icons.js`
4. Faça o build: `cd src-tauri && cargo build --release`

### Exemplo de Personalização

```javascript
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <!-- Seu design personalizado aqui -->
</svg>
`;
```

## Localização dos Arquivos

Todos os ícones são gerados em:

```
src-tauri/icons/
├── icon.ico
├── icon.icns
├── 32x32.png
├── 128x128.png
├── 128x128@2x.png
├── 256x256.png
└── 512x512.png
```

## Requisitos

- Node.js 18+
- sharp (instalado automaticamente)

```bash
npm install sharp
```

## Dicas

- O ícone é otimizado para ser reconhecível em tamanhos pequenos (32x32)
- O efeito glow nas barras de equalizador dá um aspecto moderno
- A nota musical identifica imediatamente como aplicativo de áudio
- O gradiente roxo-azul é profissional e atraente

## Alternativas

Se preferir usar uma imagem personalizada:

1. Crie uma imagem PNG de 512x512 pixels
2. Salve como `public/icon-512.png`
3. Modifique `generate-icons.js` para usar essa imagem
4. Execute: `node generate-icons.js`

---

**Desenvolvido para o Audio Spectrum Generator** 🎵✨
