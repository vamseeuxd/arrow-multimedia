@echo off
echo ========================================
echo Starting Arrow Multimedia in Dev Mode
echo ========================================

:: Start Express API in background
echo Starting Express API...
cd express-ts-api
start "Express API" cmd /k "npm start"

:: Wait a moment for API to start
timeout /t 3 /nobreak >nul

:: Start React Frontend
echo Starting React Frontend...
cd ..\react-ts-frontend
start "React Frontend" cmd /k "npm start"

echo.
echo Both services are starting...
echo React Frontend: http://localhost:3000
echo Express API: http://localhost:3001
echo.
pause