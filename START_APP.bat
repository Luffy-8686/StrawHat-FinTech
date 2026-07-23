@echo off
title CreditVision - FinTech App Launcher
color 0A

echo.
echo  ============================================
echo    CreditVision FinTech App - Starting...
echo  ============================================
echo.

:: Set Node.js path
set PATH=C:\Program Files\nodejs;%PATH%

echo  [1/2] Starting Backend API Server (port 5000)...
start "CreditVision - Backend API" cmd /k "cd /d %~dp0server && node src/index.js"

:: Small delay so backend starts first
timeout /t 2 /nobreak > nul

echo  [2/2] Starting Frontend React App (port 5173)...
start "CreditVision - Frontend" cmd /k "cd /d %~dp0client && node \"C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js\" run dev"

:: Wait a moment then open browser
timeout /t 4 /nobreak > nul

echo.
echo  ============================================
echo    Both servers started!
echo    Opening http://localhost:5173 ...
echo  ============================================
echo.

start "" "http://localhost:5173"

echo  You can close this window. Keep the other two windows open.
pause
