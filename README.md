# 🎵 Audio Spectrum Generator

Visualizador de áudio profissional com efeitos avançados, agora com build Electron simplificado!

## 🚀 Build Rápido com Electron

### Método Simples (Recomendado)

```bash
build-electron.bat
```

**Pronto!** O executável estará em `dist\release\`

### O que o script faz:

1. ✅ Instala Electron automaticamente
2. ✅ Gera o build do Vite
3. ✅ Cria o executável Windows
4. ✅ Abre a pasta com o executável

## 📦 Arquivos Gerados

Após o build, você terá:

```
dist\release\
├── Audio Spectrum Generator Setup X.X.X.exe  (Instalador)
└── win-unpacked\                              (Versão portátil)
    └── Audio Spectrum Generator.exe
```

## 🎨 Ícone Personalizado (Opcional)

Se quiser um ícone personalizado:

1. Crie uma imagem PNG 512x512
2. Salve como `icon.png` na raiz do projeto
3. Execute `build-electron.bat` novamente

**Não é obrigatório!** O app funciona sem ícone.

## 🎯 Funcionalidades

### Visualização de Áudio
- 📊 Barras com reflexos
- 🌊 Ondas suaves
- 🔵 Circular
- ✨ Partículas
- 🔥 EQ 3D otimizado
- 🌌 Galaxy
- ⚡ Lightning
- 💎 Diamante

### Efeitos Ambientais
- 🌸 Pétalas, 🌧️ Chuva, ❄️ Neve, 🫧 Bolhas
- ⭐ Estrelas, ✨ Vagalumes, 🍂 Folhas, 🎊 Confete

### Editor de Texto
- ✍️ Múltiplas camadas
- 🎨 Fontes do sistema
- 🎭 Animações (pulse, bounce, float, glow, rotate, typewriter, fade)

### Modelos Prontos
- 🎵 Música, 🎮 Gamer, 🎙️ Podcast, 📱 Social, 🏢 Corporativo

### Configurações Avançadas
- 🎨 Correção de cor completa
- 📍 Posicionamento do spectrum
- 🔄 Rotação e zoom
- 💡 Glow e blur
- 🖼️ Backgrounds (imagem ou vídeo)

### Exportação
- 📸 Imagem PNG (1920x1080)
- 🎬 Vídeo WebM (renderização offline)

## 🛠️ Desenvolvimento

### Modo desenvolvimento
```bash
npm run dev
```

### Build web
```bash
npm run build
```

### Build executável
```bash
build-electron.bat
```

## 📊 Comparação: Electron vs Tauri

| Característica | Electron | Tauri |
|----------------|----------|-------|
| Tamanho | ~150 MB | ~10 MB |
| Configuração | ✅ Simples | ❌ Complexa |
| Confiabilidade | ✅ Alta | ❌ Problemas |
| Documentação | ✅ Completa | ⚠️ Limitada |
| Build time | ~2 min | ~15 min |

**Escolhemos Electron pela simplicidade e confiabilidade!**

## 🐛 Solução de Problemas

### Erro: "electron not found"
```bash
npm install --save-dev electron electron-builder
```

### Erro: "build failed"
```bash
npm run build
```

### Erro no build-electron.bat
Execute manualmente:
```bash
npm install --save-dev electron electron-builder
npm run build
copy electron-main.js dist\main.js
cd dist
npx electron-builder --win --x64
```

## 📚 Documentação

- `ELECTRON_GUIA.md` - Guia completo do build Electron
- `README_ICONE.md` - Sobre o ícone (opcional)
- `GUIA_COMPLETO.txt` - Guia de funcionalidades

## 🎉 Pronto!

Execute `build-electron.bat` e tenha seu executável em minutos!

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS + Electron**
