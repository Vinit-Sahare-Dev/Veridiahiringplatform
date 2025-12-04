@echo off
echo Setting up Veridia Hiring Platform...

echo.
echo 1. Installing Backend Dependencies...
cd backend
call mvn clean install
if %errorlevel% neq 0 (
    echo Backend setup failed!
    pause
    exit /b 1
)

echo.
echo 2. Starting Backend Server...
start "Backend Server" cmd /k "mvn spring-boot:run"

echo.
echo 3. Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend setup failed!
    pause
    exit /b 1
)

echo.
echo 4. Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Setup Complete!
echo Backend running on: http://localhost:8080
echo Frontend running on: http://localhost:5173
echo.
echo Press any key to exit...
pause
