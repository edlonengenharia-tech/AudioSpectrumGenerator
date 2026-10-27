# 🎵 Audio Spectrum Generator - Criar Executável Windows

## 🚀 Método Rápido (Recomendado)

### **Passo 1: Instalar Pré-requisitos**

Antes de começar, instale:

1. **Rust** → https://rustup.rs/
   - Baixe e execute o instalador
   - Reinicie o terminal após instalar

2. **Visual Studio Build Tools** → https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Instale com "Desenvolvimento para desktop com C++"
   - Marque "Windows 10 SDK"

### **Passo 2: Executar o Instalador Automático**

```bash
# No terminal, execute:
instalar-tauri.bat
```

O script vai:
- ✅ Verificar todas as dependências
- ✅ Instalar o Tauri
- ✅ Configurar o projeto
- ✅ Gerar ícones
- ✅ Perguntar se quer criar o executável

### **Passo 3: Criar o Executável**

Se você escolheu "N" no passo anterior, execute:

```bash
build-windows.bat
```

**OU** manualmente:

```bash
npm run tauri:build
```

### **Passo 4: Encontrar o Executável**

O executável estará em:

```
src-tauri\target\release\bundle\
├── msi\
│   └── Audio Spectrum Generator_1.0.0_x64_en-US.msi
└── nsis\
    └── Audio Spectrum Generator_1.0.0_x64-setup.exe
```

---

## 📝 Método Manual (Passo a Passo)

Se preferir fazer manualmente:

### **1. Instalar Tauri**

```bash
npm install --save-dev @tauri-apps/cli @tauri-apps/api
```

### **2. Inicializar Tauri**

```bash
npx tauri init
```

Responda:
- App name: `Audio Spectrum Generator`
- Window title: `Audio Spectrum Generator`
- Web assets: `../dist`
- Dev URL: `http://localhost:5173`
- Namespace: `com.audiospectrum`
- Package manager: `cargo`

### **3. Copiar Configuração**

```bash
copy tauri.conf.json src-tauri\tauri.conf.json
```

### **4. Gerar Ícones**

```bash
npx tauri icon public\icon-512.png
```

### **5. Testar em Desenvolvimento**

```bash
npm run tauri:dev
```

### **6. Criar Executável**

```bash
npm run tauri:build
```

---

## 🎯 Comandos Úteis

### **Modo Desenvolvimento (com hot-reload)**
```bash
npm run tauri:dev
```

### **Build para Windows**
```bash
npm run tauri:build
```

### **Limpar Build Anterior**
```bash
cd src-tauri
cargo clean
cd ..
```

### **Build com Debug**
```bash
npx tauri build --debug
```

---

## 📦 Tamanho do Executável

- **Executável standalone:** ~5-10 MB
- **Instalador MSI:** ~8-15 MB
- **Instalador NSIS:** ~7-12 MB

Muito menor que Electron (150+ MB)! 🎉

---

## 🐛 Solução de Problemas

### **Erro: "rustc" não encontrado**
```bash
# Reinstale Rust
# Acesse: https://rustup.rs/
```

### **Erro: "cl.exe" não encontrado**
```bash
# Instale Visual Studio Build Tools
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Selecione "Desenvolvimento para desktop com C++"
```

### **Erro: Permissão negada**
```bash
# Execute o terminal como Administrador
```

### **Build muito lento**
```bash
# Normal na primeira vez (5-15 minutos)
# Próximos builds serão rápidos
```

---

## ✅ Checklist

- [ ] Rust instalado (`rustc --version`)
- [ ] Visual Studio Build Tools instalado
- [ ] `npm install --save-dev @tauri-apps/cli @tauri-apps/api` executado
- [ ] `npx tauri init` executado
- [ ] `tauri.conf.json` copiado para `src-tauri/`
- [ ] Ícones gerados
- [ ] `npm run tauri:dev` funcionando
- [ ] `npm run tauri:build` gerou o executável

---

## 📚 Mais Informações

- **Guia Completo:** Leia `TAURI_WINDOWS_GUIDE.md`
- **Documentação Tauri:** https://tauri.app/v1/guides/
- **Exemplos:** https://github.com/tauri-apps/tauri/tree/dev/examples

---

## 🎉 Pronto!

Agora você tem um executável Windows nativo do Audio Spectrum Generator!

**Distribua o arquivo `.msi` ou `.exe` para seus usuários!** 🚀
