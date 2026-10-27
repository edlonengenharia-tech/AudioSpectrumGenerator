@echo off
title Audio Spectrum Generator - Build Direto
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Build Direto Tauri
echo ================================================================
echo.

REM Verificar se estamos na pasta correta
if not exist "src-tauri\Cargo.toml" (
    echo [ERRO] src-tauri\Cargo.toml nao encontrado!
    echo Execute primeiro: instalar-tauri.bat
    pause
    exit /b 1
)

echo [1/3] Limpando build anterior...
cd src-tauri
if exist "target" (
    cargo clean
    echo [OK] Build limpo
) else (
    echo [OK] Nenhum build anterior
)
cd ..
echo.

echo [2/3] Verificando configuracao...
if not exist "src-tauri\tauri.conf.json" (
    echo [ERRO] src-tauri\tauri.conf.json nao encontrado!
    pause
    exit /b 1
)
echo [OK] Configuracao encontrada
echo.

echo [3/3] Iniciando build...
echo.
echo Isso pode levar 5-15 minutos na primeira vez...
echo.

cd src-tauri
cargo build --release
cd ..

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo   BUILD CONCLUIDO COM SUCESSO!
    echo ================================================================
    echo.
    echo Executavel PORTABLE disponivel em:
    echo.
    echo   src-tauri\target\release\audio-spectrum-generator.exe
    echo.
    echo Este arquivo pode ser copiado para qualquer computador Windows
    echo e executado diretamente, sem necessidade de instalacao!
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
    echo Verifique os erros acima.
    echo.
    echo Possiveis solucoes:
    echo.
    echo 1. Verifique se o Visual Studio Build Tools esta instalado
    echo    https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo.
    echo 2. Limpe o build e tente novamente:
    echo    cd src-tauri
    echo    cargo clean
    echo    cargo build --release
    echo.
)

echo.
pause
