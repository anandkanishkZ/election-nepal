# Nepal Election Analysis - Setup Guide

## Quick Setup Script

Run this PowerShell script to set up everything automatically:

```powershell
# Navigate to the project root
cd "d:\Natraj Technology\Web Dev\Election Analysis"

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green
cd backend
npm install

# Convert shapefile to GeoJSON
Write-Host "Converting shapefile to GeoJSON..." -ForegroundColor Green
npm run convert

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Natraj Technology\Web Dev\Election Analysis\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Green
cd "../frontend"
npm install

# Start frontend
Write-Host "Starting frontend development server..." -ForegroundColor Green
Write-Host "Access the application at http://localhost:3000" -ForegroundColor Cyan
npm run dev
```

## Manual Setup Steps

### Step 1: Backend Setup

```bash
cd backend
npm install
npm run convert
npm start
```

Keep this terminal running.

### Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

### Step 3: Access Application

Open your browser and go to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Verification

1. ✅ Backend should show "Server running on http://localhost:5000"
2. ✅ Frontend should show "Ready in Xms"
3. ✅ Browser should display the Nepal GIS map
4. ✅ You should be able to interact with the map

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is in use:

**Backend:**
Edit `backend/.env` and change PORT=5000 to another port

**Frontend:**
Run: `npm run dev -- -p 3001` (or any other port)

### Shapefile Not Found

Ensure the shapefile exists at:
`frontend/NepalLocalUnits0/NepalLocalUnits0.shp`

And includes all components:
- NepalLocalUnits0.shp
- NepalLocalUnits0.dbf
- NepalLocalUnits0.prj
- NepalLocalUnits0.shx

### Dependencies Installation Fails

Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Still Having Issues?

1. Check Node.js version: `node --version` (should be v18+)
2. Check npm version: `npm --version`
3. Review error logs in the console
4. Check README.md for detailed documentation

## Next Steps

After successful setup:

1. Explore the interactive map
2. Try searching for different units
3. Change color schemes in the control panel
4. Review the API endpoints
5. Start customizing for your needs

Enjoy your Nepal GIS Election Analysis application! 🗺️🇳🇵
