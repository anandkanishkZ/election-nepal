# Database Integration Guide

## 🗄️ PostgreSQL Database Connection

The backend now connects to PostgreSQL database **voter_db** with voter and election data.

## 📋 Database Configuration

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voter_db
DB_USER=postgres
DB_PASSWORD=admin123
```

### Connection Details
- **Database**: voter_db
- **User**: postgres
- **Password**: admin123
- **Host**: localhost
- **Port**: 5432

---

## 🔌 New API Endpoints

### Voter Endpoints

#### 1. Get All Voters
```http
GET /api/voters?limit=100&offset=0
```
**Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [...]
}
```

#### 2. Get Voter by ID
```http
GET /api/voters/:id
```

#### 3. Search Voters
```http
GET /api/voters/search/query?name=Ram&district=Kathmandu
```
**Query Parameters:**
- `name` - Search by voter name
- `district` - Filter by district
- `province` - Filter by province
- `municipality` - Filter by municipality

#### 4. Get Voters by Location
```http
GET /api/voters/location/filter?district=Kathmandu&municipality=Kathmandu
```

---

### Statistics Endpoints

#### 5. Get Voter Statistics
```http
GET /api/voter-statistics
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50000,
    "byDistrict": [...],
    "byProvince": [...],
    "byMunicipality": [...]
  }
}
```

#### 6. Get Election Results
```http
GET /api/election-results?municipality=Kathmandu
```

---

### Database Info Endpoints

#### 7. Get Database Info
```http
GET /api/database/info
```
**Response:**
```json
{
  "success": true,
  "database": "voter_db",
  "tables": ["voters", "candidates", "results", ...]
}
```

#### 8. Get Table Schema
```http
GET /api/database/schema/voters
```

---

## 🚀 Quick Start

### 1. Install PostgreSQL Dependencies
```bash
cd backend
npm install
```
This installs:
- `pg` (PostgreSQL client)
- `pg-hstore` (JSON support)

### 2. Configure Database
Update `backend/.env` with your database credentials:
```env
DB_NAME=voter_db
DB_USER=postgres
DB_PASSWORD=admin123
```

### 3. Start Backend
```bash
npm start
```

### 4. Test Connection
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "name": "voter_db"
  }
}
```

---

## 📊 Testing Database Endpoints

### Test Voters Endpoint
```powershell
# Get all voters
curl http://localhost:5000/api/voters

# Get voter by ID
curl http://localhost:5000/api/voters/1

# Search by name
curl "http://localhost:5000/api/voters/search/query?name=Ram"

# Filter by district
curl "http://localhost:5000/api/voters/location/filter?district=Kathmandu"
```

### Test Statistics
```powershell
# Get voter statistics
curl http://localhost:5000/api/voter-statistics

# Get election results
curl http://localhost:5000/api/election-results
```

### Test Database Info
```powershell
# Get all tables
curl http://localhost:5000/api/database/info

# Get voters table schema
curl http://localhost:5000/api/database/schema/voters
```

---

## 🔧 Database Schema

### Expected Tables
The system expects the following tables in `voter_db`:

#### voters table
```sql
CREATE TABLE voters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  district VARCHAR(100),
  province VARCHAR(100),
  municipality VARCHAR(100),
  ward_no INTEGER,
  voter_id VARCHAR(50),
  gender VARCHAR(10),
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Frontend Integration

Update your frontend to fetch voter data:

```typescript
// Fetch voters
const response = await axios.get('http://localhost:5000/api/voters');
const voters = response.data.data;

// Search voters
const searchResults = await axios.get(
  'http://localhost:5000/api/voters/search/query?name=Ram'
);

// Get statistics
const stats = await axios.get('http://localhost:5000/api/voter-statistics');
```

---

## 🐛 Troubleshooting

### Connection Failed
If database connection fails:

1. **Check PostgreSQL is running**
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service postgresql*
   ```

2. **Verify credentials**
   - Database: voter_db exists
   - User: postgres has access
   - Password: admin123 is correct

3. **Check firewall**
   - Port 5432 is open
   - PostgreSQL accepts local connections

4. **Test connection manually**
   ```powershell
   psql -U postgres -d voter_db
   # Enter password: admin123
   ```

### No Data Returned
If endpoints return empty arrays:

1. **Check if tables exist**
   ```sql
   \dt
   ```

2. **Check if data exists**
   ```sql
   SELECT COUNT(*) FROM voters;
   ```

3. **Verify table structure**
   ```sql
   \d voters
   ```

---

## 📝 Database Migration (Optional)

If you need to import data:

```sql
-- Connect to database
psql -U postgres -d voter_db

-- Import from CSV
COPY voters(first_name, last_name, district, province, municipality)
FROM '/path/to/voters.csv'
DELIMITER ','
CSV HEADER;

-- Verify import
SELECT COUNT(*) FROM voters;
```

---

## 🔐 Security Notes

1. **Change default password** in production
2. **Use environment variables** for credentials
3. **Enable SSL** for database connections
4. **Implement rate limiting** for API endpoints
5. **Add authentication** for sensitive data

---

## 📊 Performance Tips

1. **Add indexes** on frequently queried columns:
   ```sql
   CREATE INDEX idx_voters_district ON voters(district);
   CREATE INDEX idx_voters_municipality ON voters(municipality);
   CREATE INDEX idx_voters_name ON voters(first_name, last_name);
   ```

2. **Enable query caching** in the application

3. **Use pagination** for large datasets

4. **Monitor slow queries**:
   ```sql
   SELECT * FROM pg_stat_statements 
   ORDER BY total_time DESC 
   LIMIT 10;
   ```

---

## 🎯 Next Steps

1. ✅ Database connected
2. ✅ API endpoints created
3. ⏳ Test endpoints with your data
4. ⏳ Update frontend to display voter data
5. ⏳ Add data visualization charts
6. ⏳ Implement advanced search filters

---

## 📞 Support

If you encounter issues:
1. Check backend logs for error messages
2. Verify database connection in `/health` endpoint
3. Test SQL queries directly in psql
4. Review the error stack trace

---

**Database**: voter_db  
**Status**: ✅ Connected  
**Endpoints**: 8 new API endpoints added  
**Ready**: Backend is ready to serve voter data!
