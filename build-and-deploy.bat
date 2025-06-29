@echo off
echo ========================================
echo Building and Deploying Arrow Multimedia
echo ========================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

:: Build React Frontend
echo.
echo [1/4] Building React Frontend...
cd react-ts-frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install React dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build React app
    pause
    exit /b 1
)

:: Setup Express API
echo.
echo [2/4] Setting up Express API...
cd ..\express-ts-api
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install Express dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build Express API
    pause
    exit /b 1
)

:: Copy React build to Express static folder
echo.
echo [3/4] Deploying React build to Express...
if exist "public" rmdir /s /q "public"
mkdir "public"
xcopy "..\react-ts-frontend\build\*" "public\" /s /e /y
if %errorlevel% neq 0 (
    echo Error: Failed to copy React build files
    pause
    exit /b 1
)

:: Start the application
echo.
echo [4/4] Starting Arrow Multimedia Application...
echo.
echo Application will be available at: http://localhost:3001
echo Press Ctrl+C to stop the server
echo.
call npm run serve

pause