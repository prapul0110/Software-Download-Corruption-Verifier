@echo off
echo ============================================================
echo Starting Software Download Corruption Verifier Backend
echo ============================================================
cd /d "%~dp0"

WHERE python >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    WHERE py >nul 2>nul
    IF %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Python is not installed or not added to PATH.
        echo Please install Python from https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

IF NOT EXIST ".venv" (
    echo Creating virtual environment...
    python -m venv .venv 2>nul || py -m venv .venv 2>nul
)

echo Installing requirements...
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m pip install -r requirements.txt
    echo.
    echo Launching Flask server on http://localhost:5000...
    ".venv\Scripts\python.exe" app.py
) else (
    python -m pip install -r requirements.txt 2>nul || py -m pip install -r requirements.txt
    echo.
    echo Launching Flask server on http://localhost:5000...
    python app.py 2>nul || py app.py
)

pause
