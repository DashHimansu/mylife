@echo off
title Birthday Surprise Server
cd /d "%~dp0"
if exist "birthday-surprise\index.html" (
    cd "birthday-surprise"
)

echo ===================================================
echo   Birthday Surprise Server is running!
echo   Open: http://localhost:8000
echo   Celebration preview: http://localhost:8000/?mode=birthday
echo   (Press Ctrl+C in this window to stop the server)
echo ===================================================

start http://localhost:8000

python -m http.server 8000 2>nul || py -3 -m http.server 8000
pause
