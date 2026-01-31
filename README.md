# Nepal Election Analysis - GIS Map Application

A comprehensive GIS (Geographic Information System) application for visualizing and analyzing Nepal's local administrative units using interactive maps.

## 🌟 Features

- **Interactive GIS Map**: Full-featured map of Nepal showing all local administrative units
- **Shapefile Support**: Converts and displays Nepal Survey Department shapefiles
- **Real-time Visualization**: Interactive hover effects, popups, and unit selection
- **Color Coding**: Visual differentiation by unit types (Metropolitan, Sub-Metropolitan, Municipality, Rural Municipality)
- **Search & Filter**: Search for specific units by name, type, district, or province
- **Statistics Dashboard**: View comprehensive statistics about administrative units
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type safety
- **Leaflet** - Interactive mapping library
- **React-Leaflet** - React components for Leaflet
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Shapefile** - Shapefile parsing library
- **Proj4** - Coordinate projection library

## 📁 Project Structure

```
Election Analysis/
├── frontend/                 # Next.js frontend application
│   ├── components/          # React components
│   │   └── NepalMap.tsx    # Main GIS map component
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx       # Home page with map
│   │   ├── _app.tsx        # App wrapper
│   │   └── _document.tsx   # HTML document
│   ├── styles/             # CSS styles
│   │   └── globals.css     # Global styles
│   ├── NepalLocalUnits0/   # GIS shapefile data
│   └── package.json        # Frontend dependencies
│
└── backend/                 # Node.js backend API
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic
    │   └── scripts/        # Utility scripts
    ├── data/               # Generated GeoJSON files
    └── package.json        # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Git (optional)

### Installation

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2. Convert Shapefile to GeoJSON

```bash
cd backend
npm run convert
```

This will process the Nepal shapefile and generate a GeoJSON file for web display.

#### 3. Start Backend Server

```bash
npm start
```

The backend will run on http://localhost:5000

#### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

#### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on http://localhost:3000

#### 6. Open in Browser

Navigate to http://localhost:3000 to see the interactive GIS map!

## 📡 API Endpoints

### Backend API (http://localhost:5000)

- `GET /health` - Health check
- `GET /api/nepal-units` - Get all local units as GeoJSON
- `GET /api/nepal-units/:id` - Get specific unit by ID
- `GET /api/statistics` - Get statistics about the data
- `GET /api/search?q=...` - Search units by name, type, district, or province

### Example API Calls

```bash
# Get all units
curl http://localhost:5000/api/nepal-units

# Search for a unit
curl http://localhost:5000/api/search?q=Kathmandu

# Filter by type
curl http://localhost:5000/api/search?type=Metropolitan

# Get statistics
curl http://localhost:5000/api/statistics
```

## 🗺️ GIS Data

The application uses official GIS data from the Nepal Survey Department:
- **Source**: Survey Department, Ministry of Land Management, Cooperatives and Poverty Alleviation
- **Format**: Shapefile (.shp, .dbf, .prj, .shx)
- **Scale**: 1:1,000,000
- **Projection**: Everest Spheroid 1830
- **Coverage**: All local administrative units of Nepal

## 🎨 Map Features

### Interactive Controls
- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag
- **Hover**: Highlight units on mouseover
- **Click**: View detailed information in popup

### Color Coding
- **Crimson Red**: Metropolitan Cities
- **Tomato**: Sub-Metropolitan Cities
- **Royal Blue**: Municipalities
- **Lime Green**: Rural Municipalities

### Information Display
Each unit popup shows:
- Unit name
- Type (Metropolitan, Sub-Metropolitan, Municipality, Rural Municipality)
- District
- Province
- Additional attributes from the GIS data

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

### Backend Development

```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run convert  # Convert shapefile to GeoJSON
```

## 📦 Production Build

### Backend

```bash
cd backend
npm install --production
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

### Issue: Map not loading

**Solution**: Ensure the backend server is running on port 5000. Check the console for errors.

### Issue: Shapefile not found

**Solution**: Make sure the shapefile is located at `frontend/NepalLocalUnits0/NepalLocalUnits0.shp`. Run the conversion script again.

### Issue: CORS errors

**Solution**: Check that the backend `.env` file has the correct `FRONTEND_URL` setting.

### Issue: Leaflet icons not showing

**Solution**: The application automatically fixes this with CDN links. Check your internet connection.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Nepal Survey Department for providing the GIS data
- OpenStreetMap contributors for the base map tiles
- Leaflet team for the excellent mapping library

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: [your-email@example.com]

## 🔮 Future Enhancements

- [ ] Election data visualization overlay
- [ ] Time-series analysis of election results
- [ ] Demographic data integration
- [ ] Advanced filtering and querying
- [ ] Export capabilities (PDF, PNG, CSV)
- [ ] Mobile app version
- [ ] Real-time data updates
- [ ] 3D terrain visualization
- [ ] Heatmap overlays

---

**Made with ❤️ for Nepal**
