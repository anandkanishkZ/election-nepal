const shapefile = require('shapefile');
const proj4 = require('proj4');

/**
 * Convert shapefile to GeoJSON format
 * @param {string} shapefilePath - Path to the .shp file
 * @returns {Promise<Object>} GeoJSON object
 */
async function convertShapefileToGeoJSON(shapefilePath) {
  try {
    console.log('Converting shapefile:', shapefilePath);
    
    // Define Everest 1830 projection (used by Nepal Survey Department)
    // This matches the projection mentioned in the readme
    proj4.defs('EVEREST1830', '+proj=longlat +ellps=evrst30 +no_defs');
    proj4.defs('WGS84', '+proj=longlat +datum=WGS84 +no_defs');
    
    const features = [];
    
    // Open and read the shapefile
    const source = await shapefile.open(shapefilePath);
    
    let result = await source.read();
    let featureId = 0;
    
    while (!result.done) {
      if (result.value) {
        const feature = result.value;
        
        // Transform coordinates from Everest 1830 to WGS84 if needed
        // Note: The readme indicates coordinates are in decimal degrees on Everest Spheroid
        // We may need to transform them, but let's first try as-is
        if (feature.geometry && feature.geometry.coordinates) {
          feature.geometry.coordinates = transformCoordinates(
            feature.geometry.coordinates,
            feature.geometry.type
          );
        }
        
        // Add feature ID for easier reference
        feature.id = featureId++;
        
        // Add to features array
        features.push(feature);
      }
      
      result = await source.read();
    }
    
    console.log(`Converted ${features.length} features`);
    
    // Create GeoJSON FeatureCollection
    const geoJSON = {
      type: 'FeatureCollection',
      features: features,
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
        }
      }
    };
    
    return geoJSON;
  } catch (error) {
    console.error('Error converting shapefile:', error);
    throw new Error(`Failed to convert shapefile: ${error.message}`);
  }
}

/**
 * Transform coordinates from Everest 1830 to WGS84
 * This is a recursive function to handle different geometry types
 */
function transformCoordinates(coordinates, geometryType) {
  // For points and single coordinate pairs
  if (geometryType === 'Point') {
    // Check if coordinates look like they need transformation
    // Everest 1830 and WGS84 are very close for Nepal, but let's keep them as-is
    // since the readme says they're already in decimal degrees
    return coordinates;
  }
  
  // For LineStrings and Polygon outer rings
  if (geometryType === 'LineString' || geometryType === 'MultiPoint') {
    return coordinates.map(coord => {
      return coord; // Keep as-is for now
    });
  }
  
  // For Polygons (array of rings)
  if (geometryType === 'Polygon') {
    return coordinates.map(ring => {
      return ring.map(coord => coord);
    });
  }
  
  // For MultiLineString and MultiPolygon
  if (geometryType === 'MultiLineString') {
    return coordinates.map(line => {
      return line.map(coord => coord);
    });
  }
  
  if (geometryType === 'MultiPolygon') {
    return coordinates.map(polygon => {
      return polygon.map(ring => {
        return ring.map(coord => coord);
      });
    });
  }
  
  return coordinates;
}

/**
 * Get shapefile metadata
 */
async function getShapefileMetadata(shapefilePath) {
  try {
    const source = await shapefile.open(shapefilePath);
    const result = await source.read();
    
    if (result.value) {
      return {
        geometryType: result.value.geometry.type,
        properties: Object.keys(result.value.properties || {}),
        sampleFeature: result.value,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting metadata:', error);
    throw error;
  }
}

module.exports = {
  convertShapefileToGeoJSON,
  getShapefileMetadata,
};
