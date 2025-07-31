@echo off
echo Starting KBS Development Environment...
echo.

echo Checking for existing processes...
tasklist /fi "imagename eq node.exe" /fo table | findstr node.exe > nul
if %errorlevel% equ 0 (
    echo Found existing Node.js processes. Cleaning up...
    taskkill /f /im node.exe > nul 2>&1
    timeout /t 2 /nobreak > nul
)

echo Starting Backend Server...
start "KBS Backend" cmd /k "cd kbs-backend && npm run dev"

timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "KBS Frontend" cmd /k "cd kbs-frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:3000
echo.
echo Wait for both servers to fully start, then:
echo 1. Open http://localhost:3000 in your browser
echo 2. Test the API at http://localhost:5000/api/health
echo.
pause