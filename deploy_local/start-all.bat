@echo off
set RETRIES=30
set RETRY_TIMER=5
set "PROJECT_ROOT=%CD%"

echo Checking for existing processes on ports 27018, 3000, 3001...
for %%p in (27018 3000 3001) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":%%p" ^| find "LISTENING"') do (
        echo Killing process on port %%p...
        taskkill /PID %%a /F
    )
)

echo Starting MongoDB...
start "MongoDB" "mongod" --dbpath "%PROJECT_ROOT%\data" --wiredTigerCacheSizeGB=0.5 --port 27018
echo Waiting for MongoDB to start...
timeout /t %RETRY_TIMER%
:CHECK_MONGO
netstat -an | find "27018" | find "LISTENING" >nul
if %ERRORLEVEL%==0 (
    echo MongoDB is running on port 27018
    goto CONTINUE_MONGO
)
set /a RETRIES-=1
if %RETRIES%==0 (
    echo MongoDB failed to start after 5 retries
    exit /b 1
)
echo Waiting for MongoDB... Retry %RETRIES%
timeout /t %RETRY_TIMER%
goto CHECK_MONGO
:CONTINUE_MONGO
echo MongoDB started...

echo Starting Server (API, Files, React)...
start "Server" cmd /c "cd /d "%PROJECT_ROOT%\server" && npm start"
timeout /t %RETRY_TIMER%
:CHECK_SERVER
netstat -an | find "3001" | find "LISTENING" >nul
if %ERRORLEVEL%==0 (
    echo Server is running on port 3001
    goto CONTINUE_SERVER
)
set /a RETRIES-=1
if %RETRIES%==0 (
    echo Server failed to start after 5 retries
    exit /b 1
)
echo Waiting for Server... Retry %RETRIES%
timeout /t %RETRY_TIMER%
goto CHECK_SERVER
:CONTINUE_SERVER
echo Server started...

echo Starting Client (API, Files, React)...
start "Client" cmd /c "cd /d "%PROJECT_ROOT%\client" && npm start"
timeout /t 10
:CHECK_CLIENT
netstat -an | find "3000" | find "LISTENING" >nul
if %ERRORLEVEL%==0 (
    echo Client is running on port 3000
    goto CONTINUE_CLIENT
)
set /a RETRIES-=1
if %RETRIES%==0 (
    echo Client failed to start after 5 retries
    exit /b 1
)
echo Waiting for Client... Retry %RETRIES%
timeout /t %RETRY_TIMER%
goto CHECK_CLIENT
:CONTINUE_CLIENT
echo Client started...

echo All services started.