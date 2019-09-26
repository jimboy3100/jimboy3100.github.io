@echo off
:loop
node server
echo.
echo Press any key to restart server...
pause>nul
goto loop
