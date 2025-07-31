@echo off
echo Testing KBS Setup...
echo.

echo Testing Backend Health Check...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo ❌ Backend not responding on port 5000
    echo Trying port 5001...
    curl -s http://localhost:5001/api/health
)
echo.
echo.

echo Testing Backend Items Endpoint...
curl -s http://localhost:5000/api/items
if %errorlevel% neq 0 (
    echo ❌ Items endpoint not responding on port 5000
    echo Trying port 5001...
    curl -s http://localhost:5001/api/items
)
echo.
echo.

echo Testing Frontend (if running)...
curl -s -I http://localhost:3000 | findstr "200 OK" > nul
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on http://localhost:3000
) else (
    echo ⚠️  Frontend not running. Start with: npm start
)
echo.

echo Setup test complete!
echo.
echo If you see JSON responses above, your backend is working correctly!
echo Open http://localhost:3000 in your browser to test the full application.
echo.
pause