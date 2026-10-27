@echo off
title Audio Spectrum Generator - Build Windows
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Criando Executavel Windows
echo ================================================================
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado
echo.

REM Verificar Rust
echo [2/4] Verificando Rust...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Rust nao encontrado!
    echo Por favor, instale Rust em: https://rustup.rs/
    echo.
    echo Abrindo pagina de download...
    start https://rustup.rs/
    pause
    exit /b 1
)
echo [OK] Rust encontrado
echo.

REM Verificar Tauri
echo [3/4] Verificando Tauri...
if not exist "node_modules\@tauri-apps\cli" (
    echo Instalando Tauri CLI...
    call npm install --save-dev @tauri-apps/cli @tauri-apps/api
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar Tauri
        pause
        exit /b 1
    )
)
echo [OK] Tauri encontrado
echo.

REM Verificar src-tauri
if not exist "src-tauri" (
    echo [ERRO] Tauri nao inicializado!
    echo Execute primeiro: instalar-tauri.bat
    pause
    exit /b 1
)
echo.

REM Build
echo [4/4] Criando executavel Windows...
echo.
echo Isso pode levar alguns minutos...
echo.
call npx tauri build

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo   BUILD CONCLUIDO COM SUCESSO!
    echo ================================================================
    echo.
    echo Executavel disponivel em:
    echo.
    echo Instalador MSI:
    echo   src-tauri\target\release\bundle\msi\
    echo.
    echo Instalador NSIS:
    echo   src-tauri\target\release\bundle\nsis\
    echo.
    echo Executavel standalone:
    echo   src-tauri\target\release\
    echo.

    set /p choice="Deseja abrir a pasta do executavel? (S/N): "
    if /i "%choice%"=="S" (
        explorer "src-tauri\target\release\bundle"
    )
) else (
    echo.
    echo ================================================================
    echo   ERRO NO BUILD
    echo ================================================================
    echo.
    echo Possiveis solucoes:
    echo.
    echo 1. Verifique se o Visual Studio Build Tools esta instalado
    echo    https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo.
    echo 2. Limpe o build anterior:
    echo    cd src-tauri
    echo    cargo clean
    echo    cd ..
    echo.
    echo 3. Tente novamente
    echo.
)

echo.
pause
