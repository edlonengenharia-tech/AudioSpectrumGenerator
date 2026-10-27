@echo off
title Audio Spectrum Generator - Criar Icones e Build
color 0B

echo.
echo ================================================================
echo   Audio Spectrum Generator - Criar Icones e Build
echo ================================================================
echo.

echo [1/3] Criando icones...
node create-icons.js
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao criar icones
    pause
    exit /b 1
)
echo.

echo [2/3] Verificando icones...
if not exist "src-tauri\icons\icon.ico" (
    echo [ERRO] icon.ico nao foi criado!
    pause
    exit /b 1
)
echo [OK] Icones criados com sucesso
echo.

echo [3/3] Iniciando build...
echo.
echo Isso pode levar alguns minutos...
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
    echo Verifique os erros acima.
    echo.
)

echo.
pause
