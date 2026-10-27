# ✅ Problema da Janela em Branco - CORRIGIDO!

## O Problema

O executável era criado, mas ao executar, aparecia apenas uma janela em branco.

## Causa

O Vite estava gerando caminhos absolutos (começando com `/`) para os arquivos JS e CSS, mas o Electron precisa de caminhos relativos (começando com `./`).

## Correções Aplicadas

### 1. vite.config.js
Adicionado `base: './'` para gerar caminhos relativos:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',  // ← ADICIONADO
  // ...
});
```

### 2. electron-main.cjs
Adicionados logs de debug e verificação de arquivos:

```javascript
// Verificar se o arquivo existe
if (!fs.existsSync(htmlPath)) {
    console.error('ERRO: Arquivo não encontrado:', htmlPath);
    // ...
}

console.log('Carregando:', htmlPath);

// Log de erros do renderer
win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Falha ao carregar:', errorCode, errorDescription);
});
```

## Como Usar

### Opção 1: Build Corrigido (Recomendado)

```bash
build-electron-fixed.bat
```

Este script:
- ✅ Verifica dependências
- ✅ Gera build com caminhos relativos
- ✅ Cria executável
- ✅ Mostra correções aplicadas

### Opção 2: Teste em Desenvolvimento (Debug)

```bash
test-electron.bat
```

Este script:
- ✅ Roda o Electron em modo desenvolvimento
- ✅ Mostra logs no console
- ✅ Ajuda a diagnosticar problemas
- ✅ Abre DevTools automaticamente (se configurado)

## Onde Encontrar o Executável

Após o build:

```
release\
├── Audio Spectrum Generator Setup 1.0.0.exe  (Instalador)
└── Audio Spectrum Generator 1.0.0.exe        (Portátil)
```

## Se Ainda Tiver Problemas

### 1. Execute o teste em desenvolvimento:

```bash
test-electron.bat
```

Isso vai mostrar logs detalhados no console.

### 2. Verifique os logs:

Procure por mensagens como:
- `Carregando: C:\...\dist\index.html`
- `ERRO: Arquivo não encontrado`
- `Falha ao carregar: ...`

### 3. Verifique o dist/index.html:

Abra o arquivo `dist/index.html` no navegador. Se funcionar no navegador, o problema é no Electron.

### 4. Habilite o DevTools:

No arquivo `electron-main.cjs`, descomente esta linha:

```javascript
win.webContents.openDevTools();
```

Isso vai abrir o DevTools para ver erros no console do navegador.

## Arquivos Corrigidos

- ✅ `vite.config.js` - Adicionado `base: './'`
- ✅ `electron-main.cjs` - Adicionados logs e verificações
- ✅ `build-electron-fixed.bat` - Script de build corrigido
- ✅ `test-electron.bat` - Script de teste/debug

## Resumo

Execute `build-electron-fixed.bat` para criar o executável com as correções aplicadas. Se ainda tiver problemas, use `test-electron.bat` para ver os logs de debug.

---

**Execute `build-electron-fixed.bat` agora!** 🚀
