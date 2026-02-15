@echo off
echo ==========================================
echo   Installing Authentication System
echo ==========================================
echo.

cd back-end

echo [1/2] Installing new dependencies...
pip install python-jose[cryptography] argon2-cffi passlib
echo.

echo [2/2] Creating Super Admin...
python create_super_admin.py
echo.

echo ==========================================
echo   Installation Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Restart the backend: pm2 restart gold-backend
echo 2. Test login at: http://localhost:8000/docs
echo 3. Read AUTH_GUIDE.md for full documentation
echo.
pause
