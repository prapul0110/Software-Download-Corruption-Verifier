@echo off
echo ============================================================
echo Starting Software Download Corruption Verifier Frontend
echo ============================================================
cd /d "%~dp0"

WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not installed or not added to PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

IF NOT EXIST "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo.
echo Launching Vite Dev Server on http://localhost:5173...
call npm run dev

pause
