@echo off
echo Deploying Todo App to Vercel

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Vercel CLI is not installed. Installing now...
    call npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo You are not logged in to Vercel. Please log in first.
    call vercel login
)

REM Prompt for MongoDB URI
set /p MONGODB_URI=Enter your MongoDB Atlas connection string: 

REM Deploy to Vercel
echo Deploying to Vercel...
call vercel --prod

REM Add environment variable
echo Adding MongoDB URI as environment variable...
call vercel env add MONGODB_URI

echo Deployment complete! Your app should be live at the URL provided by Vercel.
pause 