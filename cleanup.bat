@echo off
echo Cleaning up unnecessary files...

REM Remove duplicate database files
del create-database.sql 2>nul
del database-setup.sql 2>nul
del setup.bat 2>nul
del test-connection.md 2>nul

echo Cleanup complete!
pause
