# 🚀 Quick Reference Card

## ⚡ Quick Start Commands

### 🎯 One-Command Setup (Easiest!)
```powershell
.\setup.ps1
```
This handles everything automatically!

---

## 📁 Navigate to Project
```powershell
cd "d:\Natraj Technology\Web Dev\Election Analysis"
```

---

## 🔧 Backend Commands

### Setup & Start
```powershell
cd backend
npm install                 # Install dependencies
npm run convert            # Convert shapefile to GeoJSON
npm start                  # Start production server
npm run dev               # Start development server (auto-reload)
```

### Useful Scripts
```powershell
node src/scripts/convertShapefile.js    # Manual conversion
```

---

## 💻 Frontend Commands

### Setup & Start
```powershell
cd frontend
npm install                # Install dependencies
npm run dev               # Start development server
npm run build             # Build for production
npm start                 # Start production server
npm run lint              # Run linter
```

---

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📡 API Endpoints Quick Reference

```bash
# Get all Nepal units (GeoJSON)
curl http://localhost:5000/api/nepal-units

# Get statistics
curl http://localhost:5000/api/statistics

# Search by name
curl http://localhost:5000/api/search?q=Kathmandu

# Filter by type
curl http://localhost:5000/api/search?type=Metropolitan

# Filter by district
curl http://localhost:5000/api/search?district=Kathmandu

# Get unit by ID
curl http://localhost:5000/api/nepal-units/0
```

---

## 🔍 Troubleshooting Commands

### Check Node.js Version
```powershell
node --version              # Should be v18+
npm --version               # Check npm version
```

### Check if Ports are in Use
```powershell
# Check port 3000 (frontend)
netstat -ano | findstr :3000

# Check port 5000 (backend)
netstat -ano | findstr :5000
```

### Kill Process on Port (if needed)
```powershell
# Find process ID
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Clear npm Cache
```powershell
npm cache clean --force
npm install
```

### Reinstall Dependencies
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📦 Production Build Commands

### Build Frontend
```powershell
cd frontend
npm run build              # Creates optimized production build
npm start                  # Runs production server
```

### Build Both
```powershell
# Terminal 1 - Backend
cd backend
npm install --production
npm start

# Terminal 2 - Frontend
cd frontend
npm run build
npm start
```

---

## 🔄 Git Commands (if using Git)

```powershell
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Nepal Election Analysis GIS Map"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

---

## 🛠️ Development Workflow

### Start Development Session
```powershell
# 1. Open VS Code
code "d:\Natraj Technology\Web Dev\Election Analysis"

# 2. Open two terminals in VS Code

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### After Making Changes
```powershell
# Frontend changes are hot-reloaded automatically
# Backend changes are auto-reloaded (with nodemon)

# If you need to restart:
# Ctrl+C to stop, then npm run dev again
```

---

## 📊 Testing the Application

### Test Backend
```powershell
# Health check
curl http://localhost:5000/health

# Test API
curl http://localhost:5000/api/nepal-units | ConvertFrom-Json
```

### Test Frontend
1. Open browser to http://localhost:3000
2. Check if map loads
3. Try hovering over regions
4. Click on regions to see popups
5. Use the control panel filters

---

## 🎨 Common Customizations

### Change Backend Port
Edit `backend/.env`:
```env
PORT=8000
```

### Change Frontend Port
```powershell
npm run dev -- -p 3001
```

### Modify Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      nepal: {
        crimson: '#YOUR_COLOR',
        blue: '#YOUR_COLOR',
      },
    },
  },
}
```

---

## 🐛 Common Issues & Fixes

### Issue: "npm not found"
```powershell
# Install Node.js from https://nodejs.org/
# Restart your terminal
```

### Issue: "Port already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Cannot find module"
```powershell
# Reinstall dependencies
cd backend  # or frontend
npm install
```

### Issue: "Shapefile not found"
```powershell
# Make sure the shapefile exists
dir "frontend\NepalLocalUnits0\NepalLocalUnits0.shp"

# If missing, check the additional_files folder
```

### Issue: "Map not loading"
1. Check backend is running (http://localhost:5000/health)
2. Check browser console for errors
3. Clear browser cache
4. Restart both servers

### Issue: "GeoJSON conversion failed"
```powershell
cd backend
npm run convert
# Check the output for errors
```

---

## 📝 Quick Notes

### Environment Files
- Backend: `backend/.env`
- Frontend: `frontend/.env.local` (optional)

### Configuration Files
- Next.js: `frontend/next.config.js`
- TypeScript: `frontend/tsconfig.json`
- Tailwind: `frontend/tailwind.config.js`

### Key Directories
- Frontend source: `frontend/pages/`, `frontend/components/`
- Backend source: `backend/src/`
- GIS data: `frontend/NepalLocalUnits0/`
- Generated data: `backend/data/`

---

## 🎯 Quick Checks

### Is everything working?
```powershell
# 1. Backend running?
curl http://localhost:5000/health

# 2. Frontend running?
# Open http://localhost:3000 in browser

# 3. GeoJSON exists?
dir "backend\data\nepal-units.geojson"

# 4. Dependencies installed?
dir "backend\node_modules"
dir "frontend\node_modules"
```

---

## 🚀 Deploy to Production

### Vercel (Frontend)
```powershell
cd frontend
npm install -g vercel
vercel
```

### Heroku (Backend)
```powershell
cd backend
heroku create
git push heroku main
```

---

## 📞 Help Resources

- **Documentation**: See README.md, SETUP.md, ARCHITECTURE.md
- **Project Structure**: See PROJECT_STRUCTURE.md
- **Summary**: See PROJECT_SUMMARY.md

---

## ⌨️ Keyboard Shortcuts

### VS Code
- `Ctrl + `` - Toggle terminal
- `Ctrl + Shift + `` - New terminal
- `Ctrl + C` - Stop running process
- `Ctrl + P` - Quick file open

### Browser (Map Controls)
- **Mouse Wheel** - Zoom in/out
- **Click + Drag** - Pan map
- **Hover** - Highlight region
- **Click** - View details

---

**💡 Pro Tip**: Keep this file open while developing for quick command reference!

---

*Last Updated: January 2026*  
*Nepal Election Analysis GIS Map*  
*Natraj Technology*
