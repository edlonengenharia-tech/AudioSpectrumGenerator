@echo off
title Audio Spectrum Generator - Instalador Tauri
color 0A

echo.
echo ================================================================
echo   Audio Spectrum Generator - Instalador Tauri para Windows
echo ================================================================
echo.
echo   Este script ira:
echo   1. Verificar dependencias
echo   2. Instalar Tauri CLI
echo   3. Configurar o projeto
echo   4. Compilar o executavel
echo ================================================================
echo.

REM Verificar Node.js
echo [1/6] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% encontrado
echo.

REM Verificar Rust
echo [2/6] Verificando Rust...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Rust nao encontrado!
    echo.
    echo Por favor, instale Rust:
    echo 1. Acesse: https://rustup.rs/
    echo 2. Baixe e execute o instalador
    echo 3. Reinicie este script
    echo.
    echo Abrindo pagina de download...
    start https://rustup.rs/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('rustc --version') do set RUST_VERSION=%%i
echo [OK] %RUST_VERSION% encontrado
echo.

REM Verificar Cargo
echo [3/6] Verificando Cargo...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Cargo nao encontrado!
    echo Por favor, reinstale Rust.
    pause
    exit /b 1
)
echo [OK] Cargo encontrado
echo.

REM Instalar dependencias npm
echo [4/6] Instalando dependencias do Tauri...
call npm install --save-dev @tauri-apps/cli @tauri-apps/api
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias npm
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

REM Verificar se src-tauri existe
if not exist "src-tauri" (
    echo [5/6] Inicializando Tauri...
    echo.
    echo Responda as perguntas:
    echo - App name: Audio Spectrum Generator
    echo - Window title: Audio Spectrum Generator
    echo - Web assets: ../dist
    echo - Dev URL: http://localhost:5173
    echo - Namespace: com.audiospectrum
    echo - Package manager: cargo
    echo.
    call npx tauri init
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao inicializar Tauri
        pause
        exit /b 1
    )
) else (
    echo [5/6] Tauri ja inicializado
)
echo.

REM Copiar configuracao
echo [6/6] Configurando projeto...
if exist "tauri.conf.json" (
    copy /Y "tauri.conf.json" "src-tauri\tauri.conf.json" >nul
    echo [OK] Configuracao copiada
) else (
    echo [AVISO] Arquivo tauri.conf.json nao encontrado
    echo Configure manualmente: src-tauri\tauri.conf.json
)
echo.

REM Gerar icones
echo Gerando icones...
if exist "public\icon-512.png" (
    if not exist "src-tauri\icons" mkdir src-tauri\icons
    copy /Y "public\icon-512.png" "src-tauri\app-icon.png" >nul
    call npx tauri icon src-tauri\app-icon.png
    echo [OK] Icones gerados
) else (
    echo [AVISO] Imagem do icone nao encontrada
    echo Pule esta etapa ou adicione uma imagem em: public\icon-512.png
)
echo.

echo ================================================================
echo   Instalacao concluida com sucesso!
echo ================================================================
echo.
echo Proximos passos:
echo.
echo 1. Para testar em desenvolvimento:
echo    npm run tauri:dev
echo.
echo 2. Para criar o executavel final:
echo    npm run tauri:build
echo.
echo 3. O executavel sera gerado em:
echo    src-tauri\target\release\bundle\
echo.
echo ================================================================
echo.

set /p choice="Deseja criar o executavel agora? (S/N): "
if /i "%choice%"=="S" (
    echo.
    echo Iniciando build...
    echo Isso pode levar alguns minutos na primeira vez...
    echo.
    call npm run tauri:build
    if %errorlevel% equ 0 (
        echo.
        echo ================================================================
        echo   BUILD CONCLUIDO COM SUCESSO!
        echo ================================================================
        echo.
        echo Executavel disponivel em:
        echo src-tauri\target\release\bundle\
        echo.
        explorer "src-tauri\target\release\bundle"
    ) else (
        echo.
        echo [ERRO] Falha no build
        echo Verifique os erros acima e tente novamente
    )
)

echo.
pause
