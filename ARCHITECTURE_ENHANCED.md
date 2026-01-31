# 🏗️ Enhanced System Architecture

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                    (React + TypeScript)                          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │ Comparative  │  │ Voter Search │          │
│  │    Page      │  │  Analysis    │  │    Page      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Comparison Components (NEW)                      │  │
│  │  • ComparisonCard   • RegionComparisonTable              │  │
│  │  • MultiRegionChart • TrendComparisonChart               │  │
│  │  • ComparisonFilter                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
                         API Service
                    (Axios / Fetch API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REST API LAYER                              │
│                  (Express.js + Node.js)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Endpoints                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │    Voter     │  │ Comparative  │  │  Hierarchy   │    │ │
│  │  │   Routes     │  │   Routes     │  │   Routes     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Controllers                               │ │
│  │  • voterController         • comparativeController (NEW)   │ │
│  │  • gisController           • hierarchyController           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Models                                 │ │
│  │  • voterModel              • comparativeModel (NEW)        │ │
│  │  • Complex SQL queries     • JOIN operations               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                               │
│                      PostgreSQL                                  │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  voters  │  │provinces │  │districts │  │municipali│       │
│  │  table   │  │  table   │  │  table   │  │   ties   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  • 18M+ voter records                                            │
│  • Geographic hierarchy                                          │
│  • Demographic data                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - Comparative Analysis

```
1. USER ACTION
   └─> Select regions for comparison
       └─> Click "Compare Selected" button

2. FRONTEND
   └─> api.comparative.compareRegions(type, regions)
       └─> POST request to backend

3. BACKEND ROUTE
   └─> /api/compare/regions
       └─> comparativeController.compareRegions()

4. CONTROLLER
   └─> Validate input (type, regions)
       └─> Call comparativeModel.compareRegions()

5. MODEL
   └─> Build complex SQL query
       ├─> JOIN voters with geographic tables
       ├─> GROUP BY region
       ├─> Calculate statistics (COUNT, AVG, etc.)
       └─> Return aggregated data

6. DATABASE
   └─> Execute query on PostgreSQL
       └─> Return results

7. RESPONSE FLOW
   └─> Model processes results
       └─> Controller formats response
           └─> API sends JSON to frontend
               └─> Frontend updates UI
                   └─> User sees comparison results
```

---

## 🗂️ Database Schema Relationships

```
┌─────────────┐
│  provinces  │
│─────────────│
│ id (PK)     │───┐
│ name_np     │   │
│ name_en     │   │
└─────────────┘   │
                  │ province_id (FK)
                  ▼
              ┌─────────────┐
              │  districts  │
              │─────────────│
              │ id (PK)     │───┐
              │ province_id │   │
              │ name_np     │   │
              │ name_en     │   │
              └─────────────┘   │
                                │ district_id (FK)
                                ▼
                            ┌──────────────┐
                            │municipalities│
                            │──────────────│
                            │ id (PK)      │───┐
                            │ district_id  │   │
                            │ name_np      │   │
                            │ name_en      │   │
                            └──────────────┘   │
                                               │ municipality_id (FK)
                                               ▼
                                           ┌─────────┐
                                           │  wards  │
                                           │─────────│
                                           │ id (PK) │───┐
                                           │ munici- │   │
                                           │ pality_ │   │
                                           │ id      │   │
                                           └─────────┘   │
                                                         │ ward_id (FK)
                                                         ▼
                                                    ┌──────────┐
                                                    │ voting_  │
                                                    │ booths   │
                                                    │──────────│
                                                    │ id (PK)  │───┐
                                                    │ ward_id  │   │
                                                    └──────────┘   │
                                                                   │ booth_id (FK)
                                                                   ▼
                                                              ┌─────────┐
                                                              │ voters  │
                                                              │─────────│
                                                              │ id (PK) │
                                                              │ booth_id│
                                                              │ name_np │
                                                              │ gender  │
                                                              │ age     │
                                                              │ voter_id│
                                                              └─────────┘
```

---

## 🎨 Frontend Component Hierarchy

```
App
├── MainLayout
│   ├── Header / Navigation
│   ├── Sidebar
│   └── Main Content Area
│       │
│       ├── Dashboard (Index.tsx)
│       │   ├── StatCard (x8)
│       │   ├── NepalMap
│       │   ├── ProvinceChart (TOP 10 DISTRICTS)
│       │   ├── GenderPieChart
│       │   ├── AgeDistributionChart
│       │   └── PartySeatsChart
│       │
│       ├── ComparativeAnalysisPage ✨ NEW
│       │   ├── Hero Section
│       │   ├── Custom Region Comparison
│       │   │   ├── Select (Comparison Type)
│       │   │   └── Button (Compare Selected)
│       │   │
│       │   ├── ComparisonFilter ✨
│       │   │   ├── Province Checkboxes
│       │   │   └── District Checkboxes
│       │   │
│       │   ├── RegionComparisonTable ✨
│       │   │   └── Comparison Results
│       │   │
│       │   └── Tabs
│       │       ├── Provinces Tab
│       │       │   ├── RegionComparisonTable
│       │       │   ├── ComparisonCard
│       │       │   └── MultiRegionChart
│       │       │
│       │       ├── Districts Tab
│       │       │   ├── ComparisonCard
│       │       │   └── MultiRegionChart
│       │       │
│       │       └── Demographics Tab
│       │           ├── ComparisonCard
│       │           └── Gender Statistics Cards
│       │
│       ├── VoterSearchPage
│       ├── ElectionResultsPage
│       └── GISMapPage
│
└── Footer
```

---

## 🚀 API Endpoint Architecture

### Comparative Analytics Endpoints ✨ NEW

```
/api/compare/
├── POST   /regions
│   └─> Compare multiple regions (provinces/districts/municipalities)
│
├── POST   /demographics
│   └─> Compare demographic breakdowns
│
├── GET    /age-distribution
│   └─> Age group comparison across regions
│
├── GET    /gender-ratio
│   └─> Gender ratio comparison by region type
│
├── GET    /provinces
│   └─> Comprehensive province-level comparison
│
├── GET    /district-rankings
│   └─> District rankings by various metrics
│
├── POST   /turnout
│   └─> Turnout comparison (placeholder)
│
└── GET    /dashboard/comparative-stats
    └─> All-in-one dashboard statistics
```

### Existing Voter Endpoints

```
/api/
├── GET    /voters
│   └─> Get all voters with pagination
│
├── GET    /voters/:id
│   └─> Get voter by ID
│
├── GET    /voters/search/query
│   └─> Search voters by criteria
│
├── GET    /voters/location/filter
│   └─> Filter voters by location
│
├── GET    /voter-statistics
│   └─> Get overall voter statistics
│
└── GET    /location-statistics/:type/:name
    └─> Get statistics for specific location
```

---

## 📊 Comparison Query Example

### SQL Query Structure for Province Comparison:

```sql
SELECT 
  p.name_np as province,
  COUNT(v.id) as total_voters,
  COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male_voters,
  COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female_voters,
  ROUND(AVG(v.age), 1) as average_age,
  COUNT(DISTINCT d.id) as total_districts,
  COUNT(DISTINCT m.id) as total_municipalities
FROM voters v
LEFT JOIN voting_booths vb ON v.booth_id = vb.id
LEFT JOIN wards w ON vb.ward_id = w.id
LEFT JOIN municipalities m ON w.municipality_id = m.id
LEFT JOIN districts d ON m.district_id = d.id
LEFT JOIN provinces p ON d.province_id = p.id
WHERE p.name_np IS NOT NULL
GROUP BY p.name_np
ORDER BY total_voters DESC;
```

**What this query does:**
1. Joins voters with full geographic hierarchy
2. Counts total voters per province
3. Separates male/female counts
4. Calculates average age
5. Counts districts and municipalities
6. Groups results by province
7. Orders by voter count

---

## 🎯 State Management Flow

```
┌─────────────────────────────────────────────────────┐
│            React Component State                     │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │  loading: boolean                               │ │
│  │  provinceComparison: Province[] | null          │ │
│  │  districtRankings: District[] | null            │ │
│  │  genderComparison: GenderData[] | null          │ │
│  │  selectedRegions: string[]                      │ │
│  │  comparisonType: 'province' | 'district'        │ │
│  │  regionComparisonData: ComparisonResult[] | null│ │
│  └────────────────────────────────────────────────┘ │
│                        ▼                             │
│  ┌────────────────────────────────────────────────┐ │
│  │         useEffect Hooks                         │ │
│  │  • Fetch data on mount                          │ │
│  │  • Update on filter change                      │ │
│  │  • Refresh on button click                      │ │
│  └────────────────────────────────────────────────┘ │
│                        ▼                             │
│  ┌────────────────────────────────────────────────┐ │
│  │         Event Handlers                          │ │
│  │  • handleFilterChange()                         │ │
│  │  • handleCompareRegions()                       │ │
│  │  • fetchComparativeData()                       │ │
│  │  • exportData()                                 │ │
│  └────────────────────────────────────────────────┘ │
│                        ▼                             │
│  ┌────────────────────────────────────────────────┐ │
│  │         Child Components                        │ │
│  │  • Receive props (data, loading, etc.)          │ │
│  │  • Render based on state                        │ │
│  │  • Show loading/error/empty states              │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Error Handling Strategy

```
┌─────────────────────────────────────────────────────┐
│              Error Handling Layers                   │
│                                                       │
│  Layer 1: Database                                   │
│  └─> PostgreSQL errors                               │
│      └─> Connection failures                         │
│      └─> Query syntax errors                         │
│      └─> Timeout errors                              │
│                                                       │
│  Layer 2: Backend Model                              │
│  └─> Try-catch blocks                                │
│      └─> Log errors to console                       │
│      └─> Throw error to controller                   │
│                                                       │
│  Layer 3: Backend Controller                         │
│  └─> Catch model errors                              │
│      └─> Format error response                       │
│      └─> Return 500/400 status codes                 │
│                                                       │
│  Layer 4: Frontend API Service                       │
│  └─> Catch HTTP errors                               │
│      └─> Log to console                              │
│      └─> Throw error to component                    │
│                                                       │
│  Layer 5: Frontend Component                         │
│  └─> Try-catch in async functions                    │
│      └─> Update error state                          │
│      └─> Show error message to user                  │
│      └─> Provide retry option                        │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Flow - Comparative Analysis

```
User Journey:
1. Navigate to Comparative Analysis
   └─> See hero section with title and actions
   
2. View Default Comparisons
   └─> All provinces comparison
   └─> Top 15 districts
   └─> Gender ratio insights
   
3. Custom Comparison (Optional)
   ├─> Select comparison type (Province/District)
   ├─> Expand filter component
   ├─> Check desired regions
   ├─> Click "Compare Selected"
   └─> View side-by-side results
   
4. Explore Tabs
   ├─> Provinces Tab
   │   └─> Comprehensive 7-province comparison
   │
   ├─> Districts Tab
   │   └─> Top districts ranking
   │
   └─> Demographics Tab
       └─> Gender and age insights

5. Export Data (Future)
   └─> Click export button
   └─> Download CSV/PDF
```

---

## 📦 Technology Stack Details

```
Frontend:
├── React 18+
├── TypeScript
├── Vite (Build tool)
├── Tailwind CSS
├── shadcn/ui components
├── Recharts
├── Framer Motion
├── Lucide React (Icons)
└── React Router

Backend:
├── Node.js
├── Express.js
├── PostgreSQL
├── pg (node-postgres)
├── CORS middleware
├── dotenv
└── Morgan (logging)

Development:
├── ESLint
├── Prettier
├── TypeScript compiler
└── Nodemon
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Production Setup                    │
│                                                       │
│  Frontend (Static Hosting)                          │
│  ├── Vercel / Netlify / CloudFlare Pages           │
│  ├── Build: npm run build                           │
│  ├── Output: dist/                                  │
│  └── Environment: VITE_API_URL                      │
│                                                       │
│  Backend (Node.js Server)                           │
│  ├── AWS EC2 / DigitalOcean / Heroku               │
│  ├── Process Manager: PM2                           │
│  ├── Reverse Proxy: Nginx                           │
│  └── Environment: .env file                         │
│                                                       │
│  Database (PostgreSQL)                              │
│  ├── AWS RDS / DigitalOcean DB / Self-hosted       │
│  ├── Backup strategy                                │
│  ├── Connection pooling                             │
│  └── SSL connection                                 │
│                                                       │
│  Monitoring                                          │
│  ├── Application logs                               │
│  ├── Database performance                           │
│  ├── API response times                             │
│  └── Error tracking                                 │
└─────────────────────────────────────────────────────┘
```

---

**This architecture provides a scalable, maintainable, and professional election analysis platform with comprehensive comparative capabilities.**
