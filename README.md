# 🎵 Audio Spectrum Generator

Visualizador de áudio profissional com efeitos avançados, criado com React, Vite e Tailwind CSS.

## 🚀 Executar como Aplicação Web

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📦 Criar Executável Portable para Windows

### Método Automático (Recomendado)

```bash
build-completo.bat
```

Este script:
- ✅ Cria todos os ícones necessários
- ✅ Compila o projeto com Tauri
- ✅ Gera o executável portable

### Método Manual

```bash
# 1. Criar ícones
node create-icons.js

# 2. Compilar
cd src-tauri
cargo build --release
```

### Local do Executável

```
src-tauri\target\release\audio-spectrum-generator.exe
```

## 📋 Pré-requisitos para Build

- **Node.js** 18+ → https://nodejs.org/
- **Rust** → https://rustup.rs/
- **Visual Studio Build Tools** → https://visualstudio.microsoft.com/visual-cpp-build-tools/
  - Instalar com "Desenvolvimento para desktop com C++"
  - Instalar "Windows 10 SDK"

## 🎨 Funcionalidades

### Visualização de Áudio
- 📊 Barras com reflexos
- 🌊 Ondas suaves
- 🔵 Circular
- ✨ Partículas
- 🔥 EQ 3D otimizado
- 🌌 Galaxy
- ⚡ Lightning
- 💎 Diamante (NOVO!)

### Efeitos Ambientais
- 🌸 Pétalas caindo
- 🌧️ Chuva
- ❄️ Neve
- 🫧 Bolhas
- ⭐ Estrelas
- ✨ Vagalumes
- 🍂 Folhas
- 🎊 Confete

### Editor de Texto
- ✍️ Múltiplas camadas
- 🎨 Fontes do sistema
- 🎭 Animações (pulse, bounce, float, glow, rotate, typewriter, fade)
- 📍 Posicionamento livre

### Modelos Prontos
- 🎵 Música (Now Playing, DJ Session, Top Hit)
- 🎮 Gamer (Live, Victory, New Record)
- 🎙️ Podcast (Episódio, Entrevista)
- 📱 Social (Novo Vídeo, Link na Bio)
- 🏢 Corporativo (Apresentação, Lançamento)

### Configurações Avançadas
- 🎨 Correção de cor (brilho, contraste, saturação, matiz, sépia, P&B, inverter)
- 📍 Posicionamento do spectrum (X/Y)
- 🔄 Rotação e zoom
- 💡 Glow e blur
- 🖼️ Backgrounds personalizados (imagem ou vídeo)

### Exportação
- 📸 Imagem PNG (1920x1080)
- 🎬 Vídeo WebM (renderização offline)
  - Duração automática baseada no áudio
  - Resoluções: 720p, 1080p, 4K
  - FPS: 24, 30, 60
  - Sincronização perfeita com áudio

### Extras
- 🖼️ Upload de imagens e logos
- 🎞️ Suporte a GIFs animados
- 📐 Controles de posição, tamanho e rotação
- 🔒 Preservação de aspect ratio

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento web
npm run dev

# Build web
npm run build

# Criar executável (completo)
build-completo.bat

# Criar ícones
node create-icons.js

# Build Tauri (manual)
cd src-tauri
cargo build --release

# Desenvolvimento Tauri
npm run tauri:dev
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── App.tsx                 # Componente principal
│   ├── components/
│   │   └── Visualizer.tsx      # Visualizador de áudio
│   └── index.css               # Estilos globais
├── src-tauri/
│   ├── src/
│   │   └── main.rs             # Código Rust
│   ├── icons/                  # Ícones gerados
│   ├── Cargo.toml              # Dependências Rust
│   └── tauri.conf.json         # Configuração Tauri
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker
├── build-completo.bat          # Build completo (USE ESTE!)
├── create-icons.js             # Gerador de ícones
└── package.json
```

## 🎯 Uso Básico

1. **Carregar Áudio**
   - Clique em "📁 Arquivo" para carregar um arquivo de áudio
   - Ou clique em "🎤 Microfone" para usar o microfone

2. **Escolher Modo de Visualização**
   - Selecione entre 8 modos na parte inferior da tela

3. **Personalizar**
   - Use a aba "Visual" para cores e efeitos
   - Use a aba "Texto" para adicionar títulos
   - Use a aba "Modelos" para templates prontos
   - Use a aba "Config" para ajustes avançados

4. **Exportar**
   - Use a aba "Export" para salvar imagem ou vídeo

## 📦 Tamanho do Executável

- **Executável portable:** ~5-10 MB
- **Instalador MSI:** ~8-15 MB
- **Instalador NSIS:** ~7-12 MB

Muito menor que Electron (150+ MB)!

## 🐛 Solução de Problemas

### Erro: "rustc not found"
Instale Rust: https://rustup.rs/

### Erro: "cl.exe not found"
Instale Visual Studio Build Tools com "Desenvolvimento para desktop com C++"

### Erro: "icon.ico not found"
Execute: `node create-icons.js`

### Build muito lento
Normal na primeira vez (5-15 minutos). Próximos builds serão rápidos.

## 📚 Documentação

- **COMO_CRIAR_EXECUTAVEL.md** - Guia completo
- **SOLUCAO_DEFINITIVA.txt** - Solução de problemas
- **GUIA_FINAL.txt** - Guia detalhado

## 🎉 Pronto!

Agora você tem um visualizador de áudio profissional completo com:
- ✅ 8 modos de visualização
- ✅ 8 efeitos ambientais
- ✅ Editor de texto avançado
- ✅ 15 modelos prontos
- ✅ Correção de cor completa
- ✅ Exportação de vídeo em alta qualidade
- ✅ Executável portable para Windows

**Divirta-se criando visualizações incríveis!** 🎵✨
