# Nepal Election Analysis - Technical Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                      (http://localhost:3000)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND (Next.js)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages Layer                                              │  │
│  │  • index.tsx - Main entry with map                        │  │
│  │  • _app.tsx - Global app wrapper                          │  │
│  │  • _document.tsx - HTML document                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components Layer                                          │  │
│  │  • NepalMap.tsx - Main GIS map component                  │  │
│  │    - Leaflet/React-Leaflet integration                    │  │
│  │    - Interactive controls                                 │  │
│  │    - Popups and tooltips                                  │  │
│  │    - Color coding and legends                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Styles Layer                                              │  │
│  │  • Tailwind CSS                                            │  │
│  │  • Custom global styles                                    │  │
│  │  • Leaflet CSS overrides                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Axios HTTP Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
│                      (http://localhost:5000)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                              │  │
│  │  • gisRoutes.js                                            │  │
│  │    - GET /api/nepal-units                                  │  │
│  │    - GET /api/nepal-units/:id                              │  │
│  │    - GET /api/statistics                                   │  │
│  │    - GET /api/search                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers Layer                                         │  │
│  │  • gisController.js                                        │  │
│  │    - Request handling                                      │  │
│  │    - Data validation                                       │  │
│  │    - Response formatting                                   │  │
│  │    - Error handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services Layer                                            │  │
│  │  • shapefileService.js                                     │  │
│  │    - Shapefile parsing                                     │  │
│  │    - GeoJSON conversion                                    │  │
│  │    - Coordinate transformation                             │  │
│  │    - Caching logic                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Scripts Layer                                             │  │
│  │  • convertShapefile.js                                     │  │
│  │    - Batch conversion utility                              │  │
│  │    - Metadata extraction                                   │  │
│  │    - Statistics generation                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ File I/O
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                        DATA STORAGE                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Shapefile Input                                           │  │
│  │  • NepalLocalUnits0.shp (geometries)                      │  │
│  │  • NepalLocalUnits0.dbf (attributes)                      │  │
│  │  • NepalLocalUnits0.prj (projection)                      │  │
│  │  • NepalLocalUnits0.shx (index)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GeoJSON Output (Cached)                                   │  │
│  │  • nepal-units.geojson                                     │  │
│  │    - Web-optimized format                                  │  │
│  │    - WGS84 projection                                      │  │
│  │    - Feature collection                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. User opens browser → Frontend loads
                        ↓
2. Frontend requests data → GET /api/nepal-units
                        ↓
3. Backend checks cache → Cache valid?
        │                        │
        NO                      YES
        ↓                        ↓
4a. Read shapefile      4b. Return cached
    Convert to GeoJSON      GeoJSON
    Save to cache
        ↓                        ↓
5. Return GeoJSON to frontend
                        ↓
6. Frontend renders map with Leaflet
                        ↓
7. User interacts → Updates view/filters
```

## Technology Stack Details

### Frontend Technologies
```
Next.js 14.0.4
├── React 18.2.0 (UI framework)
├── TypeScript 5.3.3 (Type safety)
├── Leaflet 1.9.4 (Mapping library)
├── React-Leaflet 4.2.1 (React bindings)
├── Tailwind CSS 3.3.6 (Styling)
├── Axios 1.6.2 (HTTP client)
└── PostCSS + Autoprefixer (CSS processing)
```

### Backend Technologies
```
Node.js (Runtime)
├── Express 4.18.2 (Web framework)
├── Shapefile 0.6.6 (Shapefile parser)
├── Proj4 2.9.2 (Coordinate projections)
├── CORS 2.8.5 (Cross-origin support)
├── Dotenv 16.3.1 (Environment config)
└── Nodemon 3.0.2 (Dev auto-reload)
```

## Key Features Implementation

### 1. Interactive Map
- **Library**: Leaflet.js
- **Components**: MapContainer, TileLayer, GeoJSON
- **Tiles**: OpenStreetMap
- **Projections**: WGS84 (EPSG:4326)

### 2. Shapefile Processing
- **Input**: ESRI Shapefile format
- **Processing**: Node.js shapefile library
- **Transformation**: Everest 1830 → WGS84
- **Output**: GeoJSON FeatureCollection

### 3. Performance Optimization
- **Caching**: 1-hour in-memory cache
- **File storage**: Pre-converted GeoJSON
- **SSR**: Disabled for Leaflet components
- **Code splitting**: Dynamic imports

### 4. Responsive Design
- **Framework**: Tailwind CSS
- **Mobile**: Touch-enabled interactions
- **Desktop**: Full feature set
- **Adaptive**: Auto-scaling UI

## API Specifications

### Endpoint: GET /api/nepal-units
**Response Format:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 0,
      "properties": {
        "NAME": "Unit Name",
        "TYPE": "Metropolitan",
        "DISTRICT": "District Name",
        "PROVINCE": "Province Name"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      }
    }
  ]
}
```

### Endpoint: GET /api/statistics
**Response Format:**
```json
{
  "totalUnits": 753,
  "types": {
    "Metropolitan": 6,
    "Sub-Metropolitan": 11,
    "Municipality": 276,
    "Rural Municipality": 460
  },
  "districts": 77,
  "provinces": 7
}
```

## Security Considerations

- **CORS**: Restricted to frontend origin
- **Input Validation**: Query parameter sanitization
- **Error Handling**: No sensitive data in errors
- **Rate Limiting**: Can be added if needed
- **Environment Variables**: Sensitive config in .env

## Deployment Recommendations

### Production Setup
1. **Frontend**: Deploy to Vercel/Netlify
2. **Backend**: Deploy to Heroku/Railway/AWS
3. **CDN**: CloudFront for static assets
4. **Database**: Optional PostgreSQL with PostGIS

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Backend (.env)
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## Monitoring & Maintenance

### Logging
- Request/response logging
- Error tracking
- Performance metrics

### Health Checks
- `/health` endpoint
- Uptime monitoring
- API response times

### Updates
- Regular dependency updates
- Security patches
- Feature enhancements

## Future Enhancements

1. **Database Integration**
   - PostgreSQL + PostGIS
   - Redis for caching
   - Historical data storage

2. **Advanced Features**
   - Election data overlay
   - Time-series analysis
   - Demographic integration
   - Export capabilities

3. **Performance**
   - Vector tiles
   - Server-side rendering options
   - Progressive Web App (PWA)

4. **Analytics**
   - User behavior tracking
   - Map interaction analytics
   - Performance monitoring

---

**Documentation Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: Natraj Technology
