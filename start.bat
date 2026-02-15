@echo off
cd /d %~dp0
TITLE Gold Project Self-Healing Runner
echo ==========================================
echo    Gold Project: PM2 Smart Runner
echo ==========================================
echo.

echo [1/3] Cleaning up old processes...
:: Kill existing node/python/uvicorn processes to free up ports
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM uvicorn.exe /T 2>nul
:: Cleanup Next.js lock if exists
if exist front-end\.next\dev\lock del /f /q front-end\.next\dev\lock 2>nul
echo Done.

echo.
echo [2/3] Initializing Self-Healing System (PM2)...
:: Start PM2 processes using the ecosystem configuration
:: This will manage both backend (with venv) and frontend (dev/cluster)
call pm2 start ecosystem.config.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PM2 failed to start. Please ensure PM2 is installed: npm install -g pm2
    pause
    exit /b %ERRORLEVEL%
)

echo [3/4] Saving PM2 state...
:: Save current processes so they persist
call pm2 save
echo Done.

echo.
echo [4/4] Starting Cloudflare Tunnel (Bridge to Vercel)...
:: This opens a public URL that points to your local backend on port 8000
start "Cloudflare Tunnel" cmd /k "npx cloudflared tunnel --url http://localhost:8000"
echo Done. Tunnel window is now open.

echo.
echo ==========================================
echo PROJECT STATUS: ONLINE (Managed by PM2)
echo ==========================================
echo.
echo ID │ Name           │ Status
echo ---│----------------│---------
call pm2 status
echo.
echo Local Frontend:   http://localhost:3000/
echo Backend API Docs: http://localhost:8000/docs
echo.
echo To see logs:      pm2 logs
echo To stop project:    pm2 stop ecosystem.config.js
echo.
echo ==========================================
pause
