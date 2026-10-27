# 🚀 Guia Completo: Criar Executável Windows com Tauri

## 📋 Pré-requisitos

Antes de começar, você precisa instalar:

### 1. **Node.js** (já instalado)
- Versão 18 ou superior
- Verifique: `node --version`

### 2. **Rust** (OBRIGATÓRIO)
```bash
# Baixar e instalar Rust
# Acesse: https://rustup.rs/
# Execute o instalador e siga as instruções

# Verificar instalação
rustc --version
cargo --version
```

### 3. **Microsoft Visual Studio C++ Build Tools** (OBRIGATÓRIO)
```bash
# Opção 1: Via comando (recomendado)
# Abra PowerShell como Administrador e execute:
npm install -g windows-build-tools

# Opção 2: Manual
# 1. Baixe: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# 2. Instale selecionando "Desenvolvimento para desktop com C++"
# 3. Certifique-se de marcar "Windows 10 SDK"
```

### 4. **WebView2** (já vem no Windows 10/11)
- Se não tiver, baixe: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

---

## 🔧 Passo a Passo: Configurar Tauri

### **Passo 1: Instalar Tauri CLI**

Abra o terminal na pasta do seu projeto e execute:

```bash
npm install --save-dev @tauri-apps/cli
npm install --save-dev @tauri-apps/api
```

### **Passo 2: Inicializar Tauri**

```bash
npx tauri init
```

Você verá perguntas. Responda assim:

```
? What is your app name? Audio Spectrum Generator
? What should the window title be? Audio Spectrum Generator
? Where are your web assets (relative path)? ../dist
? What URL will development server run on? http://localhost:5173
? What is your Rust namespace? com.audiospectrum
? Which package manager to install Rust dependencies? cargo
```

### **Passo 3: Configurar o `tauri.conf.json`**

Abra o arquivo `src-tauri/tauri.conf.json` e substitua por este conteúdo:

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Audio Spectrum Generator",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": true,
        "readFile": true,
        "writeFile": true
      },
      "dialog": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.audiospectrum.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "resources": [],
      "externalBin": [],
      "copyright": "© 2024 Audio Spectrum Generator",
      "category": "Music",
      "shortDescription": "Visualizador de Áudio Profissional",
      "longDescription": "Um visualizador de áudio profissional com efeitos avançados, modos de visualização, textos animados e exportação de vídeo.",
      "deb": {
        "depends": []
      },
      "macOS": {
        "frameworks": [],
        "minimumSystemVersion": "10.15"
      },
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": "",
        "wix": null
      }
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "Audio Spectrum Generator",
        "width": 1200,
        "minWidth": 800,
        "minHeight": 600,
        "decorations": true,
        "transparent": false,
        "center": true
      }
    ]
  }
}
```

### **Passo 4: Criar Ícones**

O Tauri precisa de ícones em vários tamanhos. Execute:

```bash
# Instalar ferramenta de ícones
npm install --save-dev @tauri-apps/cli

# Gerar ícones automaticamente (precisa de uma imagem PNG 1024x1024)
# Coloque sua imagem em: src-tauri/app-icon.png
# Depois execute:
npx tauri icon src-tauri/app-icon.png
```

**OU** use o ícone que já criamos:

```bash
# Copie o ícone gerado para a pasta de ícones
mkdir -p src-tauri/icons
copy public\icon-512.png src-tauri\app-icon.png
npx tauri icon src-tauri\app-icon.png
```

### **Passo 5: Configurar `package.json`**

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

---

## 🏗️ Compilar o Executável

### **Modo Desenvolvimento (Teste)**

```bash
npm run tauri:dev
```

Isso abrirá o aplicativo em modo de desenvolvimento com hot-reload.

### **Modo Produção (Executável Final)**

```bash
npm run tauri:build
```

**OU** diretamente:

```bash
npx tauri build
```

### **Onde encontrar o executável:**

Após o build, o executável estará em:

```
src-tauri/target/release/bundle/
├── msi/
│   └── Audio Spectrum Generator_1.0.0_x64_en-US.msi  (Instalador)
└── nsis/
    └── Audio Spectrum Generator_1.0.0_x64-setup.exe   (Instalador alternativo)
```

O executável standalone (sem instalador) estará em:

```
src-tauri/target/release/Audio Spectrum Generator.exe
```

---

## 📦 Comandos Úteis

### **Limpar build anterior:**

```bash
cd src-tauri
cargo clean
cd ..
```

### **Build apenas para Windows:**

```bash
npx tauri build --target x86_64-pc-windows-msvc
```

### **Build com debug (mais informações):**

```bash
npx tauri build --debug
```

### **Ver logs durante o build:**

```bash
npx tauri build --verbose
```

---

## 🐛 Solução de Problemas

### **Erro: "rustc" não é reconhecido**

```bash
# Reinstale Rust
# Acesse: https://rustup.rs/
# Execute o instalador novamente
```

### **Erro: "cl.exe" não encontrado**

```bash
# Instale Visual Studio Build Tools
# 1. Baixe: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# 2. Instale com "Desenvolvimento para desktop com C++"
# 3. Reinicie o terminal
```

### **Erro: "WebView2" não encontrado**

```bash
# Baixe e instale WebView2
# https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

### **Erro: Permissão negada**

```bash
# Execute o terminal como Administrador
# Clique direito no PowerShell/CMD → "Executar como administrador"
```

### **Build muito lento na primeira vez**

```bash
# É normal! O primeiro build baixa e compila todas as dependências Rust
# Pode levar 5-15 minutos
# Os próximos builds serão muito mais rápidos
```

### **Erro de ícones**

```bash
# Gere os ícones novamente
npx tauri icon src-tauri/app-icon.png

# Ou use ícones padrão do Tauri
# Baixe de: https://github.com/tauri-apps/tauri/blob/dev/examples/api/src-tauri/icons/
```

---

## 🎯 Resumo dos Comandos

```bash
# 1. Instalar Tauri
npm install --save-dev @tauri-apps/cli @tauri-apps/api

# 2. Inicializar
npx tauri init

# 3. Configurar tauri.conf.json (use o template acima)

# 4. Gerar ícones
npx tauri icon src-tauri/app-icon.png

# 5. Testar em desenvolvimento
npm run tauri:dev

# 6. Criar executável final
npm run tauri:build
```

---

## 📊 Tamanho do Executável

- **Executável standalone:** ~5-10 MB
- **Instalador MSI:** ~8-15 MB
- **Instalador NSIS:** ~7-12 MB

Muito menor que Electron (que geralmente tem 150+ MB)!

---

## ✅ Checklist Final

- [ ] Rust instalado (`rustc --version`)
- [ ] Visual Studio Build Tools instalado
- [ ] WebView2 instalado
- [ ] `npm install --save-dev @tauri-apps/cli @tauri-apps/api` executado
- [ ] `npx tauri init` executado
- [ ] `tauri.conf.json` configurado
- [ ] Ícones gerados (`npx tauri icon`)
- [ ] Scripts adicionados ao `package.json`
- [ ] `npm run tauri:dev` funcionando
- [ ] `npm run tauri:build` gerou o executável

---

## 🎉 Pronto!

Agora você tem um executável Windows nativo, leve e rápido do seu Audio Spectrum Generator!

**Distribuição:**
- Compartilhe o arquivo `.msi` ou `.exe` da pasta `src-tauri/target/release/bundle/`
- Os usuários só precisam executar o instalador
- Não precisam instalar Node.js, Rust ou qualquer outra dependência!

---

## 📚 Recursos Adicionais

- **Documentação Tauri:** https://tauri.app/v1/guides/
- **API Tauri:** https://tauri.app/v1/api/js/
- **Exemplos:** https://github.com/tauri-apps/tauri/tree/dev/examples
- **Comunidade:** https://discord.gg/tauri

---

**Precisa de ajuda?** Me avise se encontrar algum erro específico! 🚀
