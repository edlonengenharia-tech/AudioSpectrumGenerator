@echo off
title Audio Spectrum Generator - Diagnostico
color 0E

echo.
echo ================================================================
echo   DIAGNOSTICO DO PROJETO TAURI
echo ================================================================
echo.

echo [1/6] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i
)
echo.

echo [2/6] Verificando Rust...
where rustc >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Rust nao encontrado!
) else (
    for /f "tokens=*" %%i in ('rustc --version') do echo [OK] %%i
)
echo.

echo [3/6] Verificando Cargo...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Cargo nao encontrado!
) else (
    echo [OK] Cargo encontrado
)
echo.

echo [4/6] Verificando arquivos Tauri...
if exist "src-tauri\Cargo.toml" (
    echo [OK] src-tauri\Cargo.toml encontrado
) else (
    echo [ERRO] src-tauri\Cargo.toml NAO encontrado!
)

if exist "src-tauri\tauri.conf.json" (
    echo [OK] src-tauri\tauri.conf.json encontrado
) else (
    echo [ERRO] src-tauri\tauri.conf.json NAO encontrado!
)

if exist "src-tauri\src\main.rs" (
    echo [OK] src-tauri\src\main.rs encontrado
) else (
    echo [ERRO] src-tauri\src\main.rs NAO encontrado!
)

if exist "src-tauri\build.rs" (
    echo [OK] src-tauri\build.rs encontrado
) else (
    echo [ERRO] src-tauri\build.rs NAO encontrado!
)
echo.

echo [5/6] Verificando Tauri CLI...
if exist "node_modules\@tauri-apps\cli" (
    echo [OK] Tauri CLI instalado
    for /f "tokens=*" %%i in ('npm list @tauri-apps/cli 2^>nul ^| findstr @tauri-apps/cli') do echo      %%i
) else (
    echo [AVISO] Tauri CLI nao instalado
)
echo.

echo [6/6] Testando compilacao Rust...
cd src-tauri
cargo check 2>nul
if %errorlevel% equ 0 (
    echo [OK] Codigo Rust compila corretamente
) else (
    echo [ERRO] Erro na compilacao Rust
    echo.
    echo Tentando mostrar o erro:
    cargo check
)
cd ..
echo.

echo ================================================================
echo   DIAGNOSTICO CONCLUIDO
echo ================================================================
echo.
echo SOLUCAO RECOMENDADA:
echo.
echo Execute: build-direto.bat
echo.
echo Este script usa "cargo build --release" diretamente,
echo evitando o problema do Tauri CLI.
echo.
echo Leia tambem: GUIA_FINAL.txt
echo.
pause
