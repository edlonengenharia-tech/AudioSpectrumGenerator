@echo off
chcp 65001 >nul
title Audio Spectrum Generator - Build Electron (Corrigido)
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Build Electron (Corrigido)
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

echo [2/5] Verificando dependencias...
if not exist "node_modules\electron" (
    echo Instalando dependencias...
    call npm install --save-dev electron electron-builder
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias
        pause
        exit /b 1
    )
)
echo [OK] Dependencias verificadas
echo.

echo [3/5] Gerando build do Vite (com caminhos relativos)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha no build do Vite
    pause
    exit /b 1
)
echo [OK] Build do Vite concluido
echo.

echo [4/5] Verificando arquivos...
if not exist "dist\index.html" (
    echo [ERRO] Arquivo dist\index.html nao encontrado!
    pause
    exit /b 1
)
echo [OK] Arquivos verificados
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
    echo CORRECOES APLICADAS:
    echo   - Caminhos relativos no Vite (base: './')
    echo   - Logs de debug no Electron
    echo   - Verificacao de arquivos
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
