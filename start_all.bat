@echo off
echo ============================================================
echo Starting Software Download Corruption Verifier (Full Stack)
echo ============================================================

cd /d "%~dp0"

echo Launching Backend Server...
start "Backend API (Flask)" cmd /k "cd /d %~dp0\backend && run_backend.bat"

echo Launching Frontend Server...
start "Frontend UI (Vite)" cmd /k "cd /d %~dp0\frontend && run_frontend.bat"

echo.
echo Both servers launching...
echo Open http://localhost:5173 in your browser once ready!
echo ============================================================
