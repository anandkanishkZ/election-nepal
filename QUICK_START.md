# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Bun (optional, can use npm)

## 1. Start Backend Server

```powershell
# Navigate to backend
cd "d:\Natraj Technology\Web Dev\Election Analysis\backend"

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

Backend will run on: **http://localhost:5000**

## 2. Start Frontend Development Server

```powershell
# Open new terminal
cd "d:\Natraj Technology\Web Dev\Election Analysis\frontend"

# Install dependencies (if not done)
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev
```

Frontend will run on: **http://localhost:5173** (or the port shown in terminal)

## 3. Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📊 Features Available

### 1. Dashboard (Home Page)
- **Real-time voter statistics**
- Total voters, gender distribution
- District and municipality counts
- Interactive charts with live data

### 2. Voter Search
- **Search across 18M+ voter records**
- Search by: Name (Nepali/English), Voter ID, Location
- Advanced filters: Province, Gender, District, Municipality
- Results show complete voter information

### 3. Election Results
- **Municipality-wise voter data**
- Gender breakdown (Male/Female counts)
- Average age statistics
- Gender ratio calculations

### 4. Comparative Analysis ⭐ NEW!
- **Compare two districts side-by-side**
- Select province → Select two districts → Compare
- Visual comparisons with charts
- Municipality-level breakdown
- Real-time statistics

### 5. GIS Map
- Interactive map of Nepal
- Administrative boundaries visualization

## 🔗 API Endpoints Quick Reference

### Health Check
```
GET http://localhost:5000/health
```

### Get Voter Statistics
```
GET http://localhost:5000/api/voter-statistics
```

### Search Voters
```
GET http://localhost:5000/api/voters/search/query?name=राम
```

### Get Provinces
```
GET http://localhost:5000/api/hierarchy/provinces
```

### Get Election Results
```
GET http://localhost:5000/api/election-results
```

## 🎯 Usage Examples

### Searching for Voters
1. Go to "Voter Search" page
2. Select search type (Name, Voter ID, or Location)
3. Enter search term in Nepali or English
4. Apply filters (optional): Province, Gender, District, Municipality
5. Click "Search"
6. View results in the table below

### Comparing Districts
1. Go to "Comparative Analysis" page
2. Select a Province from dropdown
3. Select District 1
4. Select District 2 (different from District 1)
5. Click "Compare"
6. View:
   - Summary statistics cards
   - Bar chart comparison
   - Gender distribution pie charts
   - Municipality-wise breakdown tables

## 🛠️ Troubleshooting

### Backend not starting?
- Check PostgreSQL is running
- Verify `.env` file in backend folder
- Check database credentials

### Frontend shows "Failed to fetch"?
- Ensure backend is running on port 5000
- Check `.env` file in frontend folder has `VITE_API_URL=http://localhost:5000/api`
- Clear browser cache and reload

### No data showing?
- Verify database has data
- Check backend terminal for errors
- Try health check: http://localhost:5000/health

## 📁 Project Structure

```
Election Analysis/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── server.js     # Main server file
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   └── models/       # Database queries
│   └── package.json
│
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript types
│   │   └── components/   # Reusable components
│   ├── .env              # Environment config
│   └── package.json
│
└── INTEGRATION.md        # Detailed integration docs
```

## 🎨 Key Features Implemented

✅ Real-time data from PostgreSQL database  
✅ Advanced voter search with multiple filters  
✅ District-to-district comparative analysis  
✅ Municipality-wise voter breakdown  
✅ Gender distribution visualization  
✅ Type-safe API integration  
✅ Error handling and loading states  
✅ Responsive design for all devices  

## 📊 Data Sources

- **Voter Data**: PostgreSQL database with 18M+ records
- **Geographic Hierarchy**: Provinces → Districts → Municipalities → Wards
- **Election Results**: Municipality-level aggregated data
- **Party Information**: Election Commission of Nepal data (static)

## 🔐 Security Notes

- Voter data is from Election Commission of Nepal
- Personal information may be masked for privacy
- Backend includes CORS protection
- Database queries use parameterized statements

## 📝 Next Steps

1. **Explore all pages** to see the integration
2. **Try the comparative analysis** feature
3. **Search for voters** using different filters
4. **View election results** by municipality
5. **Check the dashboard** for overall statistics

## 💡 Tips

- Use Nepali keyboard or copy-paste Nepali text for searching
- The system supports both Nepali and English names
- Comparative analysis works best with districts that have multiple municipalities
- Export features are prepared but need implementation

## 📞 Support

If you encounter any issues:
1. Check both backend and frontend terminals for errors
2. Verify database connection
3. Review the INTEGRATION.md file for detailed documentation
4. Check browser console for frontend errors

---

**Enjoy exploring the Nepal Election Analysis System! 🇳🇵**
