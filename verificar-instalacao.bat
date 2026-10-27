@echo off
title Audio Spectrum Generator - Verificar Instalacao
color 0E

echo.
echo ================================================================
echo   VERIFICANDO INSTALACAO DO TAURI
echo ================================================================
echo.

echo [1/4] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js NAO encontrado!
    echo Instale em: https://nodejs.org/
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i
)
echo.

echo [2/4] Verificando Rust...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Rust NAO encontrado!
    echo Instale em: https://rustup.rs/
    echo.
    echo Deseja abrir a pagina de download? (S/N)
    set /p choice=
    if /i "%choice%"=="S" start https://rustup.rs/
) else (
    for /f "tokens=*" %%i in ('rustc --version') do echo [OK] %%i
)
echo.

echo [3/4] Verificando Cargo...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Cargo NAO encontrado!
) else (
    echo [OK] Cargo encontrado
)
echo.

echo [4/4] Verificando Tauri CLI...
if exist "node_modules\@tauri-apps\cli" (
    echo [OK] Tauri CLI instalado
) else (
    echo [AVISO] Tauri CLI nao instalado
    echo Execute: npm install --save-dev @tauri-apps/cli @tauri-apps/api
)
echo.

echo ================================================================
echo   VERIFICACAO CONCLUIDA
echo ================================================================
echo.

if exist "src-tauri" (
    echo [OK] Projeto Tauri inicializado
    echo.
    echo Proximo passo: npm run tauri:build
) else (
    echo [AVISO] Projeto Tauri nao inicializado
    echo.
    echo Proximo passo: npx tauri init
)

echo.
pause
