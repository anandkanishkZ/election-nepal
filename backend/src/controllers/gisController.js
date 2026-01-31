const path = require('path');
const fs = require('fs').promises;
const shapefileService = require('../services/shapefileService');

// Cache for GeoJSON data
let cachedGeoJSON = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get all Nepal local units as GeoJSON
 */
exports.getNepalUnits = async (req, res, next) => {
  try {
    console.log('Fetching Nepal units GeoJSON data...');

    // Check if cached data is still valid
    const now = Date.now();
    if (cachedGeoJSON && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Serving from cache');
      return res.json(cachedGeoJSON);
    }

    // Check if pre-converted GeoJSON exists
    const geoJsonPath = path.join(__dirname, '../../data/nepal-units.geojson');
    
    try {
      const geoJsonData = await fs.readFile(geoJsonPath, 'utf-8');
      const geoJson = JSON.parse(geoJsonData);
      
      // Update cache
      cachedGeoJSON = geoJson;
      cacheTimestamp = now;
      
      console.log('Serving from file:', geoJsonPath);
      return res.json(geoJson);
    } catch (fileError) {
      console.log('Pre-converted GeoJSON not found, converting shapefile...');
      
      // Convert shapefile to GeoJSON
      const shapefilePath = path.join(__dirname, '../../..', 'frontend/NepalLocalUnits0/NepalLocalUnits0.shp');
      const geoJson = await shapefileService.convertShapefileToGeoJSON(shapefilePath);
      
      // Save converted GeoJSON for future use
      await fs.mkdir(path.dirname(geoJsonPath), { recursive: true });
      await fs.writeFile(geoJsonPath, JSON.stringify(geoJson, null, 2));
      
      // Update cache
      cachedGeoJSON = geoJson;
      cacheTimestamp = now;
      
      console.log('Shapefile converted and cached successfully');
      return res.json(geoJson);
    }
  } catch (error) {
    console.error('Error getting Nepal units:', error);
    next({
      status: 500,
      message: 'Failed to load Nepal units data. Please ensure the shapefile exists.',
      details: error.message,
    });
  }
};

/**
 * Get specific unit by ID
 */
exports.getUnitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get all units first
    const geoJsonPath = path.join(__dirname, '../../data/nepal-units.geojson');
    const geoJsonData = await fs.readFile(geoJsonPath, 'utf-8');
    const geoJson = JSON.parse(geoJsonData);
    
    // Find the specific feature
    const feature = geoJson.features.find((f, index) => 
      f.id === id || index.toString() === id || f.properties.FID === id
    );
    
    if (!feature) {
      return res.status(404).json({
        error: true,
        message: 'Unit not found',
      });
    }
    
    res.json(feature);
  } catch (error) {
    console.error('Error getting unit by ID:', error);
    next({
      status: 500,
      message: 'Failed to get unit data',
      details: error.message,
    });
  }
};

/**
 * Get statistics about the data
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const geoJsonPath = path.join(__dirname, '../../data/nepal-units.geojson');
    const geoJsonData = await fs.readFile(geoJsonPath, 'utf-8');
    const geoJson = JSON.parse(geoJsonData);
    
    const stats = {
      totalUnits: geoJson.features.length,
      types: {},
      districts: new Set(),
      provinces: new Set(),
    };
    
    geoJson.features.forEach(feature => {
      const props = feature.properties;
      
      // Count by type
      const type = props.TYPE || props.type || 'Unknown';
      stats.types[type] = (stats.types[type] || 0) + 1;
      
      // Collect unique districts and provinces
      if (props.DISTRICT || props.district) {
        stats.districts.add(props.DISTRICT || props.district);
      }
      if (props.PROVINCE || props.province) {
        stats.provinces.add(props.PROVINCE || props.province);
      }
    });
    
    res.json({
      ...stats,
      districts: stats.districts.size,
      provinces: stats.provinces.size,
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    next({
      status: 500,
      message: 'Failed to get statistics',
      details: error.message,
    });
  }
};

/**
 * Search units by name or other properties
 */
exports.searchUnits = async (req, res, next) => {
  try {
    const { q, type, district, province } = req.query;
    
    if (!q && !type && !district && !province) {
      return res.status(400).json({
        error: true,
        message: 'Please provide at least one search parameter (q, type, district, or province)',
      });
    }
    
    const geoJsonPath = path.join(__dirname, '../../data/nepal-units.geojson');
    const geoJsonData = await fs.readFile(geoJsonPath, 'utf-8');
    const geoJson = JSON.parse(geoJsonData);
    
    const results = geoJson.features.filter(feature => {
      const props = feature.properties;
      
      // Text search in name
      if (q) {
        const name = (props.NAME || props.name || '').toLowerCase();
        if (!name.includes(q.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by type
      if (type) {
        const unitType = (props.TYPE || props.type || '').toLowerCase();
        if (unitType !== type.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by district
      if (district) {
        const unitDistrict = (props.DISTRICT || props.district || '').toLowerCase();
        if (unitDistrict !== district.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by province
      if (province) {
        const unitProvince = (props.PROVINCE || props.province || '').toLowerCase();
        if (unitProvince !== province.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    });
    
    res.json({
      type: 'FeatureCollection',
      features: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching units:', error);
    next({
      status: 500,
      message: 'Failed to search units',
      details: error.message,
    });
  }
};
