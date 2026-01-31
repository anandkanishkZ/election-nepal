const shapefile = require('shapefile');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'gis', 'raw', 'NPL_new_wgs');
const outputDir = path.join(__dirname, '..', 'public', 'geojson');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Nepal Administrative Hierarchy:
// Level 0: Country (1 feature - Nepal boundary)
// Level 1: Provinces (7 features)
// Level 2: Districts (77 features)
// Level 3: Municipalities/Wards

const levels = [
  { file: 'hermes_NPL_new_wgs_0', name: 'country', level: 0 },
  { file: 'hermes_NPL_new_wgs_1', name: 'provinces', level: 1 },
  { file: 'hermes_NPL_new_wgs_2', name: 'districts', level: 2 },
  { file: 'hermes_NPL_new_wgs_3', name: 'municipalities', level: 3 }
];

async function convertShapefileToGeoJSON(shpPath, outputPath, levelName) {
  console.log(`Converting ${levelName}...`);
  
  try {
    const features = [];
    const source = await shapefile.open(shpPath);
    
    let result = await source.read();
    while (!result.done) {
      if (result.value) {
        features.push(result.value);
      }
      result = await source.read();
    }
    
    const geojson = {
      type: 'FeatureCollection',
      features: features
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
    console.log(`✓ ${levelName}: ${features.length} features written to ${path.basename(outputPath)}`);
    
    return features.length;
  } catch (error) {
    console.error(`✗ Error converting ${levelName}:`, error.message);
    return 0;
  }
}

async function convertAll() {
  console.log('🗺️  Converting Nepal Shapefiles to GeoJSON\n');
  console.log('='.repeat(60));
  
  for (const level of levels) {
    const shpPath = path.join(inputDir, `${level.file}.shp`);
    const outputPath = path.join(outputDir, `nepal-${level.name}.geojson`);
    
    if (!fs.existsSync(shpPath)) {
      console.log(`⚠️  Warning: ${shpPath} not found, skipping...`);
      continue;
    }
    
    await convertShapefileToGeoJSON(shpPath, outputPath, level.name);
  }
  
  console.log('='.repeat(60));
  console.log('✅ Conversion complete!\n');
  console.log('GeoJSON files saved to:', outputDir);
}

convertAll().catch(console.error);
