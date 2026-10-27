const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'Audio Spectrum Generator',
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Caminho do arquivo HTML
    const htmlPath = path.join(__dirname, 'dist', 'index.html');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(htmlPath)) {
        console.error('ERRO: Arquivo não encontrado:', htmlPath);
        console.error('Conteúdo da pasta:', fs.readdirSync(__dirname));
        win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent('<h1>Erro: Arquivo não encontrado</h1><p>' + htmlPath + '</p>')}`);
        return;
    }

    console.log('Carregando:', htmlPath);
    
    // Carregar o arquivo HTML
    win.loadFile(htmlPath).catch(err => {
        console.error('Erro ao carregar HTML:', err);
    });

    // Abrir DevTools para debug (remover em produção)
    // win.webContents.openDevTools();

    // Remover menu bar
    win.setMenuBarVisibility(false);

    // Log de erros do renderer
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Falha ao carregar:', errorCode, errorDescription);
    });
}

app.whenReady().then(() => {
    console.log('Electron pronto');
    console.log('__dirname:', __dirname);
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
