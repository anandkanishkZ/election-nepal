/**
 * Script to pre-convert the Nepal shapefile to GeoJSON
 * Run this with: npm run convert
 */

const path = require('path');
const fs = require('fs').promises;
const shapefileService = require('../services/shapefileService');

async function convertShapefile() {
  try {
    console.log('='.repeat(60));
    console.log('Starting shapefile conversion...');
    console.log('='.repeat(60));
    
    // Path to the shapefile
    const shapefilePath = path.join(__dirname, '../../../frontend/NepalLocalUnits0/NepalLocalUnits0.shp');
    
    // Check if file exists
    try {
      await fs.access(shapefilePath);
      console.log('✓ Shapefile found:', shapefilePath);
    } catch (error) {
      console.error('✗ Shapefile not found:', shapefilePath);
      console.error('Please ensure the shapefile exists at the specified location.');
      process.exit(1);
    }
    
    // Get metadata first
    console.log('\nGetting shapefile metadata...');
    const metadata = await shapefileService.getShapefileMetadata(shapefilePath);
    console.log('✓ Metadata retrieved:');
    console.log('  - Geometry Type:', metadata.geometryType);
    console.log('  - Properties:', metadata.properties.join(', '));
    
    // Convert shapefile to GeoJSON
    console.log('\nConverting shapefile to GeoJSON...');
    const geoJSON = await shapefileService.convertShapefileToGeoJSON(shapefilePath);
    console.log('✓ Conversion complete');
    console.log('  - Total features:', geoJSON.features.length);
    
    // Save GeoJSON to file
    const outputPath = path.join(__dirname, '../../data/nepal-units.geojson');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(geoJSON, null, 2));
    console.log('✓ GeoJSON saved:', outputPath);
    
    // Print some statistics
    console.log('\n' + '='.repeat(60));
    console.log('Conversion Statistics:');
    console.log('='.repeat(60));
    
    const types = {};
    geoJSON.features.forEach(feature => {
      const type = feature.properties.TYPE || feature.properties.type || 'Unknown';
      types[type] = (types[type] || 0) + 1;
    });
    
    console.log('Unit Types:');
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
    
    console.log('\n✓ Conversion successful!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Error during conversion:');
    console.error('='.repeat(60));
    console.error(error);
    process.exit(1);
  }
}

// Run the conversion
convertShapefile();
