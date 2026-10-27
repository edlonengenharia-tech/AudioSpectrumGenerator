@echo off
chcp 65001 >nul
title Audio Spectrum Generator - Build Electron
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Build com Electron
echo ================================================================
echo.

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

echo [2/5] Instalando dependencias do Electron...
call npm install --save-dev electron electron-builder
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar Electron
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

echo [3/5] Gerando build do Vite...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha no build do Vite
    pause
    exit /b 1
)
echo [OK] Build do Vite concluido
echo.

echo [4/5] Preparando arquivos do Electron...
if not exist "dist" (
    echo [ERRO] Pasta dist nao encontrada!
    pause
    exit /b 1
)

echo [OK] Arquivos prontos
echo.

echo [5/5] Criando executavel Windows...
echo.
echo Isso pode levar alguns minutos...
echo.

call npm run electron:build

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo   BUILD CONCLUIDO COM SUCESSO!
    echo ================================================================
    echo.
    echo Executavel disponivel em:
    echo.
    echo   release\
    echo.
    echo Arquivos gerados:
    echo   - Audio Spectrum Generator Setup 1.0.0.exe (Instalador)
    echo   - Audio Spectrum Generator 1.0.0.exe (Versao portavel)
    echo.

    set /p choice="Deseja abrir a pasta do executavel? (S/N): "
    if /i "%choice%"=="S" (
        explorer "release"
    )
) else (
    echo.
    echo ================================================================
    echo   ERRO NO BUILD
    echo ================================================================
    echo.
    echo Verifique os erros acima.
    echo.
)

echo.
pause
