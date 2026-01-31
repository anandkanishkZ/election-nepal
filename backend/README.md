# Nepal Election Analysis - Backend

Express.js backend API for serving GIS data and handling shapefile conversions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Convert shapefile to GeoJSON (required first time)
npm run convert

# Start development server
npm run dev

# Start production server
npm start
```

## 📦 Technologies

- Node.js
- Express.js
- Shapefile (for parsing .shp files)
- Proj4 (for coordinate projections)
- CORS

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── server.js              # Main server file
│   ├── controllers/           # Request handlers
│   │   └── gisController.js   # GIS data endpoints
│   ├── routes/                # API routes
│   │   └── gisRoutes.js       # GIS routes
│   ├── services/              # Business logic
│   │   └── shapefileService.js # Shapefile conversion
│   └── scripts/               # Utility scripts
│       └── convertShapefile.js # Shapefile converter
└── data/                      # Generated GeoJSON files
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Nepal Units
- `GET /api/nepal-units` - Get all local units as GeoJSON
- `GET /api/nepal-units/:id` - Get specific unit by ID

### Statistics
- `GET /api/statistics` - Get data statistics

### Search
- `GET /api/search?q=...` - Search by name
- `GET /api/search?type=...` - Filter by type
- `GET /api/search?district=...` - Filter by district
- `GET /api/search?province=...` - Filter by province

## 🔄 Shapefile Conversion

The backend converts Nepal shapefiles to GeoJSON format:

1. Reads .shp, .dbf, .prj, .shx files
2. Processes features and attributes
3. Handles coordinate transformations (Everest 1830 to WGS84)
4. Generates GeoJSON FeatureCollection
5. Caches result for performance

Run conversion manually:
```bash
npm run convert
```

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🔍 Data Processing

### Shapefile Format
- `.shp` - Shape geometries
- `.dbf` - Attribute data
- `.prj` - Projection information
- `.shx` - Shape index

### Projection
- Source: Everest Spheroid 1830
- Target: WGS84 (for web display)

## 🚀 Performance

- GeoJSON caching (1-hour cache duration)
- File-based storage for converted data
- Optimized memory usage

## 🐛 Troubleshooting

**Shapefile not found**: Check path in `convertShapefile.js`
**Conversion fails**: Ensure all shapefile components (.shp, .dbf, .prj, .shx) exist
**Memory errors**: Large shapefiles may require increased Node.js memory limit

## 📝 Logging

Server logs include:
- Request timestamps and paths
- Shapefile conversion progress
- Error messages with stack traces (in development)
