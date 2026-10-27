@echo off
title Audio Spectrum Generator - Criar Portable
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Criando Versao Portable
echo ================================================================
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
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
echo [2/5] Verificando Rust...
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

REM Verificar Cargo.toml na raiz
echo [3/5] Verificando configuracao Cargo...
if not exist "Cargo.toml" (
    echo [ERRO] Cargo.toml nao encontrado na raiz!
    echo Criando arquivo...
    echo [workspace] > Cargo.toml
    echo members = ["src-tauri"] >> Cargo.toml
    echo resolver = "2" >> Cargo.toml
    echo [OK] Cargo.toml criado
) else (
    echo [OK] Cargo.toml encontrado
)
echo.

REM Verificar Tauri
echo [4/5] Verificando Tauri...
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
if not exist "src-tauri\Cargo.toml" (
    echo [ERRO] src-tauri nao configurado!
    echo Execute primeiro: instalar-tauri.bat
    pause
    exit /b 1
)
echo.

REM Build
echo [5/5] Criando executavel portable...
echo.
echo Isso pode levar alguns minutos na primeira vez...
echo.
call npm run tauri:build

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo   BUILD CONCLUIDO COM SUCESSO!
    echo ================================================================
    echo.
    echo Executavel PORTABLE disponivel em:
    echo.
    echo   src-tauri\target\release\Audio Spectrum Generator.exe
    echo.
    echo Este arquivo pode ser copiado para qualquer computador Windows
    echo e executado diretamente, sem necessidade de instalacao!
    echo.
    echo Instaladores tambem disponiveis em:
    echo   src-tauri\target\release\bundle\
    echo.

    set /p choice="Deseja abrir a pasta do executavel? (S/N): "
    if /i "%choice%"=="S" (
        explorer "src-tauri\target\release"
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
