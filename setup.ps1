# Nepal Election Analysis - Quick Start Script
# Run this script to set up and start both backend and frontend

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Nepal Election Analysis - Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Natraj Technology\Web Dev\Election Analysis"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Backend Setup
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow

Set-Location "$projectRoot\backend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
}

# Convert shapefile if not already done
if (-not (Test-Path "data\nepal-units.geojson")) {
    Write-Host "Converting shapefile to GeoJSON..." -ForegroundColor Cyan
    npm run convert
} else {
    Write-Host "✓ GeoJSON file already exists" -ForegroundColor Green
}

# Start backend in new window
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$projectRoot\backend'; " + `
    "Write-Host '=================================' -ForegroundColor Green; " + `
    "Write-Host 'Backend Server Starting...' -ForegroundColor Green; " + `
    "Write-Host '=================================' -ForegroundColor Green; " + `
    "npm start"

Write-Host "✓ Backend started in new window" -ForegroundColor Green

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Frontend Setup
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Yellow

Set-Location "$projectRoot\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
}

# Start frontend in new window
Write-Host "Starting frontend development server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd '$projectRoot\frontend'; " + `
    "Write-Host '=================================' -ForegroundColor Green; " + `
    "Write-Host 'Frontend Server Starting...' -ForegroundColor Green; " + `
    "Write-Host '=================================' -ForegroundColor Green; " + `
    "npm run dev"

Write-Host "✓ Frontend started in new window" -ForegroundColor Green

# Wait a bit
Start-Sleep -Seconds 3

# Display success message
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Two new PowerShell windows have been opened:" -ForegroundColor Yellow
Write-Host "  1. Backend server (port 5000)" -ForegroundColor White
Write-Host "  2. Frontend server (port 3000)" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
