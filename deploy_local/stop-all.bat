@echo off
echo Stopping servers on ports 27018, 3001, and 3000...
for %%p in (27018 3001 3000) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":%%p" ^| find "LISTENING"') do (
        taskkill /PID %%a /F
    )
)
echo All servers found were stopped.