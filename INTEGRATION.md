# Frontend-Backend Integration Guide

## Overview
This document outlines the complete integration between the Nepal Election Analysis frontend (React + TypeScript) and backend (Node.js + PostgreSQL).

## Architecture

### Backend API Endpoints

#### 1. Voter Endpoints
- `GET /api/voters` - Get all voters with pagination
  - Query params: `limit`, `offset`
- `GET /api/voters/:id` - Get voter by ID
- `GET /api/voters/search/query` - Search voters
  - Query params: `name`, `district`, `province`, `municipality`, `gender`, `voter_id`
- `GET /api/voters/location/filter` - Filter voters by location
  - Query params: `district`, `municipality`
- `GET /api/voter-statistics` - Get voter statistics
  - Returns: total, byDistrict, byMunicipality, byGender, byAgeGroup

#### 2. Election Results Endpoints
- `GET /api/election-results` - Get election results
  - Query params: `municipality` (optional)
  - Returns: municipality-wise voter data with gender breakdown

#### 3. Hierarchy Endpoints
- `GET /api/hierarchy/provinces` - Get all provinces
- `GET /api/hierarchy/provinces/:provinceId/districts` - Get districts by province
- `GET /api/hierarchy/districts/:districtId/municipalities` - Get municipalities by district
- `GET /api/hierarchy/municipalities/:municipalityId/wards` - Get wards by municipality
- `GET /api/hierarchy/stats/:level/:id` - Get location statistics

#### 4. GIS Endpoints
- `GET /api/nepal-units` - Get Nepal units as GeoJSON
- `GET /api/nepal-units/:id` - Get specific unit by ID
- `GET /api/statistics` - Get GIS statistics
- `GET /api/search` - Search GIS units

#### 5. Database Info Endpoints
- `GET /api/database/info` - Get database information
- `GET /api/database/schema/:tableName` - Get table schema

### Frontend Structure

```
frontend/src/
├── services/
│   └── api.ts                    # API service layer
├── types/
│   └── index.ts                  # TypeScript interfaces
├── pages/
│   ├── Index.tsx                 # Dashboard with real stats
│   ├── VoterSearchPage.tsx       # Search with backend integration
│   ├── ElectionResultsPage.tsx  # Results from backend
│   └── ComparativeAnalysisPage.tsx # District comparison
└── .env                          # Environment configuration
```

## API Service (`frontend/src/services/api.ts`)

The API service provides a centralized interface for all backend calls:

```typescript
import api from "@/services/api";

// Example usage:
const stats = await api.voters.getStatistics();
const results = await api.electionResults.getAll();
const provinces = await api.hierarchy.getProvinces();
```

## Type Definitions (`frontend/src/types/index.ts`)

Type-safe interfaces for all data structures:
- `Voter` - Voter record structure
- `VoterStatistics` - Statistics aggregation
- `ElectionResult` - Election result data
- `Province`, `District`, `Municipality`, `Ward` - Geographic hierarchy
- `GISUnit` - GeoJSON structure
- `SearchParams` - Search parameters

## Pages Integration

### 1. Dashboard (Index.tsx)
- Fetches real voter statistics on mount
- Displays: total voters, gender distribution, age groups, districts, municipalities
- Charts receive real data from backend

### 2. Voter Search Page (VoterSearchPage.tsx)
- Real-time search across 18M+ voter records
- Supports search by: name (Nepali/English), voter ID, location
- Advanced filters: province, gender, district, municipality
- Displays: voter ID, name (Nepali), gender, age, location hierarchy
- Pagination support (100 records per search)

### 3. Election Results Page (ElectionResultsPage.tsx)
- Displays municipality-wise election data
- Shows: total voters, male/female breakdown, average age, gender ratio
- Search and filter capabilities
- Export to CSV functionality (ready for implementation)

### 4. Comparative Analysis Page (ComparativeAnalysisPage.tsx)
- **New Feature**: District-to-district comparison
- Dynamic province and district selection
- Side-by-side statistics comparison
- Visual charts: bar charts, pie charts for gender distribution
- Municipality-wise breakdown tables
- Real-time data from backend

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voter_db
DB_USER=postgres
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# or
bun install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# or
bun dev
```

## Testing the Integration

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Nepal Election Analysis API is running",
  "database": {
    "connected": true,
    "name": "voter_db"
  }
}
```

### 2. Test Voter Statistics
```bash
curl http://localhost:5000/api/voter-statistics
```

### 3. Test Voter Search
```bash
curl "http://localhost:5000/api/voters/search/query?name=राम"
```

### 4. Test Hierarchy
```bash
curl http://localhost:5000/api/hierarchy/provinces
```

### 5. Test Election Results
```bash
curl http://localhost:5000/api/election-results
```

## Features Implemented

### ✅ Real Data Integration
- All pages now fetch data from backend
- No more mock data (except for party information which comes from Election Commission)
- Type-safe API calls with proper error handling

### ✅ Voter Search
- Advanced search with multiple filters
- Real-time results from PostgreSQL database
- Support for Nepali Unicode
- Location-based filtering

### ✅ Statistics Dashboard
- Live voter counts by gender, age group, district, municipality
- Real-time calculations
- Dynamic charts with backend data

### ✅ Election Results
- Municipality-wise voter data
- Gender breakdown and average age
- Search and filter capabilities

### ✅ Comparative Analysis (NEW)
- Compare any two districts within a province
- Side-by-side statistics
- Visual comparisons with charts
- Municipality-level breakdown
- Real-time calculations

## Data Flow

```
User Action (Frontend)
    ↓
React Component State Change
    ↓
API Service Call (services/api.ts)
    ↓
HTTP Request to Backend
    ↓
Express Route Handler
    ↓
Controller Function
    ↓
Model/Database Query
    ↓
PostgreSQL Database
    ↓
Results Returned
    ↓
JSON Response
    ↓
Frontend State Update
    ↓
UI Re-render with Real Data
```

## Error Handling

### Frontend
- Try-catch blocks in all API calls
- User-friendly error messages
- Loading states during API calls
- Fallback UI for failed requests

### Backend
- Centralized error handling middleware
- Detailed error logging
- HTTP status codes
- Graceful degradation

## Performance Considerations

1. **Pagination**: Voter search limited to 100 records per request
2. **Lazy Loading**: Data loaded only when needed
3. **Caching**: Consider implementing Redis for frequently accessed data
4. **Database Indexing**: Ensure proper indexes on search columns

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Analytics**: More comparison features
3. **Export Functionality**: CSV/PDF export implementation
4. **Caching**: Redis integration for performance
5. **Authentication**: User login and role-based access
6. **GIS Integration**: Interactive map with voter data
7. **Historical Data**: Year-over-year comparisons

## Troubleshooting

### Issue: "Failed to fetch"
- Check if backend server is running on port 5000
- Verify `.env` file has correct `VITE_API_URL`
- Check CORS settings in backend

### Issue: "No data returned"
- Verify database connection in backend
- Check if database has data
- Review backend logs for SQL errors

### Issue: TypeScript errors
- Run `npm install` or `bun install`
- Check type definitions in `types/index.ts`
- Ensure all imports are correct

## Contact & Support

For issues or questions:
1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify database connection
4. Review API endpoint responses

## License

Copyright © 2026 Nepal Election Analysis System
