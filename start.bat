@echo off
echo Starting Veridia Hiring Platform...

echo Step 1: Starting Backend Server...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Step 2: Starting Frontend Server...
timeout /t 10 /nobreak
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo Admin Login: admin@veridia.com / admin123
echo.
pause
