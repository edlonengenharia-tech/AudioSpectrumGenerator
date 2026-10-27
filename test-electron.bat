@echo off
chcp 65001 >nul
title Audio Spectrum Generator - Teste Electron
color 0E

echo.
echo ================================================================
echo   Audio Spectrum Generator - Teste em Desenvolvimento
echo ================================================================
echo.
echo Este script vai rodar o Electron em modo desenvolvimento
echo para mostrar logs e ajudar a diagnosticar problemas.
echo.

echo [1/3] Verificando build...
if not exist "dist\index.html" (
    echo Build nao encontrado. Gerando...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERRO] Falha no build
        pause
        exit /b 1
    )
)
echo [OK] Build encontrado
echo.

echo [2/3] Verificando electron-main.cjs...
if not exist "electron-main.cjs" (
    echo [ERRO] Arquivo electron-main.cjs nao encontrado!
    pause
    exit /b 1
)
echo [OK] Arquivo encontrado
echo.

echo [3/3] Iniciando Electron em modo desenvolvimento...
echo.
echo ================================================================
echo LOGS DO ELECTRON:
echo ================================================================
echo.

call npx electron .

echo.
echo ================================================================
echo Electron fechado.
echo ================================================================
echo.
pause
